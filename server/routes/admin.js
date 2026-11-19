import express from 'express';
import multer from 'multer';
import { query } from '../db.js';
import { requireAdminAuth } from '../auth.js';
import {
  uploadToB2,
  deleteFromB2,
  getObjectFromB2,
  getPresignedDownloadUrl,
  extractKeyFromUrl,
  validateKey,
} from '../b2.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this router
router.use(requireAdminAuth);

// Multer storage for admin file uploads (images & MP4 videos)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 55 * 1024 * 1024 }, // Up to 55 MB for MP4 reviews
  fileFilter: (_req, file, cb) => {
    const isImage = /\.(jpe?g|png|webp|svg)$/i.test(file.originalname);
    const isVideo = /\.(mp4)$/i.test(file.originalname) || file.mimetype === 'video/mp4';
    const isDoc = /\.(pdf|doc|docx)$/i.test(file.originalname);

    if (isImage || isVideo || isDoc) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Allowed: JPG, PNG, WEBP, SVG, MP4, PDF, DOC.'));
    }
  }
});

// =========================================================================
// 1. FILE UPLOAD TO BACKBLAZE B2
// =========================================================================
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided for upload' });
    }

    const folder = req.body.folder || 'general';
    const result = await uploadToB2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    return res.json({
      success: true,
      key: result.key,
      url: result.url,
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    console.error('[Admin Upload Error]:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to upload asset to storage' });
  }
});

// =========================================================================
// 2. DASHBOARD REAL STATISTICS
// =========================================================================
router.get('/stats', async (req, res) => {
  try {
    const [jobsCount] = await query(`
      SELECT 
        COUNT(*) as total_jobs,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_jobs,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_jobs,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_jobs
      FROM jobs;
    `);

    const [appsCount] = await query(`
      SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
        SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted_applications,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications,
        SUM(CASE WHEN status = 'selected' THEN 1 ELSE 0 END) as selected_applications
      FROM applications;
    `);

    const [reviewsCount] = await query(`
      SELECT 
        COUNT(*) as total_reviews,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_reviews
      FROM reviews;
    `);

    const [galleryCount] = await query(`
      SELECT COUNT(*) as gallery_count FROM gallery;
    `);

    const recentApps = await query(`
      SELECT id, candidate_name, mobile, email, job_title_snapshot, status, created_at 
      FROM applications 
      ORDER BY created_at DESC 
      LIMIT 6;
    `);

    const recentJobs = await query(`
      SELECT id, title, country, category, salary, vacancies, status, created_at 
      FROM jobs 
      ORDER BY created_at DESC 
      LIMIT 6;
    `);

    return res.json({
      success: true,
      data: {
        total_jobs: Number(jobsCount.total_jobs || 0),
        published_jobs: Number(jobsCount.published_jobs || 0),
        closed_jobs: Number(jobsCount.closed_jobs || 0),
        draft_jobs: Number(jobsCount.draft_jobs || 0),
        total_applications: Number(appsCount.total_applications || 0),
        pending_applications: Number(appsCount.pending_applications || 0),
        shortlisted_applications: Number(appsCount.shortlisted_applications || 0),
        rejected_applications: Number(appsCount.rejected_applications || 0),
        selected_applications: Number(appsCount.selected_applications || 0),
        total_reviews: Number(reviewsCount.total_reviews || 0),
        published_reviews: Number(reviewsCount.published_reviews || 0),
        gallery_count: Number(galleryCount.gallery_count || 0),
        recent_applications: recentApps,
        recent_jobs: recentJobs,
      }
    });
  } catch (err) {
    console.error('[Admin Stats Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load dashboard metrics' });
  }
});

// =========================================================================
// 3. JOB MANAGEMENT
// =========================================================================
router.get('/jobs', async (req, res) => {
  try {
    const { country, status, search } = req.query;
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (country && country !== 'All') {
      sql += ' AND country = ?';
      params.push(country);
    }
    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (search && search.trim()) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(category) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC;';
    const jobs = await query(sql, params);
    const normalized = jobs.map((j) => ({ ...j, deadline: j.application_deadline }));
    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[Admin Jobs Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load jobs' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      country,
      location,
      category,
      salary,
      vacancies,
      experience,
      qualification,
      description,
      responsibilities,
      benefits,
      deadline,
      status,
    } = req.body;

    if (!title || !country || !location || !category || !salary) {
      return res.status(400).json({ success: false, error: 'Missing required job fields' });
    }

    const cleanDeadline = deadline && deadline.trim() ? deadline.trim() : null;

    const result = await query(
      `INSERT INTO jobs 
       (title, country, location, category, salary, vacancies, experience, qualification, description, responsibilities, benefits, application_deadline, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());`,
      [
        title.trim(),
        country,
        location.trim(),
        category.trim(),
        salary.trim(),
        Number(vacancies || 1),
        experience?.trim() || 'Not specified',
        qualification?.trim() || 'Not specified',
        description?.trim() || '',
        responsibilities?.trim() || '',
        benefits?.trim() || '',
        cleanDeadline,
        status || 'published',
      ]
    );

    const newJob = await query('SELECT * FROM jobs WHERE id = ? LIMIT 1;', [result.insertId]);
    return res.status(201).json({
      success: true,
      message: 'Job vacancy created successfully',
      data: { ...newJob[0], deadline: newJob[0].application_deadline }
    });
  } catch (err) {
    console.error('[Admin Create Job Error]:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to create job' });
  }
});

router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      country,
      location,
      category,
      salary,
      vacancies,
      experience,
      qualification,
      description,
      responsibilities,
      benefits,
      deadline,
      status,
    } = req.body;

    const cleanDeadline = deadline && deadline.trim() ? deadline.trim() : null;

    await query(
      `UPDATE jobs SET 
         title = ?, country = ?, location = ?, category = ?, salary = ?, vacancies = ?, 
         experience = ?, qualification = ?, description = ?, responsibilities = ?, benefits = ?, 
         application_deadline = ?, status = ?, updated_at = NOW() 
       WHERE id = ?;`,
      [
        title.trim(),
        country,
        location.trim(),
        category.trim(),
        salary.trim(),
        Number(vacancies || 1),
        experience?.trim() || 'Not specified',
        qualification?.trim() || 'Not specified',
        description?.trim() || '',
        responsibilities?.trim() || '',
        benefits?.trim() || '',
        cleanDeadline,
        status || 'published',
        id,
      ]
    );

    const updated = await query('SELECT * FROM jobs WHERE id = ? LIMIT 1;', [id]);
    return res.json({
      success: true,
      message: 'Job vacancy updated successfully',
      data: { ...updated[0], deadline: updated[0].application_deadline }
    });
  } catch (err) {
    console.error('[Admin Update Job Error]:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update job' });
  }
});

router.patch('/jobs/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['published', 'draft', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid job status' });
    }

    await query('UPDATE jobs SET status = ?, updated_at = NOW() WHERE id = ?;', [status, id]);
    return res.json({ success: true, message: `Job status updated to ${status}` });
  } catch (err) {
    console.error('[Admin Patch Job Status Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM jobs WHERE id = ?;', [id]);
    return res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('[Admin Delete Job Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete job' });
  }
});

// =========================================================================
// 4. HOMEPAGE BANNER MANAGEMENT
// =========================================================================
router.get('/banners', async (_req, res) => {
  try {
    const banners = await query('SELECT * FROM homepage_banner ORDER BY updated_at DESC;');
    const normalized = banners.map((b) => ({
      id: b.id,
      image_url: b.image_url,
      mobile_image_url: b.mobile_image_url,
      heading: b.heading,
      sub_heading: b.heading,
      description: b.description,
      benefit1: b.benefit_1,
      benefit2: b.benefit_2,
      benefit3: b.benefit_3,
      button_text: b.button_text,
      button_link: b.button_link,
      is_active: Boolean(b.is_active),
      updated_at: b.updated_at,
    }));
    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[Admin Banners Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load banners' });
  }
});

router.post('/banners', async (req, res) => {
  try {
    const {
      image_url,
      mobile_image_url,
      heading,
      description,
      benefit1,
      benefit2,
      benefit3,
      button_text,
      button_link,
      is_active,
    } = req.body;

    if (!image_url) {
      return res.status(400).json({ success: false, error: 'Banner image URL is required' });
    }

    // If activating, deactivate others
    if (is_active) {
      await query('UPDATE homepage_banner SET is_active = 0;');
    }

    const [maxRow] = await query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM homepage_banner;');
    const nextId = Number(maxRow.nextId);

    await query(
      `INSERT INTO homepage_banner 
       (id, image_url, mobile_image_url, heading, description, benefit_1, benefit_2, benefit_3, button_text, button_link, is_active, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());`,
      [
        nextId,
        image_url,
        mobile_image_url || null,
        heading?.trim() || 'Overseas Careers',
        description?.trim() || '',
        benefit1?.trim() || '',
        benefit2?.trim() || '',
        benefit3?.trim() || '',
        button_text?.trim() || 'Apply Now',
        button_link?.trim() || '/jobs',
        is_active ? 1 : 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: { id: nextId }
    });
  } catch (err) {
    console.error('[Admin Create Banner Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to create banner' });
  }
});

router.put('/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image_url,
      mobile_image_url,
      heading,
      description,
      benefit1,
      benefit2,
      benefit3,
      button_text,
      button_link,
      is_active,
    } = req.body;

    // Check old image for B2 cleanup if replaced
    const old = await query('SELECT image_url, mobile_image_url FROM homepage_banner WHERE id = ?;', [id]);
    if (old.length > 0 && old[0].image_url && image_url && old[0].image_url !== image_url) {
      await deleteFromB2(old[0].image_url);
    }

    const numericId = Number(id);

    if (is_active && !isNaN(numericId)) {
      await query('UPDATE homepage_banner SET is_active = 0 WHERE id != ?;', [numericId]);
    }

    await query(
      `UPDATE homepage_banner SET 
         image_url = ?, mobile_image_url = ?, heading = ?, description = ?, 
         benefit_1 = ?, benefit_2 = ?, benefit_3 = ?, button_text = ?, button_link = ?, 
         is_active = ?, updated_at = NOW() 
       WHERE id = ?;`,
      [
        image_url,
        mobile_image_url || null,
        heading?.trim() || 'Overseas Careers',
        description?.trim() || '',
        benefit1?.trim() || '',
        benefit2?.trim() || '',
        benefit3?.trim() || '',
        button_text?.trim() || 'Apply Now',
        button_link?.trim() || '/jobs',
        is_active ? 1 : 0,
        numericId,
      ]
    );

    return res.json({ success: true, message: 'Banner updated successfully' });
  } catch (err) {
    console.error('[Admin Update Banner Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update banner' });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT image_url, mobile_image_url FROM homepage_banner WHERE id = ?;', [id]);
    if (rows.length > 0) {
      if (rows[0].image_url) await deleteFromB2(rows[0].image_url);
      if (rows[0].mobile_image_url) await deleteFromB2(rows[0].mobile_image_url);
    }
    await query('DELETE FROM homepage_banner WHERE id = ?;', [id]);
    return res.json({ success: true, message: 'Banner removed successfully' });
  } catch (err) {
    console.error('[Admin Delete Banner Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete banner' });
  }
});

// =========================================================================
// 5. VIDEO REVIEWS / SHORTS MANAGEMENT
// =========================================================================
router.get('/reviews', async (_req, res) => {
  try {
    const reviews = await query('SELECT * FROM reviews ORDER BY created_at DESC;');
    return res.json({ success: true, data: reviews });
  } catch (err) {
    console.error('[Admin Reviews Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load reviews' });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const {
      candidate_name,
      country,
      job_category,
      testimonial_title,
      video_url,
      thumbnail_url,
      status,
    } = req.body;

    if (!video_url) {
      return res.status(400).json({ success: false, error: 'Video file URL is required' });
    }

    const result = await query(
      `INSERT INTO reviews 
       (candidate_name, country, job_category, testimonial_title, video_url, thumbnail_url, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());`,
      [
        candidate_name?.trim() || 'Anonymous Candidate',
        country || 'UAE',
        job_category?.trim() || 'General',
        testimonial_title?.trim() || 'Overseas Success Story',
        video_url,
        thumbnail_url || null,
        status || 'published',
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    console.error('[Admin Create Review Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      candidate_name,
      country,
      job_category,
      testimonial_title,
      video_url,
      thumbnail_url,
      status,
    } = req.body;

    await query(
      `UPDATE reviews SET 
         candidate_name = ?, country = ?, job_category = ?, testimonial_title = ?, 
         video_url = ?, thumbnail_url = ?, status = ?, updated_at = NOW() 
       WHERE id = ?;`,
      [
        candidate_name?.trim() || 'Anonymous Candidate',
        country || 'UAE',
        job_category?.trim() || 'General',
        testimonial_title?.trim() || 'Overseas Success Story',
        video_url,
        thumbnail_url || null,
        status || 'published',
        id,
      ]
    );

    return res.json({ success: true, message: 'Review updated successfully' });
  } catch (err) {
    console.error('[Admin Update Review Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT video_url, thumbnail_url FROM reviews WHERE id = ?;', [id]);
    if (rows.length > 0) {
      if (rows[0].video_url) await deleteFromB2(rows[0].video_url);
      if (rows[0].thumbnail_url) await deleteFromB2(rows[0].thumbnail_url);
    }
    await query('DELETE FROM reviews WHERE id = ?;', [id]);
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('[Admin Delete Review Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

// =========================================================================
// 6. GALLERY MANAGEMENT
// =========================================================================
router.get('/gallery', async (_req, res) => {
  try {
    const items = await query('SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC;');
    const normalized = items.map((g) => ({ ...g, caption: g.description }));
    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[Admin Gallery Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load gallery' });
  }
});

router.post('/gallery', async (req, res) => {
  try {
    const { title, image_url, description, caption, status, display_order } = req.body;
    if (!title || !image_url) {
      return res.status(400).json({ success: false, error: 'Title and image are required' });
    }

    const desc = (description || caption || '').trim();
    const order = Number(display_order) || 0;

    const result = await query(
      `INSERT INTO gallery (title, image_url, description, status, display_order, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW());`,
      [title.trim(), image_url, desc, status || 'published', order]
    );

    return res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    console.error('[Admin Create Gallery Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to add gallery item' });
  }
});

router.put('/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, description, caption, status, display_order } = req.body;

    const desc = (description || caption || '').trim();
    const order = Number(display_order) || 0;

    // Check if image changed, delete old B2 object
    const old = await query('SELECT image_url FROM gallery WHERE id = ?;', [id]);
    if (old.length > 0 && old[0].image_url && image_url && old[0].image_url !== image_url) {
      await deleteFromB2(old[0].image_url);
    }

    await query(
      `UPDATE gallery SET title = ?, image_url = ?, description = ?, status = ?, display_order = ? 
       WHERE id = ?;`,
      [title.trim(), image_url, desc, status || 'published', order, id]
    );

    return res.json({ success: true, message: 'Gallery item updated successfully' });
  } catch (err) {
    console.error('[Admin Update Gallery Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update gallery item' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT image_url FROM gallery WHERE id = ?;', [id]);
    if (rows.length > 0 && rows[0].image_url) {
      await deleteFromB2(rows[0].image_url);
    }
    await query('DELETE FROM gallery WHERE id = ?;', [id]);
    return res.json({ success: true, message: 'Gallery item removed successfully' });
  } catch (err) {
    console.error('[Admin Delete Gallery Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
});

// =========================================================================
// 7. CANDIDATE APPLICATIONS & SECURE RESUME DOWNLOAD
// =========================================================================
router.get('/applications', async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (search && search.trim()) {
      sql += ' AND (LOWER(candidate_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(mobile) LIKE ? OR LOWER(job_title_snapshot) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC;';
    const apps = await query(sql, params);
    return res.json({ success: true, data: apps });
  } catch (err) {
    console.error('[Admin Applications Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load applications' });
  }
});

router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'shortlisted', 'rejected', 'selected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid application status' });
    }

    await query('UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?;', [status, id]);
    return res.json({ success: true, message: `Application status updated to ${status}` });
  } catch (err) {
    console.error('[Admin Patch Application Status Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update application status' });
  }
});

/**
 * SECURE RESUME DOWNLOAD FOR AUTHENTICATED ADMINS
 * Streams the resume directly with proper attachment filename or generates signed URL
 */
router.get('/applications/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT id, candidate_name, resume_path FROM applications WHERE id = ? LIMIT 1;', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application record not found' });
    }

    const { candidate_name, resume_path } = rows[0];
    if (!resume_path) {
      return res.status(404).json({ success: false, error: 'No resume file attached to this application' });
    }

    const key = extractKeyFromUrl(resume_path) || resume_path;
    const validatedKey = validateKey(key);

    const s3Response = await getObjectFromB2(validatedKey);
    const cleanCandidate = (candidate_name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = key.includes('.') ? key.slice(key.lastIndexOf('.')) : '.pdf';
    const filename = `Resume_${cleanCandidate}_${id}${ext}`;

    res.set({
      'Content-Type': s3Response.ContentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    });

    if (s3Response.ContentLength) {
      res.set('Content-Length', s3Response.ContentLength);
    }

    if (s3Response.Body && typeof s3Response.Body.pipe === 'function') {
      s3Response.Body.pipe(res);
    } else if (s3Response.Body && typeof s3Response.Body.transformToByteArray === 'function') {
      const bytes = await s3Response.Body.transformToByteArray();
      res.send(Buffer.from(bytes));
    } else {
      res.end();
    }
  } catch (err) {
    console.error('[Admin Resume Download Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to download candidate resume' });
  }
});

router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT resume_path FROM applications WHERE id = ?;', [id]);
    if (rows.length > 0 && rows[0].resume_path) {
      await deleteFromB2(rows[0].resume_path);
    }
    await query('DELETE FROM applications WHERE id = ?;', [id]);
    return res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    console.error('[Admin Delete Application Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete application' });
  }
});

// =========================================================================
// 8. COMPANY SETTINGS MANAGEMENT
// =========================================================================
router.get('/settings', async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM company_settings LIMIT 1;');
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    const s = rows[0];
    return res.json({
      success: true,
      data: {
        id: s.id,
        company_name: s.company_name,
        tagline: s.tagline,
        logo_url: s.logo_url,
        phone: s.phone,
        whatsapp: s.whatsapp_number,
        whatsapp_number: s.whatsapp_number,
        email: s.email,
        address: s.address,
        facebook_url: s.facebook_url,
        instagram_url: s.instagram_url,
        youtube_url: s.youtube_url,
        linkedin_url: s.linkedin_url,
        website_description: s.website_description,
        updated_at: s.updated_at,
      }
    });
  } catch (err) {
    console.error('[Admin Settings Get Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const {
      company_name,
      tagline,
      logo_url,
      phone,
      whatsapp,
      whatsapp_number,
      email,
      address,
      facebook_url,
      instagram_url,
      youtube_url,
      linkedin_url,
      website_description,
    } = req.body;

    const wa = (whatsapp_number || whatsapp || '').trim();

    // Check if existing
    const existing = await query('SELECT id, logo_url FROM company_settings LIMIT 1;');

    if (existing.length > 0) {
      const id = existing[0].id;
      if (existing[0].logo_url && logo_url && existing[0].logo_url !== logo_url) {
        await deleteFromB2(existing[0].logo_url);
      }

      await query(
        `UPDATE company_settings SET 
           company_name = ?, tagline = ?, logo_url = ?, phone = ?, whatsapp_number = ?, 
           email = ?, address = ?, facebook_url = ?, instagram_url = ?, youtube_url = ?, 
           linkedin_url = ?, website_description = ?, updated_at = NOW() 
         WHERE id = ?;`,
        [
          company_name?.trim() || 'Joy Manpower Solution',
          tagline?.trim() || '',
          logo_url || null,
          phone?.trim() || '',
          wa,
          email?.trim() || '',
          address?.trim() || '',
          facebook_url?.trim() || null,
          instagram_url?.trim() || null,
          youtube_url?.trim() || null,
          linkedin_url?.trim() || null,
          website_description?.trim() || '',
          id,
        ]
      );
    } else {
      await query(
        `INSERT INTO company_settings 
         (company_name, tagline, logo_url, phone, whatsapp_number, email, address, facebook_url, instagram_url, youtube_url, linkedin_url, website_description, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());`,
        [
          company_name?.trim() || 'Joy Manpower Solution',
          tagline?.trim() || '',
          logo_url || null,
          phone?.trim() || '',
          wa,
          email?.trim() || '',
          address?.trim() || '',
          facebook_url?.trim() || null,
          instagram_url?.trim() || null,
          youtube_url?.trim() || null,
          linkedin_url?.trim() || null,
          website_description?.trim() || '',
        ]
      );
    }

    return res.json({ success: true, message: 'Company settings updated successfully' });
  } catch (err) {
    console.error('[Admin Settings Update Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update company settings' });
  }
});

export default router;
