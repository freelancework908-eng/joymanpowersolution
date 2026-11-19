import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { pool, query } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
  B2_PREFIX
} = process.env;

const bucket = B2_BUCKET_NAME || 'joymanpowersolution';
const basePrefix = (B2_PREFIX || 'joyman').replace(/^\/+|\/+$/g, '') + '/';

const s3 = new S3Client({
  endpoint: B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
  region: B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: B2_APPLICATION_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
  },
  forcePathStyle: true,
});

async function uploadBufferToB2(buffer, key, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  const publicUrl = `/api/media/stream/${key}`;
  console.log(`[B2 Uploaded] ${key} -> ${publicUrl}`);
  return { key, url: publicUrl };
}

function downloadToBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadToBuffer(res.headers.location));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function runSeed() {
  console.log('--- Starting Cloud Storage (B2) and TiDB Synchronization ---');

  // 1. Upload Company Logo
  let logoUrl = null;
  const logoLocal = path.resolve(__dirname, '../public/logo-icon.svg');
  if (fs.existsSync(logoLocal)) {
    const logoBuf = fs.readFileSync(logoLocal);
    const logoKey = `${basePrefix}logo/logo-icon.svg`;
    const res = await uploadBufferToB2(logoBuf, logoKey, 'image/svg+xml');
    logoUrl = res.url;
  }

  // 2. Upload Homepage Banner
  let bannerUrl = null;
  const bannerLocal = path.resolve(__dirname, '../public/gallery/jms-recruitment-reference.jpg');
  if (fs.existsSync(bannerLocal)) {
    const bannerBuf = fs.readFileSync(bannerLocal);
    const bannerKey = `${basePrefix}banners/hero-overseas-recruitment.jpg`;
    const res = await uploadBufferToB2(bannerBuf, bannerKey, 'image/jpeg');
    bannerUrl = res.url;
  }

  // 3. Upload Gallery Images
  const galleryAssets = [
    {
      file: 'jms-uae-hiring-drivers-welders.jpg',
      title: 'Dubai & Abu Dhabi Overseas Hiring: Welders, Drivers & Operators',
      description: 'Official recruitment drive for Dubai & Abu Dhabi: Welders, Heavy Bus Drivers (AED 3,080/mo), Lorry Drivers & Crane Operators. Coordinator: A. Sekar (9003380233).',
      order: 1
    },
    {
      file: 'jms-uae-construction-helpers-200.jpg',
      title: 'UAE Urgent Recruitment: 200 Construction General Helpers',
      description: 'Urgent manpower deployment announcement: 200 Construction General Helpers mobilized from India for premier UAE infrastructure developments.',
      order: 2
    },
    {
      file: 'jms-uae-planning-engineer.jpg',
      title: 'UAE Planning Engineer Recruitment (திட்டமிடல் பொறியாளர்)',
      description: 'Direct UAE corporate selection for experienced Planning Engineers with minimum 4 years construction project scheduling and coordination expertise.',
      order: 3
    },
    {
      file: 'jms-recruitment-reference.jpg',
      title: 'Foreign Job Consultancy Operations – Saudi Arabia & Dubai',
      description: 'Joy Manpower Solution documented overseas recruitment drives, corporate sponsor visa processing, and pre-departure briefings for GCC deployments.',
      order: 4
    }
  ];

  const galleryB2Urls = [];
  for (const item of galleryAssets) {
    const p = path.resolve(__dirname, `../public/gallery/${item.file}`);
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      const key = `${basePrefix}gallery/${item.file}`;
      const res = await uploadBufferToB2(buf, key, 'image/jpeg');
      galleryB2Urls.push({ ...item, b2Url: res.url });
    }
  }

  // 4. Upload Review MP4 Videos and Thumbnails
  const videoFiles = [
    {
      src: 'E:/aadhiran-silambam-platform/video/VID-20231026-WA0020.mp4',
      destName: 'candidate-review-imran-dubai.mp4',
      candidate: 'Mohammed Imran',
      country: 'UAE',
      category: 'Facility Management',
      title: 'Secured HVAC Technician Role in Dubai with Company Accommodation'
    },
    {
      src: 'E:/aadhiran-silambam-platform/video/VID-20231026-WA0019.mp4',
      destName: 'candidate-review-rajesh-riyadh.mp4',
      candidate: 'Rajesh Kumar',
      country: 'Saudi Arabia',
      category: 'Construction & Engineering',
      title: 'Crane Operator Deployment in Riyadh - Smooth GAMCA & Visa Stamping'
    },
    {
      src: 'E:/aadhiran-silambam-platform/video/athletica.mp4',
      destName: 'candidate-review-sunil-dubai.mp4',
      candidate: 'Sunil Sharma',
      country: 'UAE',
      category: 'Construction & Engineering',
      title: 'Civil Site Supervisor in Dubai Commercial Development'
    }
  ];

  const reviewB2Records = [];
  for (let i = 0; i < videoFiles.length; i++) {
    const v = videoFiles[i];
    if (fs.existsSync(v.src)) {
      const vBuf = fs.readFileSync(v.src);
      const vKey = `${basePrefix}reviews/videos/${v.destName}`;
      const vRes = await uploadBufferToB2(vBuf, vKey, 'video/mp4');

      // Use a gallery image as the thumbnail uploaded to B2
      const tKey = `${basePrefix}reviews/thumbnails/thumb-${i + 1}.jpg`;
      const tBuf = fs.readFileSync(path.resolve(__dirname, `../public/gallery/${galleryAssets[i].file}`));
      const tRes = await uploadBufferToB2(tBuf, tKey, 'image/jpeg');

      reviewB2Records.push({
        candidate_name: v.candidate,
        country: v.country,
        job_category: v.category,
        testimonial_title: v.title,
        video_url: vRes.url,
        thumbnail_url: tRes.url
      });
    }
  }

  console.log('\n--- Syncing to TiDB Tables ---');

  // 5. Update Company Settings
  const existingSettings = await query('SELECT id FROM company_settings LIMIT 1;');
  if (existingSettings.length > 0) {
    await query(`
      UPDATE company_settings SET 
        company_name = 'Joy Manpower Solution',
        tagline = 'Overseas Recruitment Services • Saudi Arabia & Dubai',
        logo_url = ?,
        phone = '+91 90033 80233',
        whatsapp_number = '+919003380233',
        email = 'contact@joymanpowersolution.com',
        address = 'Joy Manpower Solution, Overseas Placement Division, Chennai & Mumbai, India',
        facebook_url = 'https://facebook.com/joymanpowersolution',
        instagram_url = 'https://instagram.com/joymanpowersolution',
        youtube_url = 'https://youtube.com/@joymanpowersolution',
        linkedin_url = 'https://linkedin.com/company/joymanpowersolution',
        website_description = 'Authorized overseas recruitment consultancy connecting skilled Indian technicians, trades, and professionals with verified corporate sponsors across UAE & Saudi Arabia.',
        updated_at = NOW()
      WHERE id = ?;
    `, [logoUrl || null, existingSettings[0].id]);
    console.log('[TiDB] Updated company_settings with B2 logo URL');
  }

  // 6. Update Homepage Banner
  const existingBanners = await query('SELECT id FROM homepage_banner LIMIT 1;');
  if (existingBanners.length > 0) {
    await query(`
      UPDATE homepage_banner SET 
        image_url = ?,
        mobile_image_url = ?,
        heading = 'Saudi Arabia & Dubai',
        description = 'Authorized overseas recruitment consultancy connecting skilled Indian technicians, trades, and professionals with verified corporate sponsors across UAE & Saudi Arabia.',
        benefit_1 = 'Direct Corporate Sponsor Visas',
        benefit_2 = 'Certified Skill & Workshop Trade Testing',
        benefit_3 = 'Zero Hidden Charges & Transparent Terms',
        button_text = 'Apply Now',
        button_link = '/jobs',
        is_active = 1,
        updated_at = NOW()
      WHERE id = ?;
    `, [bannerUrl, bannerUrl, existingBanners[0].id]);
    console.log('[TiDB] Updated homepage_banner with B2 banner URL');
  } else {
    await query(`
      INSERT INTO homepage_banner 
      (image_url, mobile_image_url, heading, description, benefit_1, benefit_2, benefit_3, button_text, button_link, is_active, updated_at)
      VALUES (?, ?, 'Saudi Arabia & Dubai', 'Authorized overseas recruitment consultancy connecting skilled Indian technicians, trades, and professionals with verified corporate sponsors across UAE & Saudi Arabia.', 'Direct Corporate Sponsor Visas', 'Certified Skill & Workshop Trade Testing', 'Zero Hidden Charges & Transparent Terms', 'Apply Now', '/jobs', 1, NOW());
    `, [bannerUrl, bannerUrl]);
    console.log('[TiDB] Inserted homepage_banner with B2 banner URL');
  }

  // 7. Sync Gallery
  const existingGallery = await query('SELECT COUNT(*) as count FROM gallery;');
  if (existingGallery[0].count === 0) {
    for (const g of galleryB2Urls) {
      await query(`
        INSERT INTO gallery (title, image_url, description, status, display_order, created_at) 
        VALUES (?, ?, ?, 'published', ?, NOW());
      `, [g.title, g.b2Url, g.description, g.order]);
    }
    console.log(`[TiDB] Seeded ${galleryB2Urls.length} gallery records with B2 URLs`);
  }

  // 8. Sync Video Reviews
  const existingReviews = await query('SELECT COUNT(*) as count FROM reviews;');
  if (existingReviews[0].count === 0) {
    for (const r of reviewB2Records) {
      await query(`
        INSERT INTO reviews 
        (candidate_name, country, job_category, testimonial_title, video_url, thumbnail_url, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'published', NOW(), NOW());
      `, [r.candidate_name, r.country, r.job_category, r.testimonial_title, r.video_url, r.thumbnail_url]);
    }
    console.log(`[TiDB] Seeded ${reviewB2Records.length} video review records with B2 URLs`);
  }

  // 9. Sync Initial Gulf Jobs
  const existingJobs = await query('SELECT COUNT(*) as count FROM jobs;');
  if (existingJobs[0].count === 0) {
    const jobsToInsert = [
      {
        title: 'HVAC Technician & Maintenance Specialist',
        country: 'UAE',
        location: 'Dubai, UAE',
        category: 'Facility Management',
        salary: 'AED 3,200 - 4,200 / month',
        vacancies: 10,
        experience: '3-5 Years (Gulf experience preferred)',
        qualification: 'ITI or Diploma in Refrigeration & Air Conditioning',
        description: 'We are hiring skilled HVAC Technicians for prestigious commercial tower maintenance in Dubai. The ideal candidate must have hands-on experience in servicing chiller plants, FCUs, AHUs, and VRF systems.',
        responsibilities: '• Daily inspection, troubleshooting, and preventive maintenance of central air conditioning units.\n• Diagnose electrical and mechanical faults in HVAC systems.\n• Replace compressors, motors, fans, and recharge refrigerants.\n• Maintain safety standards according to Dubai Municipality codes.',
        benefits: 'Free accommodation, company transportation, medical insurance, 30 days annual paid leave, return air ticket every 2 years, direct employment visa provided.',
        deadline: '2026-12-31'
      },
      {
        title: 'Heavy Equipment & Mobile Crane Operator',
        country: 'Saudi Arabia',
        location: 'Riyadh, Saudi Arabia',
        category: 'Construction & Engineering',
        salary: 'SAR 3,800 - 5,000 / month',
        vacancies: 8,
        experience: '4+ Years with valid GCC or Indian Heavy License',
        qualification: 'Secondary School Certificate + Certified Heavy Equipment Operating License',
        description: 'Urgent requirement for certified Mobile and Crawler Crane Operators for large infrastructure project in Riyadh. Must possess strong safety compliance records.',
        responsibilities: '• Operate hydraulic mobile cranes and crawler cranes on construction sites safely.\n• Conduct pre-operational machine checks, oil levels, and rigging checks.\n• Work in coordination with riggers and site safety officers.\n• Report machinery maintenance requirements promptly.',
        benefits: 'Free bachelor accommodation, food allowance, medical card, direct employment visa, overtime as per Saudi Labor Law.',
        deadline: '2026-12-25'
      },
      {
        title: 'Civil Site Supervisor (Infrastructure & Roads)',
        country: 'UAE',
        location: 'Dubai, UAE',
        category: 'Construction & Engineering',
        salary: 'AED 5,500 - 7,000 / month',
        vacancies: 5,
        experience: '5-8 Years in GCC or large-scale civil projects',
        qualification: 'Diploma or B.Tech in Civil Engineering',
        description: 'Leading tier-1 contracting firm in Dubai is recruiting experienced Civil Site Supervisors to oversee execution of highway and building developments.',
        responsibilities: '• Supervise daily site activities of civil subcontractors and labor crews.\n• Ensure work adheres to structural drawings, bar bending schedules, and QA/QC norms.\n• Monitor project milestone timelines and enforce site safety procedures.\n• Coordinate material deliveries and concrete pouring schedules.',
        benefits: 'Company vehicle + fuel allowance, family medical insurance, 30 days annual leave with flight ticket allowance, performance bonus.',
        deadline: '2027-01-15'
      },
      {
        title: 'Industrial Electrician (Oil & Gas Petrochemical)',
        country: 'Saudi Arabia',
        location: 'Yanbu / Jubail, Saudi Arabia',
        category: 'Oil & Gas',
        salary: 'SAR 3,500 - 4,800 / month',
        vacancies: 12,
        experience: '3-6 Years in industrial or petrochemical installations',
        qualification: 'ITI / Diploma in Electrical Engineering',
        description: 'Reputed industrial engineering contractor in Saudi Arabia has openings for certified Industrial Electricians for petrochemical plant expansion.',
        responsibilities: '• Install, terminate, and test high and medium-voltage electrical cables, switchgears, and MCC panels.\n• Read and interpret complex electrical schematics and P&ID diagrams.\n• Cable tray fabrication, conduit bending, and explosion-proof fitting installations.\n• Carry out Megger testing, loop testing, and grounding verification.',
        benefits: 'Free accommodation, mess food facility, medical insurance, 2-year renewable contract, Iqama provided, overtime pay.',
        deadline: '2026-12-20'
      },
      {
        title: 'Hotel Front Desk & Guest Relations Executive',
        country: 'UAE',
        location: 'Dubai, UAE',
        category: 'Hospitality & Catering',
        salary: 'AED 3,000 - 3,800 / month + Service Charge',
        vacancies: 6,
        experience: '2-4 Years in 4-star or 5-star hotel front office',
        qualification: 'Degree / Diploma in Hotel Management or Hospitality',
        description: 'Luxury 4-star business hotel in Downtown Dubai seeks fluent English-speaking Front Desk Executives with warm interpersonal skills and Opera PMS proficiency.',
        responsibilities: '• Greet guests, handle check-in/check-out procedures smoothly using Opera PMS.\n• Address guest inquiries, concierge requests, and resolve complaints courteously.\n• Handle foreign currency exchange and billing transactions accurately.\n• Coordinate with housekeeping and security for seamless guest experience.',
        benefits: 'Duty meals, shared luxury staff accommodation, service charge distribution, annual flight ticket, medical coverage.',
        deadline: '2026-12-28'
      },
      {
        title: '6G TIG & ARC Pipe Welder',
        country: 'Saudi Arabia',
        location: 'Dammam, Saudi Arabia',
        category: 'Construction & Engineering',
        salary: 'SAR 3,200 - 4,500 / month',
        vacancies: 15,
        experience: '3+ Years with trade test certificate',
        qualification: 'ITI Welder / ASME 6G Certification',
        description: 'Direct recruitment for certified 6G Pipe Welders for pipeline installation in industrial city Dammam. Free visa and trade testing arranged.',
        responsibilities: '• Weld piping components in 6G position with TIG and Shielded Metal Arc Welding (SMAW).\n• Prepare joints, bevel edges, and perform root passes with zero defect tolerance.\n• Follow weld procedure specifications (WPS) and safety regulations.',
        benefits: 'Free bachelor accommodation, transport, medical insurance, direct Saudi work visa, overtime.',
        deadline: '2026-12-22'
      }
    ];

    for (const j of jobsToInsert) {
      await query(`
        INSERT INTO jobs 
        (title, country, location, category, salary, vacancies, experience, qualification, description, responsibilities, benefits, application_deadline, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(), NOW());
      `, [
        j.title, j.country, j.location, j.category, j.salary, j.vacancies,
        j.experience, j.qualification, j.description, j.responsibilities,
        j.benefits, j.deadline
      ]);
    }
    console.log(`[TiDB] Seeded ${jobsToInsert.length} published jobs for UAE and Saudi Arabia`);
  }

  console.log('\n--- B2 & TiDB Seed Completed Successfully! ---');
  await pool.end();
}

runSeed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
