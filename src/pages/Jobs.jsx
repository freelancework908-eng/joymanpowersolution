import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Briefcase, 
  Search, 
  Filter, 
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldCheck
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { JobCard } from '../components/common/JobCard'
import { ApplyModal } from '../components/jobs/ApplyModal'

const CATEGORIES = [
  'All',
  'Facility Management',
  'Construction & Engineering',
  'Oil & Gas',
  'Hospitality & Catering',
  'Logistics & Transport',
  'Healthcare & Nursing',
  'Information Technology',
  'Retail & Sales'
]

const EXPERIENCES = ['All', 'Fresher', '1–2 Years', '3–5 Years', '5+ Years']

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCountry = searchParams.get('country') || 'All'
  const initialCategory = searchParams.get('category') || 'All'
  const initialExp = searchParams.get('experience') || 'All'

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState(initialCountry)
  const [categoryFilter, setCategoryFilter] = useState(initialCategory)
  const [experienceFilter, setExperienceFilter] = useState(initialExp)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeJobForModal, setActiveJobForModal] = useState(null)

  useEffect(() => {
    const cParam = searchParams.get('country')
    if (cParam) setCountryFilter(cParam.includes('UAE') ? 'UAE' : cParam)
    const catParam = searchParams.get('category')
    if (catParam) setCategoryFilter(catParam)
    const expParam = searchParams.get('experience')
    if (expParam) setExperienceFilter(expParam)
  }, [searchParams])

  useEffect(() => {
    fetchJobs()
  }, [countryFilter, categoryFilter, experienceFilter])

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await jobService.getPublishedJobs({
      country: countryFilter,
      category: categoryFilter,
      experience: experienceFilter,
      search: searchQuery
    })
    if (data) {
      setJobs(data)
    }
    setLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleResetFilters = () => {
    setCountryFilter('All')
    setCategoryFilter('All')
    setExperienceFilter('All')
    setSearchQuery('')
    setSearchParams({})
  }

  const uaeCount = jobs.filter((j) => j.country === 'UAE').length
  const saudiCount = jobs.filter((j) => j.country === 'Saudi Arabia').length

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 w-full bg-white">
      {/* Header Banner */}
      <section className="bg-[#26075D] text-white py-12 sm:py-16 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-black border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#FFC900]" />
            <span>Verified Gulf Corporate Vacancies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Foreign Job Vacancies: Saudi Arabia & Dubai
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Explore authentic overseas opportunities with direct company sponsorship, pre-departure briefings, and transparent terms.
          </p>

          <div className="pt-2 flex items-center gap-6 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="font-extrabold text-white text-base">🇦🇪 {uaeCount}</span> Dubai & UAE Jobs
            </div>
            <div>
              <span className="font-extrabold text-white text-base">🇸🇦 {saudiCount}</span> Saudi Arabia Jobs
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter and Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#F7F4FC] p-4 sm:p-5 rounded-2xl border border-[#DDD0F3] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#DDD0F3] shrink-0">
              {['All', 'Saudi Arabia', 'UAE'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    countryFilter === c
                      ? 'bg-[#321078] text-[#FFC900] shadow-sm'
                      : 'text-[#58617F] hover:text-[#26075D]'
                  }`}
                >
                  {c === 'All' ? 'All Countries' : c === 'UAE' ? '🇦🇪 UAE (Dubai)' : '🇸🇦 Saudi Arabia'}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title, role, trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-[#DDD0F3] text-xs sm:text-sm text-[#252039] bg-white focus:outline-none focus:border-[#321078]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#321078] text-[#FFC900] text-xs font-bold rounded-lg hover:bg-[#5015A8]"
              >
                Search
              </button>
            </form>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DDD0F3] text-xs font-bold text-[#252039] bg-white focus:outline-none focus:border-[#321078]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {(countryFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  title="Reset Filters"
                  className="p-2 rounded-xl text-slate-500 hover:text-[#321078] bg-white border border-[#DDD0F3]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-[#E9EBF0] p-6 space-y-4 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-7 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {jobs.map((job) => (
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
              <h3 className="text-lg font-bold text-[#26075D]">No Openings Found</h3>
              <p className="text-xs sm:text-sm text-[#58617F] max-w-sm mx-auto">
                No vacancies currently match your search criteria. Please adjust your filters or reset.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#321078] text-[#FFC900] font-bold text-xs shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
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
