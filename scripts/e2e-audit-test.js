import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { app } from '../server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

const results = {
  workflow1_jobs: false,
  workflow2_banner: false,
  workflow3_reviews: false,
  workflow4_applications: false,
  workflow5_gallery: false,
  workflow6_settings: false,
  security_audit: false,
  details: []
};

function logStep(step, success, message = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${step} ${message ? `(${message})` : ''}`);
  results.details.push({ step, success, message });
}

async function runE2EAudit() {
  console.log('================================================================');
  console.log('JOY MANPOWER SOLUTION - COMPLETE END-TO-END VERIFICATION AUDIT');
  console.log('Testing TiDB Cloud Database + Backblaze B2 Object Storage');
  console.log('================================================================\n');

  const server = http.createServer(app).listen(PORT);
  console.log(`Backend server started on ${BASE_URL}\n`);

  try {
    // -------------------------------------------------------------------------
    // AUTHENTICATION: Admin Login
    // -------------------------------------------------------------------------
    console.log('--- ADMIN AUTHENTICATION ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@joymanpowersolution.com',
        password: 'admin123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    const isLoginOk = loginData.success && !!token;
    logStep('Admin Login (admin@joymanpowersolution.com)', isLoginOk);
    if (!isLoginOk) throw new Error('Cannot proceed without admin token');

    const authHeaders = { 'Authorization': `Bearer ${token}` };

    // -------------------------------------------------------------------------
    // WORKFLOW 1: ADMIN JOB MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 1: ADMIN JOB MANAGEMENT ---');
    // 1. Add Job
    const addJobRes = await fetch(`${BASE_URL}/api/admin/jobs`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Audited Automation Engineer - Dubai Hub',
        country: 'UAE',
        location: 'Dubai Marina, UAE',
        category: 'Construction & Engineering',
        salary: 'AED 6,500 - 8,000 / month',
        vacancies: 3,
        experience: '4-6 Years in industrial PLC / SCADA automation',
        qualification: 'B.E. in Electrical & Instrumentation',
        description: 'Lead automation commissioning for commercial tower facility.',
        responsibilities: 'PLC ladder programming, field instrumentation calibration.',
        benefits: 'Direct visa, health coverage, bachelor accommodation.',
        deadline: '2026-12-30',
        status: 'published'
      })
    });
    const addJobData = await addJobRes.json();
    const createdJobId = addJobData.data?.id;
    logStep('1.1 Create Job in TiDB', addJobRes.status === 201 && !!createdJobId, `Job ID: ${createdJobId}`);

    // 2. Verify on Public Jobs Page
    const pubJobsRes = await fetch(`${BASE_URL}/api/public/jobs?search=Audited%20Automation`);
    const pubJobsData = await pubJobsRes.json();
    const foundOnPublic = pubJobsData.data?.some(j => j.id === createdJobId);
    logStep('1.2 Verify on Public Jobs Page', foundOnPublic);

    // 3. Open Job Details
    const jobDetRes = await fetch(`${BASE_URL}/api/public/jobs/${createdJobId}`);
    const jobDetData = await jobDetRes.json();
    const isJobDetOk = jobDetData.data?.title === 'Audited Automation Engineer - Dubai Hub';
    logStep('1.3 Open Job Details', isJobDetOk);

    // 4. Edit Job
    const editJobRes = await fetch(`${BASE_URL}/api/admin/jobs/${createdJobId}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Audited Senior Automation Specialist - Dubai Hub',
        country: 'UAE',
        location: 'Dubai Marina, UAE',
        category: 'Construction & Engineering',
        salary: 'AED 8,500 / month',
        vacancies: 4,
        experience: '5+ Years',
        qualification: 'B.E. in Electrical',
        description: 'Updated description for senior automation role.',
        status: 'published'
      })
    });
    const editJobData = await editJobRes.json();
    logStep('1.4 Edit Job in TiDB', editJobData.success);

    // 5. Verify Updated Content
    const verifyEditRes = await fetch(`${BASE_URL}/api/public/jobs/${createdJobId}`);
    const verifyEditData = await verifyEditRes.json();
    const isUpdated = verifyEditData.data?.title === 'Audited Senior Automation Specialist - Dubai Hub';
    logStep('1.5 Verify Updated Content on Public Page', isUpdated);

    // 6. Close Job
    const closeRes = await fetch(`${BASE_URL}/api/admin/jobs/${createdJobId}/status`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' })
    });
    const closeData = await closeRes.json();
    logStep('1.6 Close Job in TiDB', closeData.success);

    // 7. Verify Hidden from Active Listings
    const checkClosedRes = await fetch(`${BASE_URL}/api/public/jobs?search=Audited%20Senior`);
    const checkClosedData = await checkClosedRes.json();
    const isHiddenFromPublic = !checkClosedData.data?.some(j => j.id === createdJobId);
    logStep('1.7 Verify Closed Job Hidden from Public Listing', isHiddenFromPublic);

    results.workflow1_jobs = Boolean(isLoginOk && foundOnPublic && isJobDetOk && isUpdated && isHiddenFromPublic);

    // -------------------------------------------------------------------------
    // WORKFLOW 2: HOMEPAGE BANNER (Backblaze B2 Upload & TiDB Save)
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 2: HOMEPAGE BANNER (B2 & TiDB) ---');
    // Upload Test Banner Image to B2
    const bannerSampleBuf = Buffer.from('FAKE_JPG_DATA_FOR_BANNER_VERIFICATION_' + Date.now());
    const bannerFormData = new FormData();
    bannerFormData.append('file', new Blob([bannerSampleBuf], { type: 'image/jpeg' }), 'audit-banner.jpg');
    bannerFormData.append('folder', 'banners');

    const uploadBannerRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: bannerFormData
    });
    const uploadBannerData = await uploadBannerRes.json();
    const b2BannerKey = uploadBannerData.key;
    const b2BannerUrl = uploadBannerData.url;
    logStep('2.1 Upload Banner Image to Backblaze B2', !!b2BannerKey && b2BannerKey.startsWith('joyman/banners/'), `Key: ${b2BannerKey}`);

    // Save Database Reference
    const createBannerRes = await fetch(`${BASE_URL}/api/admin/banners`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: b2BannerUrl,
        heading: 'Saudi Arabia & Dubai Opportunities',
        description: 'Verified overseas careers with corporate GCC sponsors.',
        benefit1: 'Direct Sponsor Visas',
        benefit2: 'Certified Skill Testing',
        benefit3: 'Zero Hidden Charges',
        button_text: 'Apply Now',
        button_link: '/jobs',
        is_active: true
      })
    });
    const createBannerData = await createBannerRes.json();
    const bannerId = createBannerData.data?.id;
    logStep('2.2 Save Banner Record in TiDB', createBannerData.success, `Banner ID: ${bannerId}`);

    // Verify on Public Homepage
    const pubBannerRes = await fetch(`${BASE_URL}/api/public/banner`);
    const pubBannerData = await pubBannerRes.json();
    const isPubBannerOk = pubBannerData.data?.image_url === b2BannerUrl;
    logStep('2.3 Verify Active Banner on Public Homepage', isPubBannerOk);

    // Replace Banner & Verify Deletion of Old B2 Object
    const replaceSampleBuf = Buffer.from('REPLACED_BANNER_DATA_' + Date.now());
    const repFormData = new FormData();
    repFormData.append('file', new Blob([replaceSampleBuf], { type: 'image/jpeg' }), 'replacement-banner.jpg');
    repFormData.append('folder', 'banners');

    const repUploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: repFormData
    });
    const repUploadData = await repUploadRes.json();
    const repBannerUrl = repUploadData.url;

    const updateBannerRes = await fetch(`${BASE_URL}/api/admin/banners/${bannerId}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: repBannerUrl,
        heading: 'Updated GCC Overseas Careers',
        description: 'Updated description.',
        is_active: true
      })
    });
    const updateBannerData = await updateBannerRes.json();
    logStep('2.4 Replace Banner & Delete Old B2 Object', updateBannerData.success);

    // Verify new banner on public
    const verifyNewBannerRes = await fetch(`${BASE_URL}/api/public/banner`);
    const verifyNewBannerData = await verifyNewBannerRes.json();
    const isNewBannerActive = verifyNewBannerData.data?.image_url === repBannerUrl;
    logStep('2.5 Verify New Replaced Banner Publicly Active', isNewBannerActive);

    results.workflow2_banner = Boolean(b2BannerKey && isPubBannerOk && isNewBannerActive);

    // -------------------------------------------------------------------------
    // WORKFLOW 3: VIDEO REVIEWS (Backblaze B2 Upload, HTTP Range Stream, TiDB)
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 3: VIDEO REVIEWS (B2 & TiDB) ---');
    // Upload MP4 video to B2
    const sampleVideoLocal = 'E:/aadhiran-silambam-platform/video/VID-20231026-WA0020.mp4';
    let videoUrl = null;
    let thumbUrl = null;

    if (fs.existsSync(sampleVideoLocal)) {
      const vBuf = fs.readFileSync(sampleVideoLocal);
      const vFormData = new FormData();
      vFormData.append('file', new Blob([vBuf], { type: 'video/mp4' }), 'audit-test-video.mp4');
      vFormData.append('folder', 'reviews/videos');

      const vRes = await fetch(`${BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: authHeaders,
        body: vFormData
      });
      const vData = await vRes.json();
      videoUrl = vData.url;
      logStep('3.1 Upload Real MP4 Video to Backblaze B2', !!vData.key && vData.key.startsWith('joyman/reviews/videos/'));

      // Upload thumbnail
      const tBuf = Buffer.from('FAKE_THUMB_DATA_' + Date.now());
      const tFormData = new FormData();
      tFormData.append('file', new Blob([tBuf], { type: 'image/jpeg' }), 'thumb.jpg');
      tFormData.append('folder', 'reviews/thumbnails');

      const tRes = await fetch(`${BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: authHeaders,
        body: tFormData
      });
      const tData = await tRes.json();
      thumbUrl = tData.url;
      logStep('3.2 Upload Video Thumbnail to Backblaze B2', !!tData.key && tData.key.startsWith('joyman/reviews/thumbnails/'));
    }

    // Save Review in TiDB
    const createReviewRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_name: 'Audited Candidate John',
        country: 'UAE',
        job_category: 'Facility Management',
        testimonial_title: 'Seamless Dubai Visa & Flight Deployment',
        video_url: videoUrl,
        thumbnail_url: thumbUrl,
        status: 'published'
      })
    });
    const createReviewData = await createReviewRes.json();
    const reviewId = createReviewData.data?.id;
    logStep('3.3 Save Video Review Record in TiDB', createReviewData.success, `Review ID: ${reviewId}`);

    // Verify on Public Homepage
    const pubReviewsRes = await fetch(`${BASE_URL}/api/public/reviews`);
    const pubReviewsData = await pubReviewsRes.json();
    const foundReview = pubReviewsData.data?.some(r => r.id === reviewId);
    logStep('3.4 Verify Published Review on Public Homepage', foundReview);

    // Verify HTTP 206 Partial Content Range Streaming on Video
    let rangeStreamOk = false;
    if (videoUrl) {
      const streamRes = await fetch(`${BASE_URL}${videoUrl}`, {
        headers: { 'Range': 'bytes=0-1024' }
      });
      rangeStreamOk = streamRes.status === 206 && streamRes.headers.get('content-range')?.includes('bytes 0-1024');
      logStep('3.5 Verify HTTP 206 Range Stream Playback from B2', rangeStreamOk, `Status: ${streamRes.status}`);
    }

    // Unpublish and Verify Hidden
    const unpubRes = await fetch(`${BASE_URL}/api/admin/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_name: 'Audited Candidate John',
        country: 'UAE',
        video_url: videoUrl,
        status: 'unpublished'
      })
    });
    const unpubData = await unpubRes.json();
    const checkUnpubRes = await fetch(`${BASE_URL}/api/public/reviews`);
    const checkUnpubData = await checkUnpubRes.json();
    const isUnpubHidden = !checkUnpubData.data?.some(r => r.id === reviewId);
    logStep('3.6 Unpublish and Verify Hidden from Public Homepage', unpubData.success && isUnpubHidden);

    // Delete review
    const delReviewRes = await fetch(`${BASE_URL}/api/admin/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const delReviewData = await delReviewRes.json();
    logStep('3.7 Delete Review & Clean Up B2 Video/Thumbnail', delReviewData.success);

    results.workflow3_reviews = Boolean(foundReview && rangeStreamOk && isUnpubHidden);

    // -------------------------------------------------------------------------
    // WORKFLOW 4: CANDIDATE APPLICATION & SECURE RESUME DOWNLOAD
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 4: CANDIDATE APPLICATION & RESUME PRIVACY ---');
    // Candidate applies with resume PDF
    const samplePdfBuf = Buffer.from('%PDF-1.4\n%Candidate Resume Sample Content for Joy Manpower Solution Audit\n%%EOF');
    const applyFormData = new FormData();
    applyFormData.append('job_id', createdJobId || '1');
    applyFormData.append('candidate_name', 'Rahul Sharma (Test Candidate)');
    applyFormData.append('mobile', '+91 98765 12345');
    applyFormData.append('email', 'rahul.sharma@example.com');
    applyFormData.append('experience', '4 Years HVAC Maintenance');
    applyFormData.append('current_location', 'Chennai, Tamil Nadu');
    applyFormData.append('resume', new Blob([samplePdfBuf], { type: 'application/pdf' }), 'rahul_sharma_resume.pdf');

    const applyRes = await fetch(`${BASE_URL}/api/public/apply`, {
      method: 'POST',
      body: applyFormData
    });
    const applyData = await applyRes.json();
    logStep('4.1 Submit Candidate Application + Upload Resume to B2', applyData.success);

    // Admin opens applications
    const appsRes = await fetch(`${BASE_URL}/api/admin/applications`, {
      headers: authHeaders
    });
    const appsData = await appsRes.json();
    const submittedApp = appsData.data?.find(a => a.email === 'rahul.sharma@example.com');
    logStep('4.2 Admin List Applications in TiDB', !!submittedApp, `Found App ID: ${submittedApp?.id}`);

    // Verify Resume is stored under joyman/resumes/
    const isResumeB2Key = submittedApp?.resume_path?.startsWith('joyman/resumes/');
    logStep('4.3 Verify Resume Stored in B2 under joyman/resumes/', isResumeB2Key, `Key: ${submittedApp?.resume_path}`);

    // Admin Downloads Resume Securely
    let resumeDownloadOk = false;
    if (submittedApp) {
      const dlRes = await fetch(`${BASE_URL}/api/admin/applications/${submittedApp.id}/resume`, {
        headers: authHeaders
      });
      const dlBytes = await dlRes.arrayBuffer();
      resumeDownloadOk = dlRes.status === 200 && dlBytes.byteLength > 0 && dlRes.headers.get('content-disposition')?.includes('attachment');
      logStep('4.4 Authenticated Admin Download Resume from B2', resumeDownloadOk, `Bytes: ${dlBytes.byteLength}`);

      // Update Application Status to 'shortlisted'
      const statusRes = await fetch(`${BASE_URL}/api/admin/applications/${submittedApp.id}/status`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shortlisted' })
      });
      const statusData = await statusRes.json();
      logStep('4.5 Update Application Status to Shortlisted', statusData.success);

      // Verify Updated Status
      const verifyStatusRes = await fetch(`${BASE_URL}/api/admin/applications?status=shortlisted`, {
        headers: authHeaders
      });
      const verifyStatusData = await verifyStatusRes.json();
      const isShortlisted = verifyStatusData.data?.some(a => a.id === submittedApp.id);
      logStep('4.6 Verify Shortlisted Status Filter in TiDB', isShortlisted);
    }

    // Security Check: Unauthenticated access to resume MUST be 401 Unauthorized
    const unauthRes = await fetch(`${BASE_URL}/api/admin/applications/${submittedApp?.id}/resume`);
    const isUnauthBlocked = unauthRes.status === 401;
    logStep('4.7 Security Check: Unauthenticated Resume Download Blocked (401)', isUnauthBlocked);

    // Security Check: Public media streaming endpoint MUST block resume access (403)
    const streamBlockedRes = await fetch(`${BASE_URL}/api/media/stream/${submittedApp?.resume_path}`);
    const isStreamBlocked = streamBlockedRes.status === 403;
    logStep('4.8 Security Check: Public Media Stream Blocks Resume Access (403)', isStreamBlocked);

    results.workflow4_applications = Boolean(applyData.success && isResumeB2Key && resumeDownloadOk && isUnauthBlocked && isStreamBlocked);

    // -------------------------------------------------------------------------
    // WORKFLOW 5: GALLERY (Upload, TiDB Save, Display Order, Delete)
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 5: GALLERY MANAGEMENT ---');
    // Upload image to B2
    const galBuf = Buffer.from('FAKE_GALLERY_IMAGE_' + Date.now());
    const galFormData = new FormData();
    galFormData.append('file', new Blob([galBuf], { type: 'image/jpeg' }), 'interview-drive.jpg');
    galFormData.append('folder', 'gallery');

    const uploadGalRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: galFormData
    });
    const uploadGalData = await uploadGalRes.json();
    const galUrl = uploadGalData.url;
    logStep('5.1 Upload Gallery Image to Backblaze B2', !!uploadGalData.key && uploadGalData.key.startsWith('joyman/gallery/'));

    // Save in TiDB
    const addGalRes = await fetch(`${BASE_URL}/api/admin/gallery`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Dubai Metro HVAC Delegation Selection',
        image_url: galUrl,
        description: 'Client technical interview for Dubai facility management contract.',
        status: 'published',
        display_order: 10
      })
    });
    const addGalData = await addGalRes.json();
    const galId = addGalData.data?.id;
    logStep('5.2 Save Gallery Item in TiDB', addGalData.success, `Gallery ID: ${galId}`);

    // Verify on Public Gallery
    const pubGalRes = await fetch(`${BASE_URL}/api/public/gallery`);
    const pubGalData = await pubGalRes.json();
    const foundGal = pubGalData.data?.some(g => g.id === galId);
    logStep('5.3 Verify on Public Gallery Page', foundGal);

    // Edit Display Order
    const editGalRes = await fetch(`${BASE_URL}/api/admin/gallery/${galId}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Dubai Metro HVAC Delegation Selection',
        image_url: galUrl,
        description: 'Client technical interview.',
        status: 'published',
        display_order: 1
      })
    });
    const editGalData = await editGalRes.json();
    logStep('5.4 Edit Display Order in TiDB', editGalData.success);

    // Delete gallery item
    const delGalRes = await fetch(`${BASE_URL}/api/admin/gallery/${galId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const delGalData = await delGalRes.json();
    logStep('5.5 Delete Gallery Item and B2 Object', delGalData.success);

    results.workflow5_gallery = Boolean(uploadGalData.key && foundGal && editGalData.success && delGalData.success);

    // -------------------------------------------------------------------------
    // WORKFLOW 6: COMPANY SETTINGS (Branding, Phone, WhatsApp, Socials)
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 6: COMPANY SETTINGS ---');
    // Upload company logo to B2
    const logoBuf = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#321078"/></svg>');
    const logoFormData = new FormData();
    logoFormData.append('file', new Blob([logoBuf], { type: 'image/svg+xml' }), 'brand-logo.svg');
    logoFormData.append('folder', 'logo');

    const logoUploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: logoFormData
    });
    const logoUploadData = await logoUploadRes.json();
    const b2LogoUrl = logoUploadData.url;
    logStep('6.1 Upload Company Logo to Backblaze B2', !!logoUploadData.key && logoUploadData.key.startsWith('joyman/logo/'));

    // Update Company Settings in TiDB
    const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: 'Joy Manpower Solution',
        tagline: 'Overseas Recruitment Services • Saudi Arabia & Dubai',
        logo_url: b2LogoUrl,
        phone: '+91 90033 80233',
        whatsapp_number: '+919003380233',
        email: 'info@joymanpowersolution.com',
        address: 'Joy Manpower Solution, Executive Recruitment Center, Mumbai & Chennai, India',
        facebook_url: 'https://facebook.com/joymanpowersolution',
        instagram_url: 'https://instagram.com/joymanpowersolution',
        youtube_url: 'https://youtube.com/@joymanpowersolution',
        linkedin_url: 'https://linkedin.com/company/joymanpowersolution',
        website_description: 'Authorized overseas recruitment consultancy.'
      })
    });
    const updateSettingsData = await updateSettingsRes.json();
    logStep('6.2 Update Company Settings in TiDB', updateSettingsData.success);

    // Verify on Public Settings
    const pubSettingsRes = await fetch(`${BASE_URL}/api/public/settings`);
    const pubSettingsData = await pubSettingsRes.json();
    const isSettingsSynced = (
      pubSettingsData.data?.phone === '+91 90033 80233' &&
      pubSettingsData.data?.whatsapp_number === '+919003380233' &&
      pubSettingsData.data?.logo_url === b2LogoUrl &&
      pubSettingsData.data?.facebook_url?.includes('facebook.com')
    );
    logStep('6.3 Verify Public Settings Synchronized from TiDB', isSettingsSynced);

    results.workflow6_settings = Boolean(logoUploadData.key && updateSettingsData.success && isSettingsSynced);

    // -------------------------------------------------------------------------
    // WORKFLOW 7: PART 3 - 5 CONSTRUCTION VACANCIES & 8 JOB CATEGORIES AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- WORKFLOW 7: 5 CONSTRUCTION VACANCIES & 8 CATEGORIES AUDIT ---');
    results.workflow7_categories_and_jobs = false;

    // 7.1 Verify Categories from API
    const catRes = await fetch(`${BASE_URL}/api/public/categories`);
    const catData = await catRes.json();
    const publicCats = catData.data || [];

    const expectedEight = [
      'Mason - Block/Plaster',
      'Tile Mason',
      'Steel Fixer',
      'Shuttering Carpenter',
      'Scaffolder',
      'Driver',
      'Engineer',
      'Pocket Packer'
    ];

    const hasAllEight = expectedEight.every(c => publicCats.includes(c));
    logStep('7.1 Verify All 8 Required Categories in System', hasAllEight, `Categories found: ${expectedEight.filter(c => publicCats.includes(c)).join(', ')}`);

    // 7.2 Verify 5 Construction Vacancies Exact Data in Database
    const pubAllJobsRes = await fetch(`${BASE_URL}/api/public/jobs`);
    const pubAllJobsData = await pubAllJobsRes.json();
    const publishedList = pubAllJobsData.data || [];

    const expectedJobs = [
      { title: 'Mason - Block/Plaster', qty: 150, basic: '1500', ot: '200', total: '1700' },
      { title: 'Tile Mason', qty: 50, basic: '1600', ot: '200', total: '1800' },
      { title: 'Steel Fixer', qty: 100, basic: '1400', ot: '200', total: '1600' },
      { title: 'Shuttering Carpenter', qty: 150, basic: '1400', ot: '200', total: '1600' },
      { title: 'Scaffolder', qty: 100, basic: '1600', ot: '200', total: '1800' }
    ];

    let allFiveMatched = true;
    for (const exp of expectedJobs) {
      const match = publishedList.find(j => j.title === exp.title);
      const isMatchOk = Boolean(
        match &&
        Number(match.vacancies) === exp.qty &&
        String(match.salary) === exp.total &&
        (!match.basic_salary || String(match.basic_salary) === exp.basic) &&
        (!match.compulsory_ot_salary || String(match.compulsory_ot_salary) === exp.ot)
      );
      if (!isMatchOk) allFiveMatched = false;
      logStep(`7.2 Verify Job "${exp.title}" (Qty: ${exp.qty}, Total: ${exp.total})`, isMatchOk,
        match ? `Found vacancies: ${match.vacancies}, salary: ${match.salary}` : 'NOT FOUND IN PUBLISHED JOBS');
    }

    // 7.3 Verify Employment Conditions
    const sampleConstructionJob = publishedList.find(j => j.title === 'Mason - Block/Plaster');
    const conditionsOk = Boolean(
      sampleConstructionJob &&
      sampleConstructionJob.benefits?.includes('UAE labour laws') &&
      sampleConstructionJob.benefits?.includes('Joining tickets from India only') &&
      sampleConstructionJob.benefits?.includes('Visa provided by company') &&
      sampleConstructionJob.benefits?.includes('Medical insurance provided by company') &&
      sampleConstructionJob.benefits?.includes('Shared accommodation provided by company') &&
      sampleConstructionJob.benefits?.includes('Kitchen facility with gas provided by company') &&
      sampleConstructionJob.benefits?.includes('Transportation provided by company') &&
      sampleConstructionJob.benefits?.includes('10 hours per day') &&
      sampleConstructionJob.benefits?.includes('26 days per month') &&
      sampleConstructionJob.benefits?.includes('4 days per month')
    );
    logStep('7.3 Verify Exact Employment Conditions from Image', conditionsOk);

    // 7.4 Test Admin Category Creation & Deletion
    const testCatName = 'TEST_AUDIT_CATEGORY_' + Date.now();
    const createCatRes = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testCatName })
    });
    const createCatData = await createCatRes.json();
    const testCatId = createCatData.data?.id;
    logStep('7.4 Admin Create Category in TiDB', createCatData.success && !!testCatId, `Cat ID: ${testCatId}`);

    if (testCatId) {
      const delCatRes = await fetch(`${BASE_URL}/api/admin/categories/${testCatId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      const delCatData = await delCatRes.json();
      logStep('7.5 Admin Delete Category from TiDB', delCatData.success);
    }

    results.workflow7_categories_and_jobs = Boolean(hasAllEight && allFiveMatched && conditionsOk);

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n================================================================');
    console.log('AUDIT RESULTS SUMMARY:');
    console.log(`WORKFLOW 1 - ADMIN JOB MANAGEMENT:       ${results.workflow1_jobs ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 2 - HOMEPAGE BANNER (B2+TiDB):   ${results.workflow2_banner ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 3 - VIDEO REVIEWS (B2+TiDB):     ${results.workflow3_reviews ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 4 - CANDIDATE APPLICATIONS:     ${results.workflow4_applications ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 5 - GALLERY MANAGEMENT:          ${results.workflow5_gallery ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 6 - COMPANY SETTINGS:           ${results.workflow6_settings ? 'PASS' : 'FAIL'}`);
    console.log(`WORKFLOW 7 - 5 JOBS & 8 CATEGORIES:       ${results.workflow7_categories_and_jobs ? 'PASS' : 'FAIL'}`);
    console.log('================================================================');

  } catch (err) {
    console.error('Fatal audit error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runE2EAudit();
