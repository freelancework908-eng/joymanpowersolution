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

-- 3. AUTOMATIC UPDATED_AT TRIGGER FOR JOBS
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

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Jobs RLS:
-- Public can view only published jobs
drop policy if exists "Public can view published jobs" on public.jobs;
create policy "Public can view published jobs"
    on public.jobs for select
    using (status = 'published');

-- Authenticated admins can view, insert, update, and delete all jobs
drop policy if exists "Admins can manage all jobs" on public.jobs;
create policy "Admins can manage all jobs"
    on public.jobs for all
    to authenticated
    using (true)
    with check (true);

-- Applications RLS:
-- Public candidates can insert their application
drop policy if exists "Candidates can submit applications" on public.applications;
create policy "Candidates can submit applications"
    on public.applications for insert
    to anon, authenticated
    with check (true);

-- Authenticated admins can view, update, and delete all applications
drop policy if exists "Admins can manage applications" on public.applications;
create policy "Admins can manage applications"
    on public.applications for all
    to authenticated
    using (true)
    with check (true);

-- 5. STORAGE BUCKET FOR RESUMES
-- Create the resumes bucket if not exists
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Storage RLS:
-- Allow anyone to upload resumes
drop policy if exists "Anyone can upload resumes" on storage.objects;
create policy "Anyone can upload resumes"
    on storage.objects for insert
    to anon, authenticated
    with check (bucket_id = 'resumes');

-- Allow authenticated users to view/download resumes
drop policy if exists "Admins can view resumes" on storage.objects;
create policy "Admins can view resumes"
    on storage.objects for select
    to authenticated
    using (bucket_id = 'resumes');

-- Allow public read access to resume bucket files if direct link used
drop policy if exists "Public access to resumes" on storage.objects;
create policy "Public access to resumes"
    on storage.objects for select
    to anon
    using (bucket_id = 'resumes');

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
