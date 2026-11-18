import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react'

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
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Top Header Bar */}
      <div className="bg-brand-900 text-white text-xs sm:text-sm py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Specialized Overseas Recruitment: <strong>UAE (Dubai)</strong> & <strong>Saudi Arabia</strong></span>
            </span>
            <a 
              href="tel:+919876543210" 
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-300" />
              <span>+91 98765 43210</span>
            </a>
            <a 
              href="mailto:info@joymanpowersolution.com" 
              className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-300" />
              <span>info@joymanpowersolution.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20interested%20in%20overseas%20job%20vacancies."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>WhatsApp Us</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-xs bg-brand-800/80 hover:bg-brand-800 px-2 py-0.5 rounded"
              title="Admin Portal Login"
            >
              <Lock className="w-3 h-3 text-gold-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-brand-900 border border-brand-700/50 flex items-center justify-center shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-black tracking-tight text-white">
                <span className="text-gold-400">J</span>MS
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight leading-tight flex items-center gap-1">
                <span>JOY MANPOWER</span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
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
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-brand-900 bg-brand-50 border border-brand-200/60 shadow-xs'
                    : 'text-slate-700 hover:text-brand-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-gold-400" />
              <span>Explore Jobs</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/jobs"
              className="bg-brand-800 text-white text-xs font-semibold px-3 py-2 rounded-lg"
            >
              Jobs
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-brand-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-brand-50 text-brand-900 border border-brand-100'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-brand-800 text-white font-semibold py-3 rounded-lg"
            >
              <Briefcase className="w-4 h-4 text-gold-400" />
              <span>View All Vacancies</span>
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium py-2.5 rounded-lg text-sm"
            >
              <Lock className="w-4 h-4 text-brand-700" />
              <span>Admin Login Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
