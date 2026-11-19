import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image, Filter, ShieldCheck, ArrowRight, X, ZoomIn, FileText, Phone, ExternalLink } from 'lucide-react'
import { galleryService } from '../services/galleryService'

export const Gallery = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeModalItem, setActiveModalItem] = useState(null)

  const categories = ['All', 'Client Interviews', 'Deployments', 'Trade Testing', 'Orientation']

  useEffect(() => {
    loadGallery()
  }, [selectedCategory])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const { data } = await galleryService.getAllGallery(selectedCategory)
      if (data) setItems(data)
    } catch (e) {
      console.warn('Failed to load gallery:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#F4F5F8] space-y-10 sm:space-y-14 pb-16">
      {/* Header Banner */}
      <section className="bg-[#26075D] text-white py-12 sm:py-16 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-black border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#FFC900]" />
            <span>Documented Recruitment Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Recruitment Activity & Drive Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Explore authentic recruitment announcements, trade test workshops, direct Gulf employer interview delegations, and verified deployment notifications for UAE and Saudi Arabia.
          </p>
        </div>
      </section>

      {/* Filter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#321078] text-[#FFC900] shadow-md'
                  : 'bg-white text-[#58617F] hover:text-[#26075D] border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Activities & Drives' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="bg-white rounded-3xl border border-[#DDD0F3] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#26075D]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26075D]/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-[#321078]/90 backdrop-blur-xs text-[#FFC900] text-[10px] sm:text-xs font-black border border-[#FFC900]/40 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Icon Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-black text-[#26075D] text-sm sm:text-base group-hover:text-[#5015A8] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="text-[#321078] font-bold group-hover:underline">Click to Expand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Image className="w-12 h-12 text-[#5015A8] mx-auto" />
            <h3 className="text-base font-bold text-[#26075D]">No Gallery Images Found</h3>
            <p className="text-xs text-slate-500">Check back soon for new recruitment drive announcements and photos.</p>
          </div>
        )}
      </section>

      {/* Modal Zoom Preview */}
      {activeModalItem && (
        <div 
          onClick={() => setActiveModalItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 border border-white/20"
          >
            <div className="relative bg-[#140233] max-h-[72vh] flex items-center justify-center overflow-hidden rounded-t-3xl">
              <img
                src={activeModalItem.image_url}
                alt={activeModalItem.title}
                className="max-h-[72vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 pt-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-0.5 rounded-full bg-[#F7F4FC] text-[#321078] text-xs font-black uppercase tracking-wider border border-[#DDD0F3]">
                  {activeModalItem.category}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to="/jobs"
                    onClick={() => setActiveModalItem(null)}
                    className="inline-flex items-center gap-1.5 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Apply for Overseas Jobs</span>
                  </Link>

                  <a
                    href="https://wa.me/919003380233?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20inquiring%20about%20the%20recruitment%20drive%20featured%20in%20your%20gallery."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#16B83D] hover:bg-[#139c34] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <span>WhatsApp Coordinator</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <h2 className="text-xl font-black text-[#26075D]">{activeModalItem.title}</h2>
              {activeModalItem.caption && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-[#F7F4FC] p-4 rounded-2xl border border-[#DDD0F3]">
                  {activeModalItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA to Apply */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#321078] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to attend our next overseas client interview drive?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Register your profile and trade specialization for upcoming Gulf recruitment delegations.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-7 py-3.5 rounded-xl shadow-md transition-colors shrink-0 text-xs sm:text-sm uppercase tracking-wider"
          >
            <span>Explore Jobs Now</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
