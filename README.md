# Joy Manpower Solution – Dynamic Overseas Job Consultancy Website

A lightweight, modern, responsive, and dynamic web application for **Joy Manpower Solution**, an overseas recruitment consultancy based in India specializing exclusively in career opportunities in:
1. **United Arab Emirates (Dubai, Abu Dhabi, Sharjah)**
2. **Kingdom of Saudi Arabia (Riyadh, Jeddah, Dammam, Jubail)**

---

## 🚀 Key Features

### 🌐 Public Portal
- **Hero Section**: High-impact messaging (*"Find Your Next Career Opportunity Abroad"*), destination highlights, verified recruiter credentials, and quick action buttons.
- **Exclusive Country Showcase**: Dedicated filters and profiles for **UAE (Dubai)** and **Saudi Arabia**. (No other international destinations are shown).
- **Dynamic Job Listings**: Real-time listing with country badges, salary, vacancies, required experience, and category filtering.
- **Detailed Job Pages**: Comprehensive responsibilities, qualifications, benefits provided (accommodation, transport, visa), and application deadlines.
- **Candidate Job Application Modal**:
  - Auto-populated job title.
  - Full Name, Mobile, Email, Experience, Current Location.
  - Resume upload validation (PDF/DOC/DOCX up to 5MB).
  - Explicit candidate consent checkbox.
  - Direct WhatsApp recruitment team contact shortcut.
- **About Joy Manpower Solution**: Transparent recruitment methodology, ethical placement policies, and mission/vision without fabricated government approvals.
- **Contact Us**: Company contact info, inquiry form, WhatsApp click-to-chat link, and interactive map embed.

### 🔐 Admin Management Panel
- **Protected Access**: Route-protected authentication (`/admin/dashboard`, `/admin/jobs`, `/admin/applications`).
- **Dashboard Overview**: Metrics for Total Jobs, Published Jobs, Closed Jobs, and Total Applications.
- **Job Vacancy Management**:
  - Add new vacancies with validation (Title, Country [UAE or Saudi Arabia], Location, Salary, Vacancies, Experience, Qualification, Responsibilities, Benefits, Deadline, Status).
  - Edit existing vacancies.
  - Quick status toggles (Publish, Draft, Closed).
  - Immediate reflection on the public site (published jobs show live; closed/draft jobs do not appear in active listings).
  - Delete vacancies with safety confirmation.
- **Candidate Application Management**:
  - View all candidate applications with contact info, applied position, experience, and submission date.
  - View/Download uploaded candidate resumes.
  - Update application progress (`Pending`, `Shortlisted`, `Selected`, `Rejected`).
  - Search by candidate name, mobile, email, or job title.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, React Router DOM 6
- **Styling**: Tailwind CSS (Navy Blue `#0F223D`, Gold/Amber `#D97706`, Slate)
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL, Row-Level Security)
- **Authentication**: Supabase Auth (with offline demo fallback for evaluation)
- **Resume Storage**: Supabase Storage (`resumes` bucket)

---

## 📁 Project Structure

```
joymanpowersolution/
├── public/
│   └── logo-icon.svg          # Corporate brand icon
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx     # Admin sidebar and layout
│   │   │   └── ProtectedRoute.jsx  # Route guard for admin panel
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Header with contact & nav links
│   │   │   ├── Footer.jsx          # Footer with UAE/Saudi focus
│   │   │   └── JobCard.jsx         # Reusable job card
│   │   └── jobs/
│   │       └── ApplyModal.jsx      # Resume upload application modal
│   ├── context/
│   │   └── AuthContext.jsx         # Supabase & demo authentication
│   ├── data/
│   │   └── initialJobs.js          # Verified seed vacancies (UAE & Saudi)
│   ├── lib/
│   │   └── supabase.js             # Supabase client configuration
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx      # Admin login page
│   │   │   ├── AdminDashboard.jsx  # Metric cards & recent activity
│   │   │   ├── AdminJobs.jsx       # Job CRUD & status toggles
│   │   │   └── AdminApplications.jsx # Candidate resumes & status updates
│   │   ├── Home.jsx                # Landing page
│   │   ├── About.jsx               # About us page
│   │   ├── Jobs.jsx                # Searchable & filterable job catalog
│   │   ├── JobDetails.jsx          # Detailed job view & apply action
│   │   └── Contact.jsx             # Contact details & inquiry form
│   ├── services/
│   │   ├── jobService.js           # Supabase + local fallback job service
│   │   └── applicationService.js   # Supabase + local fallback resume service
│   ├── App.jsx                     # Route architecture
│   ├── index.css                   # Tailwind styles
│   └── main.jsx                    # React entrypoint
├── supabase/
│   └── schema.sql                  # PostgreSQL schema, RLS policies & demo seed
├── .env.example                    # Environment variable template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚡ Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Supabase)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Supabase Project URL and Anon Key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Note:** If no Supabase credentials are provided, the application runs smoothly in high-fidelity **Demo Mode** using persistent local state, allowing you to test all admin actions, job posting, and candidate applications right away.

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Database & Storage Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the entire script.
   - Creates the `jobs` table.
   - Creates the `applications` table.
   - Sets up `resumes` storage bucket with appropriate upload policies.
   - Configures Row-Level Security (RLS) so public visitors can only read published jobs and submit applications, while authenticated admins have full management access.
   - Inserts realistic initial jobs for Dubai (UAE) and Saudi Arabia.
4. Copy the Project URL and Anon Key from **Project Settings > API** into your `.env` file.

---

## 🔑 Admin Credentials (Demo Mode)

- **Email**: `admin@joymanpowersolution.com`
- **Password**: `admin123`
*(A quick one-click "Fill Demo Credentials" button is available on `/admin/login` for rapid testing).*

---

## ⚖️ Budget & Ethical Guidelines

- Focuses strictly on **UAE (Dubai)** and **Saudi Arabia**.
- Avoids unnecessary paid dependencies, microservices, and complex CRMs.
- Direct click-to-chat WhatsApp integration without costly third-party API gateways.
- Completely responsive on mobile, tablet, and desktop devices.
