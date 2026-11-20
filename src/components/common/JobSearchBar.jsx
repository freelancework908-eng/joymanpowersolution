import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, Award, ChevronDown } from 'lucide-react'
import { jobService, ALL_DEFAULT_CATEGORIES } from '../../services/jobService'

export const JobSearchBar = ({ initialFilters = {}, onSearch = null }) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(ALL_DEFAULT_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All')
  const [selectedCountry, setSelectedCountry] = useState(initialFilters.country || 'All')
  const [selectedExperience, setSelectedExperience] = useState(initialFilters.experience || 'All')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await jobService.getCategories()
      if (cats && cats.length > 0) {
        setCategories(cats)
      } else {
        setCategories(ALL_DEFAULT_CATEGORIES)
      }
    } catch {
      setCategories(ALL_DEFAULT_CATEGORIES)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory)
    }
    if (selectedCountry && selectedCountry !== 'All') {
      params.set('country', selectedCountry)
    }
    if (selectedExperience && selectedExperience !== 'All') {
      params.set('experience', selectedExperience)
    }

    if (onSearch) {
      onSearch({
        category: selectedCategory,
        country: selectedCountry,
        experience: selectedExperience
      })
    } else {
      navigate(`/jobs?${params.toString()}`)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-[#DDD0F3] p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center"
      >
        {/* 1. Job Category Field */}
        <div className="md:col-span-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#E9EBF0] focus-within:border-[#321078] transition-colors">
          <Briefcase className="w-5 h-5 text-[#321078] shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-extrabold text-[#5015A8] tracking-wider leading-none mb-1">
              Job Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#252039] focus:outline-none cursor-pointer truncate"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Country Field */}
        <div className="md:col-span-3 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#E9EBF0] focus-within:border-[#321078] transition-colors">
          <MapPin className="w-5 h-5 text-[#321078] shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-extrabold text-[#5015A8] tracking-wider leading-none mb-1">
              Country / Destination
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#252039] focus:outline-none cursor-pointer"
            >
              <option value="All">All Destinations</option>
              <option value="UAE">🇦🇪 UAE – Dubai</option>
              <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
            </select>
          </div>
        </div>

        {/* 3. Experience Level Field */}
        <div className="md:col-span-3 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#E9EBF0] focus-within:border-[#321078] transition-colors">
          <Award className="w-5 h-5 text-[#321078] shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-extrabold text-[#5015A8] tracking-wider leading-none mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#252039] focus:outline-none cursor-pointer"
            >
              <option value="All">All Experience Levels</option>
              <option value="Fresher">Fresher (0–1 Year)</option>
              <option value="1–2 Years">1–2 Years</option>
              <option value="3–5 Years">3–5 Years</option>
              <option value="5+ Years">5+ Years (Gulf Preferred)</option>
            </select>
          </div>
        </div>

        {/* 4. Search Jobs Button: Bright Highlight Yellow #FFC900 */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>Search Jobs</span>
          </button>
        </div>
      </form>
    </div>
  )
}
