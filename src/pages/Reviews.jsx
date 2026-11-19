import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Video, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react'
import { reviewService } from '../services/reviewService'
import { ReviewVideoCard } from '../components/common/ReviewShorts'

export const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [activeVideoId, setActiveVideoId] = useState(null)

  useEffect(() => {
    loadAllReviews()
  }, [countryFilter, categoryFilter])

  const loadAllReviews = async () => {
    try {
      setLoading(true)
      const { data } = await reviewService.getPublishedReviews({
        country: countryFilter,
        category: categoryFilter
      })
      if (data) setReviews(data)
    } catch (err) {
      console.warn('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const uaeCount = reviews.filter((r) => r.country === 'UAE').length
  const saudiCount = reviews.filter((r) => r.country === 'Saudi Arabia').length

  const categories = [
    'All',
    'Facility Management',
    'Construction & Engineering',
    'Oil & Gas',
    'Logistics & Transport',
    'Hospitality & Catering'
  ]

  return (
    <div className="w-full bg-[#F4F5F8] pb-16">
      {/* Header Banner */}
      <section className="bg-[#26075D] text-white py-12 sm:py-16 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#FFC900] text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-[#FFC900]" />
            <span>Documented Candidate Testimonials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Success Stories & Candidate Reviews
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Listen directly to Indian technicians, operators, and engineering personnel who secured direct corporate sponsor visas for the United Arab Emirates and Saudi Arabia through Joy Manpower Solution.
          </p>

          <div className="pt-2 flex items-center gap-6 text-xs sm:text-sm text-slate-300 font-bold">
            <div>
              <span className="text-[#FFC900] text-base font-black">🇦🇪 {uaeCount}</span> UAE Stories
            </div>
            <div>
              <span className="text-[#FFC900] text-base font-black">🇸🇦 {saudiCount}</span> Saudi Arabia Stories
            </div>
          </div>
        </div>
      </section>

      {/* Filter Strip */}
      <section className="bg-white border-b border-slate-200 py-4 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Country Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F7F4FC] rounded-xl border border-[#DDD0F3] shrink-0">
            {['All', 'UAE', 'Saudi Arabia'].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  countryFilter === c
                    ? 'bg-[#321078] text-[#FFC900] shadow-sm'
                    : 'text-[#58617F] hover:text-[#26075D]'
                }`}
              >
                {c === 'All' ? 'All Countries' : c === 'UAE' ? '🇦🇪 UAE – Dubai' : '🇸🇦 Saudi Arabia'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-600 shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-[#26075D] focus:outline-none focus:ring-2 focus:ring-[#321078]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[9/16] bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => {
              const isPlaying = activeVideoId === review.id
              return (
                <div key={review.id} className="w-full">
                  <ReviewVideoCard
                    review={review}
                    isPlaying={isPlaying}
                    onPlay={() => setActiveVideoId(review.id)}
                    onStop={() => setActiveVideoId(null)}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <Video className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-black text-[#26075D]">No Reviews Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              There are currently no published testimonials matching your filter. Please adjust your country or category selection.
            </p>
          </div>
        )}

        {/* Bottom CTA to Apply */}
        <div className="bg-[#321078] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to write your own overseas success story?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Apply for verified vacancies across Dubai and Saudi Arabia with zero hidden charges.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-7 py-3.5 rounded-xl shadow-md transition-colors shrink-0 text-xs sm:text-sm uppercase tracking-wider"
          >
            <span>Explore Open Vacancies</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
