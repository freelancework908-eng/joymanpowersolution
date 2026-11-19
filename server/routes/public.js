import express from 'express';
import multer from 'multer';
import { query } from '../db.js';
import { uploadToB2, deleteFromB2 } from '../b2.js';

const router = express.Router();

// Multer memory storage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for resumes
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
    ];
    const isAllowedExt = /\.(pdf|doc|docx)$/i.test(file.originalname);
    if (allowedMime.includes(file.mimetype) || isAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX resume documents are allowed.'));
    }
  }
});

/**
 * 1. GET /api/public/jobs
 * Active published jobs only
 */
router.get('/jobs', async (req, res) => {
  try {
    const { country, category, experience, search, limit } = req.query;

    let sql = 'SELECT * FROM jobs WHERE status = "published"';
    const params = [];

    if (country && country !== 'All') {
      sql += ' AND country = ?';
      params.push(country);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (experience && experience !== 'All') {
      sql += ' AND experience LIKE ?';
      params.push(`%${experience}%`);
    }

    if (search && search.trim()) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    if (limit && Number(limit) > 0) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    const jobs = await query(sql, params);

    // Normalize field names (e.g. application_deadline -> deadline for frontend components)
    const normalized = jobs.map((j) => ({
      ...j,
      deadline: j.application_deadline,
    }));

    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[Public Jobs Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve vacancies' });
  }
});

/**
 * 2. GET /api/public/jobs/:id
 */
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await query('SELECT * FROM jobs WHERE id = ? LIMIT 1;', [id]);
    if (jobs.length === 0) {
      return res.status(404).json({ success: false, error: 'Job vacancy not found' });
    }

    const job = jobs[0];
    return res.json({
      success: true,
      data: {
        ...job,
        deadline: job.application_deadline,
      }
    });
  } catch (err) {
    console.error('[Public Job Details Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to load job details' });
  }
});

/**
 * 3. POST /api/public/apply
 * Submit Candidate Application + Resume uploaded to Backblaze B2
 */
router.post('/apply', upload.single('resume'), async (req, res) => {
  let uploadedB2Key = null;
  try {
    const {
      job_id,
      candidate_name,
      mobile,
      email,
      experience,
      current_location,
    } = req.body;

    if (!candidate_name || !candidate_name.trim()) {
      return res.status(400).json({ success: false, error: 'Candidate name is required' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, error: 'Mobile phone number is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Resume file (PDF, DOC, or DOCX) is required' });
    }

    // Lookup job title snapshot
    let jobTitleSnapshot = 'General Overseas Application';
    let cleanJobId = null;
    if (job_id && String(job_id) !== 'general') {
      const jobRows = await query('SELECT id, title FROM jobs WHERE id = ? LIMIT 1;', [job_id]);
      if (jobRows.length > 0) {
        cleanJobId = jobRows[0].id;
        jobTitleSnapshot = jobRows[0].title;
      }
    }

    // Upload Resume to Backblaze B2 under joyman/resumes/
    const uploadResult = await uploadToB2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'resumes'
    );
    uploadedB2Key = uploadResult.key;

    // Save Application record to TiDB
    await query(
      `INSERT INTO applications 
       (job_id, job_title_snapshot, candidate_name, mobile, email, experience, current_location, resume_path, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW());`,
      [
        cleanJobId,
        jobTitleSnapshot,
        candidate_name.trim(),
        mobile.trim(),
        email.trim(),
        experience?.trim() || 'Not specified',
        current_location?.trim() || 'Not specified',
        uploadedB2Key,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Your application and resume have been successfully submitted.',
    });
  } catch (err) {
    console.error('[Application Submission Error]:', err);

    // Clean up uploaded resume in B2 if database save failed
    if (uploadedB2Key) {
      await deleteFromB2(uploadedB2Key);
    }

    return res.status(500).json({
      success: false,
      error: err.message || 'An error occurred while submitting your application.'
    });
  }
});

/**
 * 4. GET /api/public/banner
 * Active homepage banner
 */
router.get('/banner', async (req, res) => {
  try {
    const banners = await query('SELECT * FROM homepage_banner ORDER BY is_active DESC, updated_at DESC LIMIT 1;');
    if (banners.length === 0) {
      return res.json({ success: true, data: null });
    }

    const b = banners[0];
    return res.json({
      success: true,
      data: {
        id: b.id,
        image_url: b.image_url,
        mobile_image_url: b.mobile_image_url,
        heading: b.heading,
        sub_heading: b.heading, // Support sub_heading compatibility
        description: b.description,
        benefit1: b.benefit_1,
        benefit2: b.benefit_2,
        benefit3: b.benefit_3,
        button_text: b.button_text,
        button_link: b.button_link || '/jobs',
        is_active: Boolean(b.is_active),
        updated_at: b.updated_at,
      }
    });
  } catch (err) {
    console.error('[Public Banner Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve active banner' });
  }
});

/**
 * 5. GET /api/public/reviews
 * Published video reviews only
 */
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await query('SELECT * FROM reviews WHERE status = "published" ORDER BY created_at DESC;');
    return res.json({ success: true, data: reviews });
  } catch (err) {
    console.error('[Public Reviews Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve video reviews' });
  }
});

/**
 * 6. GET /api/public/gallery
 * Published gallery images
 */
router.get('/gallery', async (req, res) => {
  try {
    const items = await query(
      'SELECT * FROM gallery WHERE status = "published" OR status IS NULL ORDER BY display_order ASC, created_at DESC;'
    );
    const normalized = items.map((g) => ({
      ...g,
      caption: g.description, // Compatibility
    }));
    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[Public Gallery Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve gallery' });
  }
});

/**
 * 7. GET /api/public/settings
 * Company information & social links
 */
router.get('/settings', async (req, res) => {
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
    console.error('[Public Settings Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve company settings' });
  }
});

export default router;
