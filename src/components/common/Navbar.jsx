import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ArrowRight,
  MessageCircle,
  Briefcase
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { settings } = useSettings()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Foreign Jobs', path: '/jobs' },
    { name: 'Our Services', path: '/#services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/reviews' },
    { name: 'Contact Us', path: '/contact' }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return false
    return location.pathname.startsWith(path)
  }

  const cleanWhatsappNumber = (settings?.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanWhatsappNumber
    ? `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('Hello Joy Manpower Solution, I am inquiring about overseas job vacancies.')}`
    : '#'

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* ========================================================
          A. TOP CONTACT BAR: Deep Purple #26075D / #321078
         ======================================================== */}
      <div className="bg-[#26075D] text-white text-xs py-2 px-3 sm:px-6 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left Contact Items */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-[11px] sm:text-xs">
            {settings?.phone && (
              <a 
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-1.5 text-slate-200 hover:text-[#FFC900] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span className="font-medium">{settings.phone}</span>
              </a>
            )}

            {settings?.whatsapp && (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xs:flex items-center gap-1.5 text-slate-200 hover:text-[#16B83D] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#16B83D] shrink-0" />
                <span className="font-medium">WhatsApp: {settings.whatsapp_display || settings.whatsapp}</span>
              </a>
            )}

            {settings?.email && (
              <a 
                href={`mailto:${settings.email}`}
                className="hidden md:flex items-center gap-1.5 text-slate-200 hover:text-[#FFC900] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span className="font-medium">{settings.email}</span>
              </a>
            )}

            {settings?.location && (
              <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                <span>{settings.location}</span>
              </div>
            )}
          </div>

          {/* Right Follow Us Social Media Icons */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0 text-[11px]">
            <span className="text-slate-300 hidden sm:inline font-medium">Follow Us:</span>
            <div className="flex items-center gap-1.5">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center transition-colors font-bold text-[10px]"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  f
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center transition-colors font-bold text-[10px]"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  yt
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center transition-colors font-bold text-[10px]"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  in
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center transition-colors font-bold text-[10px]"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  ig
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          B. MAIN NAVIGATION: Crisp White Background
         ======================================================== */}
      <nav className="bg-white border-b border-[#E9EBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Joy Manpower Solution Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              {/* Emblem / Logo from B2 */}
              {settings?.logo_url ? (
                <div className="h-12 w-12 rounded-xl bg-white border border-[#DDD0F3] p-1 flex items-center justify-center shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src={settings.logo_url}
                    alt={settings.company_name || 'Joy Manpower Solution'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#321078] border-2 border-[#FFC900] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-xl font-black text-[#FFC900] tracking-tighter">
                    J<span className="text-white">MS</span>
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-[#26075D] tracking-tight leading-tight">
                  {settings?.company_name || 'JOY MANPOWER SOLUTION'}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#5015A8] font-bold uppercase tracking-wider">
                  Overseas Recruitment Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-semibold transition-colors duration-150 py-1 border-b-2 ${
                      active
                        ? 'text-[#321078] border-[#FFC900] font-bold'
                        : 'text-[#252039] border-transparent hover:text-[#321078]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Right: Apply Now Yellow CTA Button */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-extrabold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-150 active:scale-95 text-xs sm:text-sm uppercase tracking-wide"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                to="/jobs"
                className="sm:hidden inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FFC900] text-[#26075D] text-xs font-black shadow-xs"
              >
                Apply
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#26075D] hover:bg-[#F7F4FC] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E9EBF0] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#F7F4FC] text-[#321078] font-bold border-l-4 border-[#321078]'
                        : 'text-[#252039] hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-2">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black py-3 rounded-xl shadow-md text-sm uppercase tracking-wider"
              >
                <span>Apply For Gulf Jobs</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>

            {/* Mobile Contact Quick Links */}
            <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              {settings?.phone && (
                <div className="flex items-center gap-2 py-1">
                  <Phone className="w-3.5 h-3.5 text-[#321078]" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-1 text-[#16B83D] font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#16B83D]" />
                  <span>WhatsApp: {settings.whatsapp_display || settings.whatsapp}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
