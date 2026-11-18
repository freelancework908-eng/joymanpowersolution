import React, { useState } from 'react'
import { getActiveSocialLinks } from '../../config/socialLinks'
import { MessageSquare, X, Share2 } from 'lucide-react'

// Authentic, high-precision SVG icons for each social brand
const SocialIcon = ({ id, className = "w-5 h-5" }) => {
  switch (id) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.3-.777.979-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.3-.019-.462.132-.612.136-.135.301-.35.452-.526.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.526-.075-.15-.676-1.63-.927-2.234-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.375-.276.3-1.053 1.028-1.053 2.508 0 1.48 1.078 2.908 1.229 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.03-1.43.251-.702.251-1.303.176-1.43-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.174L2 22l4.982-1.402A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.1c-1.65 0-3.19-.504-4.48-1.368l-.321-.214-2.96.833.849-2.887-.234-.336A8.067 8.067 0 013.9 12c0-4.467 3.633-8.1 8.1-8.1s8.1 3.633 8.1 8.1-3.633 8.1-8.1 8.1z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    default:
      return <Share2 className={className} />
  }
}

export const FloatingSocialLinks = () => {
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const activeLinks = getActiveSocialLinks()

  if (activeLinks.length === 0) return null

  const whatsappLink = activeLinks.find((l) => l.id === 'whatsapp')

  return (
    <>
      {/* ========================================================
          1. DESKTOP VIEW: Fixed Vertical Toolbar on the Right
          Centered vertically (~50% from top) with smooth tooltips
         ======================================================== */}
      <aside
        aria-label="Social Media Quick Links"
        className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200/90 transition-all duration-300"
      >
        <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400 rotate-180 [writing-mode:vertical-rl] py-1 select-none">
          Connect
        </div>

        {activeLinks.map((link) => {
          const isWhatsApp = link.id === 'whatsapp'

          return (
            <div key={link.id} className="relative group flex items-center justify-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 transform group-hover:scale-110 shadow-sm ${
                  isWhatsApp
                    ? 'bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-[#25D366]/30 ring-2 ring-[#25D366]/20'
                    : 'bg-slate-50 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent'
                }`}
                style={
                  !isWhatsApp
                    ? {
                        '--hover-bg': link.brandColor,
                      }
                    : undefined
                }
                onMouseEnter={(e) => {
                  if (!isWhatsApp) e.currentTarget.style.backgroundColor = link.brandColor
                }}
                onMouseLeave={(e) => {
                  if (!isWhatsApp) e.currentTarget.style.backgroundColor = ''
                }}
              >
                <SocialIcon id={link.id} className={isWhatsApp ? "w-6 h-6" : "w-5 h-5"} />
              </a>

              {/* Tooltip positioned to the left */}
              <div
                role="tooltip"
                className="absolute right-14 px-3 py-1.5 bg-charcoal-800 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 -translate-x-1 group-hover:translate-x-0 z-50 flex items-center gap-1.5"
              >
                <span>{link.tooltip}</span>
                <span className="w-1.5 h-1.5 bg-charcoal-800 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></span>
              </div>
            </div>
          )
        })}
      </aside>

      {/* ========================================================
          2. MOBILE VIEW: Safe Bottom-Right Compact Toolbar
          Positioned above bottom navigation / safe-area.
          Expandable so it DOES NOT cover forms or Apply buttons.
         ======================================================== */}
      <div
        className="md:hidden fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2"
        aria-label="Mobile Social Media Links"
      >
        {/* Expanded Links Drawer (animated upward) */}
        {mobileExpanded && (
          <div className="flex flex-col items-end gap-2.5 mb-1 animate-fadeIn">
            {activeLinks.map((link) => {
              const isWhatsApp = link.id === 'whatsapp'

              return (
                <div key={link.id} className="flex items-center gap-2">
                  <span className="bg-charcoal-800/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md">
                    {link.name}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: link.brandColor }}
                  >
                    <SocialIcon id={link.id} className="w-5 h-5" />
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {/* Primary Floating Action Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Direct WhatsApp Button if collapsed */}
          {!mobileExpanded && whatsappLink && (
            <a
              href={whatsappLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsappLink.ariaLabel}
              className="h-11 px-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-all ring-2 ring-white"
            >
              <SocialIcon id="whatsapp" className="w-5 h-5 text-white" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Expand/Collapse Social Menu Button */}
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            aria-label={mobileExpanded ? 'Close social links menu' : 'Open social links menu'}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 border-2 border-white ${
              mobileExpanded
                ? 'bg-charcoal-800 text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {mobileExpanded ? (
              <X className="w-5 h-5" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
