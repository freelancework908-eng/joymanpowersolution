# Joy Manpower Solution – Dynamic Overseas Job Consultancy Website

A lightweight, modern, responsive, and dynamic web application for **Joy Manpower Solution**, an overseas recruitment consultancy based in India specializing exclusively in career opportunities in:
1. **United Arab Emirates (Dubai, Abu Dhabi, Sharjah)**
2. **Kingdom of Saudi Arabia (Riyadh, Jeddah, Dammam, Jubail)**

---

## 🎨 Modern Teal & Green Theme

The user interface has been redesigned with a fresh, international recruitment portal appearance:

- **Primary**: Deep Teal (`#087F8C`)
- **Secondary / Accents**: Fresh Green (`#20A66A` / WhatsApp `#25D366`)
- **Headings**: Dark Charcoal (`#202B33`)
- **Body Text**: Slate Grey (`#64748B`)
- **Background**: Pure White (`#FFFFFF`)
- **Section Background**: Light Grey (`#F5F8F9`)
- **Borders**: Light Grey (`#E5E7EB`)

*Zero navy-blue and gold elements. High contrast, professional typography, and clean recruitment styling.*

---

## 📱 Fully Responsive Design

Tested and optimized across all major breakpoints without horizontal scrolling:
- **320px – 425px** (Mobile Phones)
- **768px** (Tablets & iPads)
- **1024px** (Laptops & Tablet Landscape)
- **1280px – 1920px** (Desktop & Ultra-wide displays)

### Responsive Features:
- **Header**: Desktop navigation with brand logo; mobile drawer menu with touch-friendly navigation links and no overflow.
- **Hero**: Scaled two-column layout on desktop, stacked on mobile with high-quality overseas workforce imagery.
- **Job Cards**: 3 columns on large desktop, 2 columns on tablet, 1 column on mobile with consistent height and clear salary/experience pills.
- **Forms & Upload**: Full-width inputs on mobile, clear validation alerts, and responsive resume upload (PDF/DOC/DOCX).
- **Footer**: Responsive 4-column layout on desktop, stacked sections on mobile.

---

## 🔗 Floating Social Media Buttons (`FloatingSocialLinks`)

Centralized configuration in `src/config/socialLinks.js`:
- **WhatsApp**: Direct click-to-chat with pre-filled candidate message.
- **Facebook**: Official company page link.
- **Instagram**: Official company profile link.
- **YouTube**: Official company channel link.

### Layout:
- **Desktop**: Fixed vertical toolbar on the right side (~50% from top) with circular icon buttons, hover elevation, and interactive tooltips.
- **Mobile**: Compact bottom-right floating action widget positioned above the browser safe-area that expands smoothly on tap, ensuring it never blocks application forms or primary buttons.
- **Visibility**: Displayed across all public pages; automatically excluded from the admin dashboard.
- **Clean Fallback**: Unavailable or empty social links are automatically hidden to prevent dead links.

---

## 🚀 Key Modules & Pages

### 🌐 Public Portal
1. **Home Page (`/`)**: Hero section, exclusive UAE (Dubai) & Saudi Arabia country selectors, latest dynamic job openings, about summary, services, and recruitment pipeline.
2. **About Us (`/about`)**: Company background, mission, vision, and ethical recruitment standards (direct visas only).
3. **Jobs Listing (`/jobs`)**: Filterable job catalog by country (All / UAE / Saudi Arabia), category, and keyword search.
4. **Job Details (`/jobs/:id`)**: Comprehensive role overview, responsibilities, candidate requirements, benefits, and instant apply trigger.
5. **Apply Modal (`ApplyModal`)**: Full name, mobile, email, experience, location, resume file check (up to 5MB), and candidate consent.
6. **Contact Us (`/contact`)**: Office contact info, WhatsApp chat link, inquiry form, and location map embed.

### 🔐 Admin Management Panel
1. **Admin Login (`/admin/login`)**: Protected route with one-click demo credentials (`admin@joymanpowersolution.com` / `admin123`) or Supabase Auth.
2. **Dashboard (`/admin/dashboard`)**: Metric cards for Total Jobs, Published Jobs, Closed Jobs, and Total Applications.
3. **Job Vacancy Management (`/admin/jobs`)**: Add, edit, delete, publish/unpublish, and close job vacancies with immediate synchronization to the public website.
4. **Candidate Applications (`/admin/applications`)**: View candidate profiles, download resumes, and update application status (`Pending`, `Shortlisted`, `Selected`, `Rejected`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, React Router DOM 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React + Authentic Social SVG Icons
- **Backend & Database**: Supabase (PostgreSQL, Row-Level Security)
- **Resume Storage**: Supabase Storage (`resumes` bucket)

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.
Admin portal: `http://localhost:5173/admin/login` (Email: `admin@joymanpowersolution.com` | Password: `admin123`).
