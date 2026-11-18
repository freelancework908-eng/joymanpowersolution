import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  Building2, 
  FileCheck2, 
  Plane, 
  PhoneCall,
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { JobCard } from '../components/common/JobCard'
import { ApplyModal } from '../components/jobs/ApplyModal'
import { socialConfig } from '../config/socialLinks'

export const Home = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [activeJobForModal, setActiveJobForModal] = useState(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    const { data } = await jobService.getPublishedJobs()
    if (data) {
      setJobs(data)
    }
    setLoading(false)
  }

  const uaeCount = jobs.filter((j) => j.country === 'UAE').length
  const saudiCount = jobs.filter((j) => j.country === 'Saudi Arabia').length

  const filteredJobs = jobs.filter((j) => {
    if (selectedCountry === 'All') return true
    return j.country === selectedCountry
  }).slice(0, 6)

  return (
    <div className="space-y-14 sm:space-y-20 lg:space-y-24 w-full">
      {/* ========================================================
          1. HERO SECTION: Modern Teal & Green theme
          Two-column desktop, stacked mobile, responsive typography
         ======================================================== */}
      <section className="bg-gradient-to-b from-primary-50/70 via-white to-white py-12 sm:py-16 lg:py-20 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/70 border border-primary-200/80 text-xs sm:text-sm font-semibold text-primary-800">
                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Specialized Overseas Recruitment: <strong>UAE (Dubai)</strong> & <strong>Saudi Arabia</strong></span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-charcoal-800 tracking-tight leading-tight sm:leading-none">
                Find Your Next Career <br className="hidden sm:inline" />
                <span className="text-primary-500">Opportunity Abroad</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Joy Manpower Solution connects skilled Indian professionals, technicians, and trade specialists with verified premier employers across the <strong>United Arab Emirates (Dubai)</strong> and the <strong>Kingdom of Saudi Arabia</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-primary-500/20 transition-all duration-150 active:scale-95 text-sm sm:text-base"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-surface-section text-charcoal-800 font-bold px-7 py-3.5 rounded-xl border border-surface-border shadow-xs transition-all duration-150 text-sm sm:text-base"
                >
                  <PhoneCall className="w-4 h-4 text-primary-500" />
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Key Trust Stats */}
              <div className="pt-6 border-t border-surface-border grid grid-cols-3 gap-3 sm:gap-6 text-center lg:text-left">
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-primary-600">100%</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">Verified Employers</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-secondary-500">Direct</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">Company Visas</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-charcoal-800">₹0</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">Hidden Fees</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Interactive Destination Highlights */}
            <div className="lg:col-span-5 space-y-4">
              {/* Professional Recruitment Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-border bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80"
                  alt="Overseas recruitment engineers and skilled workforce"
                  className="w-full h-56 sm:h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-secondary-300 block">
                      Authentic GCC Deployment
                    </span>
                    <p className="text-sm font-bold leading-snug">
                      Authorized sponsor visas for UAE & Saudi Arabian commercial and industrial projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Destination Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/jobs?country=UAE"
                  className="p-3.5 rounded-xl bg-white hover:bg-primary-50 border border-surface-border hover:border-primary-300 transition-all flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🇦🇪</span>
                    <div>
                      <div className="text-xs font-bold text-charcoal-800 group-hover:text-primary-600">
                        UAE (Dubai)
                      </div>
                      <div className="text-[11px] text-slate-500">{uaeCount} Active Vacancies</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                </Link>

                <Link
                  to="/jobs?country=Saudi Arabia"
                  className="p-3.5 rounded-xl bg-white hover:bg-secondary-50 border border-surface-border hover:border-secondary-300 transition-all flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🇸🇦</span>
                    <div>
                      <div className="text-xs font-bold text-charcoal-800 group-hover:text-secondary-600">
                        Saudi Arabia
                      </div>
                      <div className="text-[11px] text-slate-500">{saudiCount} Active Vacancies</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-secondary-600 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. COUNTRY SELECTION SECTION: UAE & Saudi Arabia
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
            Our Exclusive Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800">
            Choose Your Destination Country
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Joy Manpower Solution focuses strictly on two premier Middle Eastern economies, guaranteeing dedicated attention, verified sponsor contracts, and authentic visa issuance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* UAE Card */}
          <div className="bg-white rounded-2xl border border-surface-border hover:border-primary-400 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl">🇦🇪</span>
                <span className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                  UAE – Dubai
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal-800">United Arab Emirates</h3>
              <p className="text-xs text-primary-600 font-semibold -mt-2">Dubai, Abu Dhabi & Sharjah</p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Global commercial center offering tax-free compensation, modern living standards, and opportunities across facility management, hospitality, logistics, and infrastructure maintenance.
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold text-charcoal-800 uppercase tracking-wide">Key Sectors:</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Facility Mgmt</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Hospitality & Tourism</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Civil Contracting</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Logistics</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/jobs?country=UAE"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs active:scale-95"
              >
                <span>Explore Dubai & UAE Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Saudi Arabia Card */}
          <div className="bg-white rounded-2xl border border-surface-border hover:border-secondary-400 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl">🇸🇦</span>
                <span className="text-xs font-bold bg-secondary-50 text-secondary-700 border border-secondary-200 px-3 py-1 rounded-full">
                  Saudi Arabia
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal-800">Kingdom of Saudi Arabia</h3>
              <p className="text-xs text-secondary-600 font-semibold -mt-2">Riyadh, Jeddah, Dammam & Jubail</p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Empowered by historic Vision 2030 megaprojects, Saudi Arabia creates immense demand for certified industrial electricians, heavy machinery operators, plant technicians, and logistics experts.
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold text-charcoal-800 uppercase tracking-wide">Key Sectors:</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Oil & Gas Plants</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Infrastructure & Vision 2030</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Heavy Machinery</span>
                  <span className="bg-surface-section text-slate-700 px-2.5 py-1 rounded-lg border border-surface-border">Supply Chain</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/jobs?country=Saudi Arabia"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs active:scale-95"
              >
                <span>Explore Saudi Arabia Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. LATEST JOB OPENINGS: Dynamic 3-cols / 2-cols / 1-col
         ======================================================== */}
      <section className="bg-surface-section py-14 sm:py-18 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
                Current Openings
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 mt-2">
                Latest Job Vacancies
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Verified overseas employers with official visa processing.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-surface-border shrink-0 self-start md:self-auto">
              {['All', 'UAE', 'Saudi Arabia'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCountry === c
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-charcoal-800'
                  }`}
                >
                  {c === 'All' ? 'All Jobs' : c === 'UAE' ? 'UAE (Dubai)' : 'Saudi Arabia'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid: 3 cols on large desktop, 2 on tablet, 1 on mobile */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-surface-border p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onQuickApply={(j) => setActiveJobForModal(j)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-border p-10 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-charcoal-800">No Openings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active vacancies match your current destination filter. Please explore all positions or check back soon.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-800 hover:bg-charcoal-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <span>View All Available Vacancies</span>
              <ArrowRight className="w-4 h-4 text-primary-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ABOUT JOY MANPOWER SOLUTION SECTION
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
              About Joy Manpower Solution
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal-800 leading-tight">
              A Transparent Gateway to GCC Careers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Joy Manpower Solution is an India-based overseas manpower consultancy dedicated exclusively to sourcing, screening, and deploying qualified technical and trade talent to registered corporate sponsors in <strong>UAE (Dubai)</strong> and <strong>Saudi Arabia</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our team understands MOHRE (UAE) and Qiwa / Musaned (Saudi Arabia) work visa guidelines. We ensure every candidate undergoes rigorous trade testing, background verification, and clear contract reviews.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-secondary-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-charcoal-800">
                  <strong>Direct Employer Visas:</strong> We do not deal in visit-to-work visa schemes.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-secondary-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-charcoal-800">
                  <strong>Dedicated UAE & Saudi Focus:</strong> Deep regional knowledge ensures fast document attestation and deployment.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-secondary-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-charcoal-800">
                  <strong>Ethical Recruitment:</strong> Transparent salary breakdown, accommodation details, and pre-departure briefings.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-xs sm:text-sm"
              >
                <span>Read more about our consultancy</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Highlights Cards */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-charcoal-800 border-b border-surface-border pb-3">
                Why Job Seekers Rely On Joy Manpower Solution
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h4 className="font-bold text-charcoal-800 text-xs sm:text-sm">Verified Sponsors</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Official job offer letters from licensed corporate entities in Dubai and Saudi Arabia.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h4 className="font-bold text-charcoal-800 text-xs sm:text-sm">Trade Testing</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Practical trade testing ensures correct salary fixation and role placement.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h4 className="font-bold text-charcoal-800 text-xs sm:text-sm">GAMCA & Attestation</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Guidance for medical fitness, MOFA attestation, and consular visa stamping.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h4 className="font-bold text-charcoal-800 text-xs sm:text-sm">Pre-Departure Care</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Comprehensive briefing on Gulf labor laws, customs, and employer reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. OUR RECRUITMENT SERVICES
         ======================================================== */}
      <section className="bg-surface-section py-14 sm:py-18 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
              What We Do
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800">
              Our Recruitment Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              End-to-end recruitment solutions connecting candidates with verified Gulf employers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-3 hover:border-primary-400 hover:shadow-xs transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Manpower Sourcing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nationwide candidate sourcing across technical, MEP, civil, hospitality, and logistics disciplines for Dubai & Saudi Arabia.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-3 hover:border-primary-400 hover:shadow-xs transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Trade & Skill Testing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practical workshop evaluations and skill certification to verify candidate competence before client submission.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-3 hover:border-primary-400 hover:shadow-xs transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Visa & Attestation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete assistance for GAMCA medical fitness, apostille, degree verification, and Saudi / UAE embassy visa stamping.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-3 hover:border-primary-400 hover:shadow-xs transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Deployment Briefing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-departure orientation on Gulf customs, labor laws, workplace safety, and sponsor reception coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. HOW OUR RECRUITMENT PROCESS WORKS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
            Straightforward Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800">
            How Our Recruitment Process Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Four clear steps from resume submission to reporting to your overseas sponsor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Submit Resume</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore our UAE & Saudi Arabia vacancies and submit your updated resume and trade details online.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Screening & Interview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shortlisted profiles undergo trade screening and direct interviews with overseas client delegates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Visa Stamping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign official employer contract, clear GAMCA medical tests, and complete visa stamping.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="font-bold text-charcoal-800 text-sm sm:text-base">Deploy to UAE / KSA</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attend pre-flight orientation, receive ticket, and fly directly to your workplace in Dubai or Saudi Arabia.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. QUICK CONTACT CTA STRIP (WhatsApp & Contact)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-charcoal-800 rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-charcoal-700">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-bold">
              Looking for Overseas Employment or Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our counselors are available to guide you on eligibility, trade tests, and documentation for UAE and Saudi Arabia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={socialConfig.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-xs active:scale-95"
            >
              <span>WhatsApp Us Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition-colors"
            >
              <span>Visit Contact Page</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Apply Modal */}
      {activeJobForModal && (
        <ApplyModal
          job={activeJobForModal}
          isOpen={Boolean(activeJobForModal)}
          onClose={() => setActiveJobForModal(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}
