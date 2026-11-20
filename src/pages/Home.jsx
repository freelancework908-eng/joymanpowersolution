import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  PhoneCall,
  Search,
  ExternalLink,
  MessageCircle
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { JobCard } from '../components/common/JobCard'
import { ApplyModal } from '../components/jobs/ApplyModal'
import { HomepageBanner } from '../components/common/HomepageBanner'
import { JobSearchBar } from '../components/common/JobSearchBar'
import { ServicesStrip } from '../components/common/ServicesStrip'
import { CountrySections } from '../components/common/CountrySections'
import { ProcessSection } from '../components/common/ProcessSection'
import { ReviewShorts } from '../components/common/ReviewShorts'
import { useSettings } from '../context/SettingsContext'
import { initialJobs } from '../data/initialJobs'

export const Home = () => {
  const [jobs, setJobs] = useState(initialJobs)
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [activeJobForModal, setActiveJobForModal] = useState(null)
  const { settings } = useSettings()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const { data } = await jobService.getPublishedJobs()
      if (data && Array.isArray(data)) {
        setJobs(data)
      } else {
        setJobs(initialJobs)
      }
    } catch (e) {
      console.warn('Failed to load published jobs, using fallback:', e)
      setJobs(initialJobs)
    } finally {
      setLoading(false)
    }
  }

  const safeJobs = Array.isArray(jobs) && jobs.length > 0 ? jobs : initialJobs
  const uaeCount = safeJobs.filter((j) => j.country === 'UAE').length
  const saudiCount = safeJobs.filter((j) => j.country === 'Saudi Arabia').length

  const filteredJobs = safeJobs.filter((j) => {
    if (selectedCountry === 'All') return true
    return j.country === selectedCountry
  }).slice(0, 6)

  const cleanWhatsapp = (settings?.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Joy Manpower Solution, I am inquiring about overseas job vacancies.')}`
    : '#'

  return (
    <div className="w-full bg-white">
      {/* ========================================================
          1. HERO BANNER (Full Background Image with Left Corner Small Text)
         ======================================================== */}
      <HomepageBanner uaeCount={uaeCount} saudiCount={saudiCount} />

      {/* ========================================================
          2. ROUNDED JOB SEARCH BAR (Immediately below banner)
         ======================================================== */}
      <JobSearchBar />

      {/* ========================================================
          3. RECRUITMENT SERVICES STRIP (5 Circular Purple Icons)
         ======================================================== */}
      <ServicesStrip />

      {/* ========================================================
          4. COUNTRY JOB SECTIONS (3 Cards: Saudi Arabia, Dubai, Why Choose Us)
         ======================================================== */}
      <CountrySections uaeCount={uaeCount} saudiCount={saudiCount} />

      {/* ========================================================
          5. LATEST JOB OPENINGS (Real Database Vacancies)
         ======================================================== */}
      <section className="bg-white py-14 sm:py-20 border-b border-[#E9EBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#321078] bg-[#F7F4FC] border border-[#DDD0F3] px-3.5 py-1 rounded-full inline-block">
                Current Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#26075D] mt-2">
                Latest Foreign Job Openings
              </h2>
              <p className="text-xs sm:text-sm text-[#58617F] mt-1">
                Verified Gulf corporate employers with authorized work visa processing.
              </p>
            </div>

            {/* Destination Filter Tabs */}
            <div className="inline-flex p-1 bg-[#F7F4FC] rounded-2xl border border-[#DDD0F3] shrink-0 self-start md:self-auto">
              {['All', 'Saudi Arabia', 'UAE'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedCountry === c
                      ? 'bg-[#321078] text-[#FFC900] shadow-sm'
                      : 'text-[#58617F] hover:text-[#26075D]'
                  }`}
                >
                  {c === 'All' ? 'All Jobs' : c === 'UAE' ? '🇦🇪 Dubai (UAE)' : '🇸🇦 Saudi Arabia'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#F7F4FC] rounded-3xl border border-[#E9EBF0] p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onQuickApply={(j) => setActiveJobForModal(j)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#F7F4FC] rounded-3xl border border-[#DDD0F3] p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-[#5015A8] mx-auto" />
              <h3 className="text-base font-bold text-[#26075D]">No Openings Found</h3>
              <p className="text-xs text-[#58617F] max-w-sm mx-auto">
                No active vacancies match your destination selection. Please explore all vacancies or check back soon.
              </p>
            </div>
          )}

          {/* View All Jobs Yellow CTA Button */}
          <div className="mt-12 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider"
            >
              <span>View All Available Vacancies</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. RECRUITMENT PROCESS (5 Clear Steps)
         ======================================================== */}
      <ProcessSection />

      {/* ========================================================
          7. CANDIDATE SUCCESS STORIES (Video Testimonials Shorts)
         ======================================================== */}
      <ReviewShorts />

      {/* ========================================================
          8. WHATSAPP & DIRECT CONSULTATION STRIP
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-[#321078] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Consultations Available</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Have Questions About Gulf Employment or Visas?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Our counselors guide you directly through trade skill testing, document attestation, and client interview scheduling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto relative z-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16B83D] hover:bg-[#139C34] text-white font-black text-xs sm:text-sm px-7 py-3.5 rounded-full transition-transform shadow-lg active:scale-95 uppercase tracking-wide"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Us Now</span>
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm px-7 py-3.5 rounded-full transition-colors shadow-lg uppercase tracking-wide"
            >
              <span>Contact Page</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Candidate Quick Apply Modal */}
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
