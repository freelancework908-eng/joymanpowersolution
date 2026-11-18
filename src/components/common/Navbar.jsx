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
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs border-b border-surface-border">
      {/* Top Header Information Bar */}
      <div className="bg-charcoal-800 text-white text-xs py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left Specialization & Contacts */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-secondary-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-secondary-400" />
              <span className="truncate">Specialized Overseas Recruitment: <strong>UAE (Dubai)</strong> & <strong>Saudi Arabia</strong></span>
            </span>

            <a 
              href="tel:+919876543210" 
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-primary-300" />
              <span>+91 98765 43210</span>
            </a>

            <a 
              href="mailto:info@joymanpowersolution.com" 
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-primary-300" />
              <span>info@joymanpowersolution.com</span>
            </a>
          </div>

          {/* Right WhatsApp & Admin Link */}
          <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
            <a
              href={socialConfig.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary-400 hover:text-secondary-300 font-semibold transition-colors text-xs"
            >
              <span>WhatsApp Chat</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <span className="text-slate-600">|</span>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-[11px] bg-charcoal-700/80 hover:bg-charcoal-700 px-2 py-0.5 rounded"
              title="Admin Staff Login"
            >
              <Lock className="w-3 h-3 text-primary-300" />
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
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-500 border border-primary-600 flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                J<span className="text-secondary-300">MS</span>
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-charcoal-800 tracking-tight leading-tight flex items-center gap-1">
                <span>JOY MANPOWER</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-primary-600 uppercase">
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
                    ? 'text-primary-700 bg-primary-50/80 font-bold border border-primary-100'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-surface-section'
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
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-white" />
              <span>Explore Jobs</span>
            </Link>
          </div>

          {/* Mobile Actions: Jobs button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/jobs"
              className="bg-primary-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              Jobs
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-800 hover:text-primary-600 hover:bg-surface-section focus:outline-none"
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
        <div className="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700 border border-primary-100'
                  : 'text-charcoal-800 hover:bg-surface-section'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}

          <div className="pt-3 border-t border-surface-border space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl shadow-xs"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse All Vacancies</span>
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-surface-section hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl text-xs"
            >
              <Lock className="w-3.5 h-3.5 text-primary-600" />
              <span>Admin Staff Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
