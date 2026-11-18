import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  RotateCcw,
  Sparkles,
  Users
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
    // If URL has query param for country, update filter
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
    <div className="py-10 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800 text-xs font-semibold text-gold-400 border border-brand-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Gulf Openings Only</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Overseas Job Vacancies
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Browse current verified openings in <strong>Dubai (UAE)</strong> and <strong>Saudi Arabia</strong>. All vacancies offer direct employer visas, competitive monthly remuneration, and standard Gulf benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          {/* Top Row: Country Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Destination:
              </span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleCountryChange('All')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    countryFilter === 'All'
                      ? 'bg-brand-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Countries
                </button>
                <button
                  onClick={() => handleCountryChange('UAE')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    countryFilter === 'UAE'
                      ? 'bg-brand-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇦🇪</span>
                  <span>UAE (Dubai)</span>
                </button>
                <button
                  onClick={() => handleCountryChange('Saudi Arabia')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    countryFilter === 'Saudi Arabia'
                      ? 'bg-brand-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇸🇦</span>
                  <span>Saudi Arabia</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{jobs.length}</strong> active published {jobs.length === 1 ? 'vacancy' : 'vacancies'}
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-700 focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit / Search Button */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                Filter
              </button>
              {(countryFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset filters"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Jobs Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse">
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
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-800">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching vacancies found</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We couldn't find any published job vacancies matching your current filters. Try selecting a different category or country, or reset the filters.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
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
