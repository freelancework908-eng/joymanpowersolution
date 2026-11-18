import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Briefcase, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react'
import { socialConfig } from '../../config/socialLinks'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Contact Us', path: '/contact' }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs border-b border-[#E5E7EB]">
      {/* Top Header Bar in Deep Teal #087F8C */}
      <div className="bg-[#087F8C] text-white text-xs py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left Specialization & Contacts */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#EDF9F3] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#20A66A] bg-white rounded-full" />
              <span className="truncate">Specialized Overseas Recruitment: <strong>UAE (Dubai)</strong> & <strong>Saudi Arabia</strong></span>
            </span>

            <a 
              href="tel:+919876543210" 
              className="hidden md:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#AEE6C8]" />
              <span>+91 98765 43210</span>
            </a>

            <a 
              href="mailto:info@joymanpowersolution.com" 
              className="hidden lg:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-[#AEE6C8]" />
              <span>info@joymanpowersolution.com</span>
            </a>
          </div>

          {/* Right WhatsApp & Admin Link */}
          <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
            <a
              href={socialConfig.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#087F8C] bg-white hover:bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold transition-colors text-xs shadow-xs"
            >
              <span>WhatsApp Chat</span>
              <ExternalLink className="w-3 h-3 text-[#20A66A]" />
            </a>

            <span className="text-white/40">|</span>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-white/90 hover:text-white transition-colors text-[11px] bg-[#065A64] hover:bg-[#054850] px-2 py-0.5 rounded"
              title="Admin Staff Login"
            >
              <Lock className="w-3 h-3 text-[#AEE6C8]" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Modern Deep Teal & Fresh Green */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#087F8C] border border-[#065A64] flex items-center justify-center shadow-xs group-hover:bg-[#076F7B] transition-colors">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                J<span className="text-[#20A66A]">MS</span>
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#202B33] tracking-tight leading-tight flex items-center gap-1">
                <span>JOY MANPOWER</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#087F8C] uppercase">
                Overseas Job Consultancy
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-[#087F8C] bg-[#F0F9FA] font-bold border border-[#B2E3E8]'
                    : 'text-[#64748B] hover:text-[#087F8C] hover:bg-[#F5F8F9]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Explore Jobs CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#087F8C] hover:bg-[#076F7B] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all duration-150 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-white" />
              <span>Explore Jobs</span>
            </Link>
          </div>

          {/* Mobile Actions: Jobs button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/jobs"
              className="bg-[#087F8C] text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              Jobs
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#202B33] hover:text-[#087F8C] hover:bg-[#F5F8F9] focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-[#F0F9FA] text-[#087F8C] border border-[#B2E3E8] font-bold'
                  : 'text-[#202B33] hover:bg-[#F5F8F9]'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
            </Link>
          ))}

          <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#087F8C] hover:bg-[#076F7B] text-white font-bold py-3 rounded-xl shadow-xs"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse All Vacancies</span>
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#F5F8F9] hover:bg-slate-200 text-[#202B33] font-medium py-2.5 rounded-xl text-xs border border-[#E5E7EB]"
            >
              <Lock className="w-3.5 h-3.5 text-[#087F8C]" />
              <span>Admin Staff Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
