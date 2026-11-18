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
  Sparkles
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { JobCard } from '../components/common/JobCard'
import { ApplyModal } from '../components/jobs/ApplyModal'

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
  }).slice(0, 6) // Show top 6 latest jobs

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white overflow-hidden py-20 lg:py-28">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800/80 border border-brand-700/60 text-xs sm:text-sm font-medium text-gold-400">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Dedicated Recruitment for Dubai (UAE) & Saudi Arabia</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Find Your Next Career <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                  Opportunity Abroad
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Joy Manpower Solution connects skilled Indian professionals, technicians, and trade specialists with verified premier employers across the <strong>United Arab Emirates (Dubai)</strong> and the <strong>Kingdom of Saudi Arabia</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-200 active:scale-95"
                >
                  <Briefcase className="w-5 h-5 text-slate-950" />
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-800/90 hover:bg-brand-800 text-white font-semibold px-7 py-3.5 rounded-xl border border-brand-700 shadow-sm transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4 text-gold-400" />
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Key Features Badges */}
              <div className="pt-6 border-t border-brand-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Verified Employers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-gold-400">Direct</div>
                  <div className="text-xs text-slate-400 font-medium">Company Visas</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">₹0</div>
                  <div className="text-xs text-slate-400 font-medium">Hidden Processing Fees</div>
                </div>
              </div>
            </div>

            {/* Right Quick Search / Destination Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Select Target Destination</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    We specialize solely in UAE and Saudi Arabian employment sectors.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* UAE Card */}
                  <Link
                    to="/jobs?country=UAE"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🇦🇪</div>
                      <div>
                        <div className="font-bold text-white group-hover:text-gold-300 transition-colors">
                          United Arab Emirates
                        </div>
                        <div className="text-xs text-slate-300">Dubai, Abu Dhabi & Sharjah</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold bg-brand-800 px-2.5 py-1 rounded-md text-gold-300">
                        {uaeCount} Active
                      </span>
                    </div>
                  </Link>

                  {/* Saudi Arabia Card */}
                  <Link
                    to="/jobs?country=Saudi Arabia"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🇸🇦</div>
                      <div>
                        <div className="font-bold text-white group-hover:text-gold-300 transition-colors">
                          Saudi Arabia
                        </div>
                        <div className="text-xs text-slate-300">Riyadh, Jeddah & Dammam</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold bg-brand-800 px-2.5 py-1 rounded-md text-gold-300">
                        {saudiCount} Active
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-brand-900/60 border border-brand-700/50 text-xs text-slate-300 space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Candidate Safety & Compliance</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    All recruitment mandates correspond directly to verified corporate sponsors in Dubai and Saudi Arabia with full labor law adherence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COUNTRY SELECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            Our Exclusive Focus
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            Choose Your Destination Country
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Joy Manpower Solution focuses strictly on two premier Middle Eastern economies, delivering dedicated expertise, verified sponsor contracts, and seamless visa processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UAE Card */}
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-brand-500 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🇦🇪</span>
                <span className="text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full">
                  UAE – Dubai
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">United Arab Emirates</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Dubai, Abu Dhabi, Sharjah & Free Zones</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Fast-growing international hub offering tax-free compensation, global standard infrastructure, and exceptional employment opportunities in hospitality, facility management, construction, and corporate services.
              </p>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Key Sectors:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Facility Management</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Hospitality & Tourism</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Civil Contracting</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Retail & MEP</span>
                </div>
              </div>
            </div>

            <Link
              to="/jobs?country=UAE"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition-colors"
            >
              <span>Explore Dubai & UAE Jobs</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          {/* Saudi Arabia Card */}
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-600 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🇸🇦</span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  Saudi Arabia
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kingdom of Saudi Arabia</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Riyadh, Jeddah, Dammam & Jubail</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Driven by historic Vision 2030 megaprojects (NEOM, Red Sea, Infrastructure), Saudi Arabia provides tremendous demand for engineering, heavy machinery operations, oil & gas, logistics, and skilled craftsmen.
              </p>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Key Sectors:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Oil & Gas Plants</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Infrastructure & NEOM</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Heavy Machinery</span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Supply Chain & WMS</span>
                </div>
              </div>
            </div>

            <Link
              to="/jobs?country=Saudi Arabia"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition-colors"
            >
              <span>Explore Saudi Arabia Jobs</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. LATEST JOB OPENINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Current Vacancies
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Latest Job Openings
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Actively recruiting for verified overseas employers with direct visa issuance.
            </p>
          </div>

          {/* Country Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            {['All', 'UAE', 'Saudi Arabia'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCountry === c
                    ? 'bg-white text-brand-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'All' ? 'All Jobs' : c === 'UAE' ? 'UAE (Dubai)' : 'Saudi Arabia'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse">
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
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Openings Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are currently no active vacancies matching your selection. Please check back shortly or explore all positions.
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            <span>View All Available Vacancies</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      </section>

      {/* 4. ABOUT JOY MANPOWER SOLUTION */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                About Joy Manpower Solution
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Your Trusted Bridge to Gulf Employment Opportunities
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Joy Manpower Solution is an established overseas job recruitment consultancy in India. We specialize exclusively in sourcing, screening, and deploying skilled, semi-skilled, and professional manpower to companies across the <strong>United Arab Emirates</strong> and the <strong>Kingdom of Saudi Arabia</strong>.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our team understands the regulatory, documentation, and trade requirements of GCC employers. We ensure candidates undergo thorough trade testing and document checks, protecting both job seekers and overseas corporate clients.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>Direct Employer Requirements:</strong> Every job vacancy is verified directly from authorized overseas sponsors.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>Specialized UAE & Saudi Focus:</strong> In-depth knowledge of MOHRE (UAE) and Qiwa / Musaned (Saudi Arabia) work visa systems.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>Candidate Welfare:</strong> Ethical recruitment practices, transparent terms, and pre-departure support.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-brand-800 hover:text-brand-900 font-bold text-sm"
                >
                  <span>Learn more about our agency</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Why Candidates Choose Joy Manpower Solution
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-gold-400 flex items-center justify-center font-bold text-sm">
                      01
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Verified Sponsors</h4>
                    <p className="text-xs text-slate-600">
                      No middle sub-agents. Official job offer letters and company contracts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-gold-400 flex items-center justify-center font-bold text-sm">
                      02
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Trade Testing</h4>
                    <p className="text-xs text-slate-600">
                      Skill evaluation to match candidates with the right role and fair salary.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-gold-400 flex items-center justify-center font-bold text-sm">
                      03
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Visa Guidance</h4>
                    <p className="text-xs text-slate-600">
                      Step-by-step assistance for medical fitness, GAMCA, and visa stamping.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-gold-400 flex items-center justify-center font-bold text-sm">
                      04
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Safe Deployment</h4>
                    <p className="text-xs text-slate-600">
                      Pre-flight orientation, airport assistance, and sponsor reception coordination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR RECRUITMENT SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            Our Recruitment Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Comprehensive manpower recruitment solutions connecting employers with qualified candidates across UAE and Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:border-brand-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Manpower Sourcing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeted candidate sourcing from across India for technical, industrial, hospitality, and civil vacancies in Dubai and Saudi Arabia.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:border-brand-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Trade & Skill Testing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practical trade examinations and theoretical evaluations conducted in accredited workshop centers before candidate recommendation.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:border-brand-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Visa & Attestation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guidance through GAMCA medical fitness centers, apostille, MOFA document attestation, and Saudi / UAE embassy visa stamping.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:border-brand-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Deployment & Onboarding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive pre-departure orientation on Gulf labor laws, customs, safety standards, and employer reporting protocols.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW OUR RECRUITMENT PROCESS WORKS */}
      <section className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-gold-400 bg-brand-800 border border-brand-700 px-3 py-1 rounded-full">
              Transparent & Simple
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              How Our Recruitment Process Works
            </h2>
            <p className="text-sm text-slate-300">
              Four streamlined stages from initial resume submission to arriving at your overseas workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative bg-brand-800/80 rounded-xl p-6 border border-brand-700/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-slate-950 font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-base">Submit Resume</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse our UAE & Saudi Arabia job vacancies and submit your updated resume and trade details online.
              </p>
            </div>

            <div className="relative bg-brand-800/80 rounded-xl p-6 border border-brand-700/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-slate-950 font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-base">Screening & Interview</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Shortlisted profiles undergo technical trade review and direct interview with overseas company delegates.
              </p>
            </div>

            <div className="relative bg-brand-800/80 rounded-xl p-6 border border-brand-700/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-slate-950 font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-base">Offer & Visa Stamping</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive the official employment offer, complete GAMCA medical tests, and finalize visa stamping.
              </p>
            </div>

            <div className="relative bg-brand-800/80 rounded-xl p-6 border border-brand-700/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-slate-950 font-black flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-white text-base">Fly to Dubai / KSA</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive flight ticket, attend pre-departure briefing, and deploy to your sponsor in Dubai or Saudi Arabia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUICK CONTACT CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-brand-700">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Looking for Overseas Employment or Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our recruitment counselors are available to answer queries regarding vacancies, eligibility, and documentation for UAE and Saudi Arabia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20have%20an%20inquiry%20regarding%20overseas%20jobs."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              <span>WhatsApp Us Now</span>
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
