import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Briefcase, 
  Search, 
  Filter, 
  RotateCcw,
  Sparkles,
  MapPin
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

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCountry = searchParams.get('country') || 'All'

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState(initialCountry)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeJobForModal, setActiveJobForModal] = useState(null)

  useEffect(() => {
    const cParam = searchParams.get('country')
    if (cParam && ['UAE', 'Saudi Arabia'].includes(cParam)) {
      setCountryFilter(cParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchJobs()
  }, [countryFilter, categoryFilter])

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await jobService.getPublishedJobs({
      country: countryFilter,
      category: categoryFilter,
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
    setSearchQuery('')
    setSearchParams({})
  }

  const handleCountryChange = (c) => {
    setCountryFilter(c)
    if (c === 'All') {
      searchParams.delete('country')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ country: c })
    }
  }

  return (
    <div className="py-8 sm:py-12 space-y-6 sm:space-y-8 w-full">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-500 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-600/70 border border-primary-400 text-xs font-semibold text-secondary-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Gulf Vacancies</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Overseas Job Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-primary-100 leading-relaxed max-w-2xl">
              Explore open positions across <strong>Dubai (UAE)</strong> and <strong>Saudi Arabia</strong>. All vacancies are sponsored directly by verified employers with official visa processing.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-surface-border p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
          {/* Top Row: Country Filter Pills & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-surface-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-charcoal-800 uppercase tracking-wide">
                Destination:
              </span>
              <div className="inline-flex p-1 bg-surface-section rounded-xl border border-surface-border">
                <button
                  onClick={() => handleCountryChange('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    countryFilter === 'All'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-charcoal-800'
                  }`}
                >
                  All Countries
                </button>
                <button
                  onClick={() => handleCountryChange('UAE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    countryFilter === 'UAE'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-charcoal-800'
                  }`}
                >
                  <span>🇦🇪</span>
                  <span>UAE (Dubai)</span>
                </button>
                <button
                  onClick={() => handleCountryChange('Saudi Arabia')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    countryFilter === 'Saudi Arabia'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-charcoal-800'
                  }`}
                >
                  <span>🇸🇦</span>
                  <span>Saudi Arabia</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-charcoal-800 font-bold">{jobs.length}</strong> active published {jobs.length === 1 ? 'vacancy' : 'vacancies'}
            </div>
          </div>

          {/* Bottom Row: Search & Category Filter */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search job title, skills, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Buttons */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors active:scale-95"
              >
                Filter
              </button>
              {(countryFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset filters"
                  className="p-2.5 bg-surface-section hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Jobs Listing Grid (3 cols on large desktop, 2 on tablet, 1 on mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-surface-border p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onQuickApply={(j) => setActiveJobForModal(j)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-border p-10 sm:p-12 text-center max-w-lg mx-auto space-y-3 shadow-xs">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-500">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-charcoal-800">No matching vacancies found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any published job vacancies matching your current filters. Try selecting a different category or country, or reset the filters.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-section hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

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
