-- ========================================================
-- JOY MANPOWER SOLUTION - DATABASE SCHEMA (SUPABASE)
-- Focused exclusively on UAE (Dubai) & Saudi Arabia
-- ========================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. JOBS TABLE
create table if not exists public.jobs (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    country text not null check (country in ('UAE', 'Saudi Arabia')),
    location text not null,
    category text not null,
    salary text not null,
    vacancies integer default 1,
    experience text not null,
    qualification text not null,
    description text not null,
    responsibilities text,
    benefits text,
    deadline date,
    status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. APPLICATIONS TABLE
create table if not exists public.applications (
    id uuid primary key default uuid_generate_v4(),
    job_id uuid references public.jobs(id) on delete set null,
    candidate_name text not null,
    mobile text not null,
    email text not null,
    experience text not null,
    current_location text not null,
    resume_path text not null,
    resume_url text,
    status text not null default 'pending' check (status in ('pending', 'shortlisted', 'rejected', 'selected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. HOMEPAGE BANNER TABLE
create table if not exists public.homepage_banner (
    id uuid primary key default uuid_generate_v4(),
    image_url text not null,
    mobile_image_url text,
    sub_heading text,
    heading text,
    description text,
    benefit1 text,
    benefit2 text,
    benefit3 text,
    button_text text,
    button_link text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REVIEWS TABLE (CUSTOMER REVIEW SHORTS / REELS)
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    candidate_name text,
    country text check (country in ('UAE', 'Saudi Arabia')),
    job_category text,
    testimonial_title text,
    video_url text not null,
    thumbnail_url text,
    status text not null default 'published' check (status in ('draft', 'published', 'unpublished')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. GALLERY TABLE
create table if not exists public.gallery (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    category text default 'General',
    image_url text not null,
    caption text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. COMPANY SETTINGS TABLE
create table if not exists public.company_settings (
    id uuid primary key default uuid_generate_v4(),
    company_name text not null default 'Joy Manpower Solution',
    tagline text default 'Overseas Recruitment Services • Saudi Arabia & Dubai',
    logo_url text,
    phone text default '+91 98765 43210',
    whatsapp text default '+919876543210',
    whatsapp_display text default '+91 98765 43210',
    email text default 'info@joymanpowersolution.com',
    location text default 'Mumbai, Maharashtra, India',
    address text default 'Suite 402, Executive Chambers, Nariman Point, Mumbai 400021, Maharashtra, India',
    working_hours text default 'Mon - Sat: 9:30 AM - 6:30 PM (IST)',
    facebook_url text,
    instagram_url text,
    youtube_url text,
    linkedin_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. AUTOMATIC UPDATED_AT TRIGGERS
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
    before update on public.jobs
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_homepage_banner_updated_at on public.homepage_banner;
create trigger set_homepage_banner_updated_at
    before update on public.homepage_banner
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
    before update on public.reviews
    for each row
    execute function public.handle_updated_at();

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.homepage_banner enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery enable row level security;
alter table public.company_settings enable row level security;

-- Jobs RLS:
drop policy if exists "Public can view published jobs" on public.jobs;
create policy "Public can view published jobs"
    on public.jobs for select
    using (status = 'published');

drop policy if exists "Admins can manage all jobs" on public.jobs;
create policy "Admins can manage all jobs"
    on public.jobs for all
    to authenticated
    using (true)
    with check (true);

-- Applications RLS:
drop policy if exists "Candidates can submit applications" on public.applications;
create policy "Candidates can submit applications"
    on public.applications for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Admins can manage applications" on public.applications;
create policy "Admins can manage applications"
    on public.applications for all
    to authenticated
    using (true)
    with check (true);

-- Homepage Banner RLS:
drop policy if exists "Public can view active banner" on public.homepage_banner;
create policy "Public can view active banner"
    on public.homepage_banner for select
    using (is_active = true);

drop policy if exists "Admins can manage all banners" on public.homepage_banner;
create policy "Admins can manage all banners"
    on public.homepage_banner for all
    to authenticated
    using (true)
    with check (true);

-- Reviews RLS:
drop policy if exists "Public can view published reviews" on public.reviews;
create policy "Public can view published reviews"
    on public.reviews for select
    using (status = 'published');

drop policy if exists "Admins can manage all reviews" on public.reviews;
create policy "Admins can manage all reviews"
    on public.reviews for all
    to authenticated
    using (true)
    with check (true);

-- Gallery RLS:
drop policy if exists "Public can view gallery" on public.gallery;
create policy "Public can view gallery"
    on public.gallery for select
    using (true);

drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
    on public.gallery for all
    to authenticated
    using (true)
    with check (true);

-- Company Settings RLS:
drop policy if exists "Public can view company settings" on public.company_settings;
create policy "Public can view company settings"
    on public.company_settings for select
    using (true);

drop policy if exists "Admins can manage company settings" on public.company_settings;
create policy "Admins can manage company settings"
    on public.company_settings for all
    to authenticated
    using (true)
    with check (true);

-- 8. STORAGE BUCKETS (RESUMES, BANNERS, REVIEWS, GALLERY)
insert into storage.buckets (id, name, public)
values 
    ('resumes', 'resumes', true),
    ('banners', 'banners', true),
    ('reviews', 'reviews', true),
    ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Storage RLS:
drop policy if exists "Anyone can upload resumes" on storage.objects;
create policy "Anyone can upload resumes"
    on storage.objects for insert
    to anon, authenticated
    with check (bucket_id = 'resumes');

drop policy if exists "Public access to resumes" on storage.objects;
create policy "Public access to resumes"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'resumes');

-- Banners bucket:
drop policy if exists "Public access to banners" on storage.objects;
create policy "Public access to banners"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'banners');

drop policy if exists "Admins can manage banner files" on storage.objects;
create policy "Admins can manage banner files"
    on storage.objects for all
    to authenticated
    using (bucket_id = 'banners')
    with check (bucket_id = 'banners');

-- Reviews bucket:
drop policy if exists "Public access to review files" on storage.objects;
create policy "Public access to review files"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'reviews');

drop policy if exists "Admins can manage review files" on storage.objects;
create policy "Admins can manage review files"
    on storage.objects for all
    to authenticated
    using (bucket_id = 'reviews')
    with check (bucket_id = 'reviews');

-- 6. DEMO SEED JOBS FOR IMMEDIATE PREVIEW (UAE & SAUDI ARABIA ONLY)
insert into public.jobs (
    title, country, location, category, salary, vacancies, experience, qualification,
    description, responsibilities, benefits, deadline, status
) values
(
    'HVAC Technician & Maintenance Specialist',
    'UAE',
    'Dubai, UAE',
    'Facility Management',
    'AED 3,200 - 4,200 / month',
    10,
    '3-5 Years (Gulf experience preferred)',
    'ITI or Diploma in Refrigeration & Air Conditioning',
    'We are hiring skilled HVAC Technicians for prestigious commercial tower maintenance in Dubai. The ideal candidate must have hands-on experience in servicing chiller plants, FCUs, AHUs, and VRF systems.',
    '• Daily inspection, troubleshooting, and preventive maintenance of central air conditioning units.\n• Diagnose electrical and mechanical faults in HVAC systems.\n• Replace compressors, motors, fans, and recharge refrigerants.\n• Maintain safety standards according to Dubai Municipality codes.',
    'Free accommodation, company transportation, medical insurance, 30 days annual paid leave, return air ticket every 2 years, employment visa provided.',
    current_date + interval '30 days',
    'published'
),
(
    'Heavy Equipment & Crane Operator',
    'Saudi Arabia',
    'Riyadh, Saudi Arabia',
    'Construction & Engineering',
    'SAR 3,800 - 5,000 / month',
    8,
    '4+ Years with valid GCC or Indian Heavy License',
    'Secondary School Certificate + Certified Heavy Equipment Operating License',
    'Urgent requirement for certified Mobile and Crawler Crane Operators for large infrastructure project in Riyadh. Must possess strong safety compliance records.',
    '• Operate hydraulic mobile cranes and crawler cranes on construction sites safely.\n• Conduct pre-operational machine checks, oil levels, and rigging checks.\n• Work in coordination with riggers and site safety officers.\n• Report machinery maintenance requirements promptly.',
    'Free bachelor accommodation, food allowance, medical card, direct employment visa, overtime as per Saudi Labor Law.',
    current_date + interval '25 days',
    'published'
),
(
    'Civil Site Supervisor (Infrastructure)',
    'UAE',
    'Dubai, UAE',
    'Construction & Engineering',
    'AED 5,500 - 7,000 / month',
    5,
    '5-8 Years in GCC or large-scale civil projects',
    'Diploma or B.Tech in Civil Engineering',
    'Leading tier-1 contracting firm in Dubai is recruiting experienced Civil Site Supervisors to oversee execution of highway and building developments.',
    '• Supervise daily site activities of civil subcontractors and labor crews.\n• Ensure work adheres to structural drawings, bar bending schedules, and QA/QC norms.\n• Monitor project milestone timelines and enforce site safety procedures.\n• Coordinate material deliveries and concrete pouring schedules.',
    'Company vehicle + fuel allowance, family medical insurance, 30 days annual leave with flight ticket allowance, performance bonus.',
    current_date + interval '45 days',
    'published'
),
(
    'Industrial Electrician (Oil & Gas Plant)',
    'Saudi Arabia',
    'Jeddah / Yanbu, Saudi Arabia',
    'Oil & Gas',
    'SAR 3,500 - 4,800 / month',
    12,
    '3-6 Years in industrial or petrochemical installations',
    'ITI / Diploma in Electrical Engineering',
    'Reputed industrial engineering contractor in Saudi Arabia has openings for certified Industrial Electricians for petrochemical plant expansion.',
    '• Install, terminate, and test high and medium-voltage electrical cables, switchgears, and MCC panels.\n• Read and interpret complex electrical schematics and P&ID diagrams.\n• Cable tray fabrication, conduit bending, and explosion-proof fitting installations.\n• Carry out Megger testing, loop testing, and grounding verification.',
    'Free accommodation, mess food facility, medical insurance, 2-year renewable contract, Iqama provided, overtime pay.',
    current_date + interval '20 days',
    'published'
),
(
    'Hotel Front Desk & Guest Relations Executive',
    'UAE',
    'Dubai, UAE',
    'Hospitality & Catering',
    'AED 3,000 - 3,800 + Service Charges',
    6,
    '2-4 Years in 4-star or 5-star hotel front office',
    'Degree / Diploma in Hotel Management or Hospitality',
    'Luxury 4-star business hotel in Downtown Dubai seeks fluent English-speaking Front Desk Executives with warm interpersonal skills and Opera PMS proficiency.',
    '• Greet guests, handle check-in/check-out procedures smoothly using Opera PMS.\n• Address guest inquiries, concierge requests, and resolve complaints courteously.\n• Handle foreign currency exchange and billing transactions accurately.\n• Coordinate with housekeeping and security for seamless guest experience.',
    'Shared accommodation in hotel staff quarters, duty meals, transportation, medical insurance, service charge share, tip incentives.',
    current_date + interval '15 days',
    'published'
),
(
    'Warehouse Inventory & Logistics Coordinator',
    'Saudi Arabia',
    'Dammam, Saudi Arabia',
    'Logistics & Transport',
    'SAR 3,200 - 4,000 / month',
    7,
    '2-5 Years in warehouse or FMCG supply chain',
    'Any Bachelor degree or Diploma in Supply Chain / Logistics',
    'Fast-growing logistics hub in Dammam requires Warehouse Coordinators for FMCG distribution center operations.',
    '• Manage incoming and outgoing inventory receipts using warehouse management software (WMS).\n• Coordinate pick-and-pack schedules with forklift operators and delivery drivers.\n• Perform periodic cycle counts and reconcile stock discrepancies.\n• Prepare shipping manifests, customs paperwork, and dispatch orders.',
    'Free accommodation, transport to warehouse, company medical coverage, Iqama processing, paid annual vacation.',
    current_date + interval '35 days',
    'published'
);

-- 7. DEMO SEED HOMEPAGE BANNER
insert into public.homepage_banner (
    id, image_url, heading, description, button_text, button_link, is_active
) values (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1920&q=85',
    'Leading Overseas Recruitment for UAE & Saudi Arabia',
    'Connecting Indian technical professionals and skilled trades with verified corporate sponsors in Dubai, Riyadh, and Jeddah. 100% authentic employment visas.',
    'Explore Gulf Job Openings',
    '/jobs',
    true
)
on conflict (id) do nothing;

-- 8. DEMO SEED REVIEWS (SHORTS / REELS)
insert into public.reviews (
    id, candidate_name, country, job_category, testimonial_title, video_url, thumbnail_url, status
) values
(
    '11111111-1111-1111-1111-111111111111',
    'Mohammed Imran',
    'UAE',
    'Facility Management',
    'Secured HVAC Technician Role in Dubai with Company Accommodation',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    'published'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Rajesh Kumar',
    'Saudi Arabia',
    'Construction & Engineering',
    'Crane Operator Deployment in Riyadh - Smooth GAMCA & Visa Stamping',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    'published'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Sunil Sharma',
    'UAE',
    'Construction & Engineering',
    'Civil Site Supervisor in Dubai Commercial Development',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'published'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Abdul Rahman',
    'Saudi Arabia',
    'Oil & Gas',
    'Industrial Electrician at Petrochemical Plant in Yanbu',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'published'
),
-- 9. DEMO SEED COMPANY SETTINGS
insert into public.company_settings (
    id, company_name, tagline, phone, whatsapp, whatsapp_display, email, location, address, facebook_url, instagram_url, youtube_url, linkedin_url
) values (
    'c0000000-0000-0000-0000-000000000001',
    'Joy Manpower Solution',
    'Overseas Recruitment Services • Saudi Arabia & Dubai',
    '+91 98765 43210',
    '+919876543210',
    '+91 98765 43210',
    'info@joymanpowersolution.com',
    'Mumbai, Maharashtra, India',
    'Suite 402, Executive Chambers, Nariman Point, Mumbai 400021, Maharashtra, India',
    'https://facebook.com',
    'https://instagram.com',
    'https://youtube.com',
    'https://linkedin.com'
)
on conflict (id) do nothing;

-- 10. DEMO SEED GALLERY
insert into public.gallery (
    id, title, category, image_url, caption
) values
(
    'g0000000-0000-0000-0000-000000000001',
    'Dubai & Abu Dhabi Overseas Hiring: Welders, Drivers & Operators',
    'Client Interviews',
    '/gallery/jms-uae-hiring-drivers-welders.jpg',
    'Official recruitment drive for Dubai & Abu Dhabi: Welders, Heavy Bus Drivers (AED 3,080/mo), Lorry Drivers & Crane Operators. Coordinator: A. Sekar (9003380233).'
),
(
    'g0000000-0000-0000-0000-000000000002',
    'UAE Urgent Recruitment: 200 Construction General Helpers',
    'Deployments',
    '/gallery/jms-uae-construction-helpers-200.jpg',
    'Urgent manpower deployment announcement: 200 Construction General Helpers mobilized from India for premier UAE infrastructure developments.'
),
(
    'g0000000-0000-0000-0000-000000000003',
    'UAE Planning Engineer Recruitment (திட்டமிடல் பொறியாளர்)',
    'Client Interviews',
    '/gallery/jms-uae-planning-engineer.jpg',
    'Direct UAE corporate selection for experienced Planning Engineers with minimum 4 years construction project scheduling and coordination expertise.'
),
(
    'g0000000-0000-0000-0000-000000000004',
    'Trade Testing & Practical Workshop Evaluation',
    'Trade Testing',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    'Practical HVAC and electrical skill verification in our authorized trade workshop.'
)
on conflict (id) do nothing;
