import React, { useState } from 'react'
import { MessageCircle, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export const FloatingSocialLinks = () => {
  const { settings } = useSettings()
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const cleanWhatsapp = (settings?.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Joy Manpower Solution, I am inquiring about overseas job vacancies.')}`
    : '#'

  const socialItems = [
    {
      id: 'facebook',
      name: 'Facebook',
      url: settings?.facebook_url,
      letter: 'f',
      ariaLabel: 'Visit Joy Manpower Solution on Facebook'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: settings?.youtube_url,
      letter: 'yt',
      ariaLabel: 'Watch Joy Manpower Solution on YouTube'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: settings?.linkedin_url,
      letter: 'in',
      ariaLabel: 'Connect with Joy Manpower Solution on LinkedIn'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: settings?.instagram_url,
      letter: 'ig',
      ariaLabel: 'Follow Joy Manpower Solution on Instagram'
    }
  ].filter((s) => Boolean(s.url && s.url.trim()))

  return (
    <>
      {/* ========================================================
          1. DESKTOP: Fixed Vertical Toolbar on the Right Side
             Purple Circular Icons with Tooltips + Green WhatsApp
         ======================================================== */}
      <aside
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 p-2 bg-[#26075D]/90 backdrop-blur-md rounded-l-2xl shadow-2xl border-l border-y border-[#3E0F87]"
        aria-label="Social media quick links"
      >
        {/* WhatsApp Icon */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat with Us on WhatsApp"
          className="w-10 h-10 rounded-full bg-[#16B83D] hover:bg-[#139C34] text-white flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 active:scale-95 group relative"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-[#26075D] text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-[#3E0F87]">
            WhatsApp Us
          </span>
        </a>

        {/* Social Network Icons */}
        {socialItems.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            title={social.name}
            className="w-9 h-9 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs shadow-md transition-all transform hover:scale-110 active:scale-95 group relative border border-white/20"
          >
            <span>{social.letter}</span>
            <span className="absolute right-full mr-3 px-2.5 py-1 bg-[#26075D] text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-[#3E0F87]">
              {social.name}
            </span>
          </a>
        ))}
      </aside>

      {/* ========================================================
          2. PROMINENT FLOATING WHATSAPP BUTTON (Bottom-Right)
             Matches the reference image with pulsating indicator
         ======================================================== */}
      <div className="fixed bottom-6 right-5 z-40 flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#16B83D] hover:bg-[#139C34] text-white font-extrabold px-4 py-3 rounded-full shadow-2xl hover:shadow-green-500/40 transition-all transform hover:scale-105 active:scale-95 group"
          aria-label="Chat with Us on WhatsApp"
        >
          <span className="relative flex items-center justify-center">
            <span className="absolute w-full h-full rounded-full bg-white/40 animate-ping opacity-75" />
            <MessageCircle className="w-6 h-6 fill-white" />
          </span>
          <span className="hidden sm:inline text-xs sm:text-sm font-black tracking-wide">
            Chat with Us on WhatsApp
          </span>
        </a>
      </div>

      {/* ========================================================
          3. MOBILE: Compact floating expandable button
         ======================================================== */}
      <div className="md:hidden fixed bottom-20 right-5 z-30 flex flex-col items-end gap-2">
        {mobileExpanded && (
          <div className="flex flex-col gap-2 p-2 bg-[#26075D] rounded-2xl shadow-2xl border border-[#3E0F87] animate-fadeIn">
            {socialItems.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="w-9 h-9 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs shadow-md"
              >
                {social.letter}
              </a>
            ))}
          </div>
        )}

        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-10 h-10 rounded-full bg-[#321078] text-[#FFC900] flex items-center justify-center shadow-lg border border-[#DDD0F3]"
          aria-label="Toggle Social Links"
        >
          {mobileExpanded ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </>
  )
}
