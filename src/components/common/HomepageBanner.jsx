import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  Globe2 
} from 'lucide-react'
import { bannerService } from '../../services/bannerService'
import { initialBanner } from '../../data/initialBanner'

export const HomepageBanner = ({ uaeCount = 0, saudiCount = 0 }) => {
  const [banner, setBanner] = useState(initialBanner)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = async () => {
    try {
      setLoading(true)
      const { data } = await bannerService.getActiveBanner()
      if (data && data.is_active && data.image_url) {
        setBanner(data)
      } else {
        setBanner(initialBanner)
      }
    } catch (err) {
      console.warn('Failed to load dynamic banner, using initial:', err)
      setBanner(initialBanner)
    } finally {
      setLoading(false)
    }
  }

  const subHeading = banner?.sub_heading || initialBanner.sub_heading
  const heading = banner?.heading || initialBanner.heading
  const description = banner?.description || initialBanner.description
  const benefit1 = banner?.benefit1 || initialBanner.benefit1
  const benefit2 = banner?.benefit2 || initialBanner.benefit2
  const benefit3 = banner?.benefit3 || initialBanner.benefit3
  const buttonText = banner?.button_text || initialBanner.button_text
  const buttonLink = banner?.button_link || initialBanner.button_link
  const imageUrl = banner?.image_url || initialBanner.image_url
  const mobileImageUrl = banner?.mobile_image_url || imageUrl

  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[560px] flex items-center bg-[#1A063E] border-b border-[#E9EBF0] overflow-hidden">
      {/* ========================================================
          1. FULL BACKGROUND IMAGE
         ======================================================== */}
      <picture className="absolute inset-0 w-full h-full">
        {mobileImageUrl && (
          <source media="(max-width: 640px)" srcSet={mobileImageUrl} />
        )}
        <img
          src={imageUrl}
          alt={heading || 'Overseas Recruitment Saudi Arabia & Dubai'}
          className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out"
          loading="eager"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/gallery/jms-recruitment-reference.jpg';
          }}
        />
      </picture>

      {/* ========================================================
          2. HIGH-CONTRAST GRADIENT OVERLAY
          (Deep gradient on the left corner ensures small text is sharp
           and clear; fades across so background image stays prominent)
         ======================================================== */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#180738]/95 via-[#26075D]/85 md:via-[#26075D]/65 to-[#26075D]/25 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#180738]/90 via-transparent to-transparent sm:hidden z-10" />
      <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />

      {/* ========================================================
          3. TEXT IN SMALL SIZE IN LEFT CORNER
         ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="max-w-md sm:max-w-lg text-left space-y-3.5 sm:space-y-4">
          {/* Small Heading Badge */}
          {subHeading && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC900] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFC900]">
                {subHeading}
              </span>
            </div>
          )}

          {/* Compact Main Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
            Overseas Careers in <br className="hidden sm:inline" />
            <span className="text-[#FFC900] relative inline-block">
              {heading}
              {/* Subtle underline accent */}
              <span className="absolute bottom-0.5 left-0 w-full h-1 bg-[#FFC900]/40 -z-10 rounded" />
            </span>
          </h1>

          {/* Small-sized Recruitment Description */}
          {description && (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-md drop-shadow-xs">
              {description}
            </p>
          )}

          {/* Small Benefit Bullet Points */}
          <div className="space-y-1.5 pt-1">
            {benefit1 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span className="text-xs text-white/95 font-medium">{benefit1}</span>
              </div>
            )}
            {benefit2 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span className="text-xs text-white/95 font-medium">{benefit2}</span>
              </div>
            )}
            {benefit3 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span className="text-xs text-white/95 font-medium">{benefit3}</span>
              </div>
            )}
          </div>

          {/* Small-sized Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to={buttonLink}
              className="inline-flex items-center justify-center gap-1.5 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/25 backdrop-blur-xs transition-colors text-xs sm:text-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#FFC900]" />
              <span>Browse All Jobs</span>
            </Link>
          </div>

          {/* Small Bottom Info Line */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-300">
            <div className="inline-flex items-center gap-1 text-[#FFC900] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Sponsors</span>
            </div>
            <span>•</span>
            <span>🇦🇪 UAE (Dubai)</span>
            <span>•</span>
            <span>🇸🇦 Saudi Arabia</span>
          </div>
        </div>
      </div>
    </section>
  )
}
