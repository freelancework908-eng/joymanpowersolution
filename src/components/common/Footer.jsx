import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-brand-950 text-slate-300 border-t border-brand-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-brand-800/60">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-800 border border-brand-700 flex items-center justify-center">
                <span className="text-lg font-black text-white">
                  <span className="text-gold-400">J</span>MS
                </span>
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block">JOY MANPOWER</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                  Overseas Job Consultancy
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Joy Manpower Solution is an India-based professional overseas recruitment consultancy dedicated exclusively to bridging skilled talent with prestigious employers in <strong>UAE (Dubai)</strong> and <strong>Saudi Arabia</strong>.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gold-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Genuine Direct Gulf Employer Vacancies</span>
            </div>
          </div>

          {/* Column 2: Exclusive Destinations & Sectors */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-sm border-l-2 border-gold-400 pl-2.5">
              Target Destinations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link 
                  to="/jobs?country=UAE" 
                  className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇦🇪</span>
                    <span>UAE – Dubai Vacancies</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs?country=Saudi Arabia" 
                  className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇸🇦</span>
                    <span>Saudi Arabia Vacancies</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-3">
              Popular Industries
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              <span className="bg-brand-900/80 px-2 py-1 rounded border border-brand-800">Facility Mgmt</span>
              <span className="bg-brand-900/80 px-2 py-1 rounded border border-brand-800">Construction</span>
              <span className="bg-brand-900/80 px-2 py-1 rounded border border-brand-800">Oil & Gas</span>
              <span className="bg-brand-900/80 px-2 py-1 rounded border border-brand-800">Hospitality</span>
              <span className="bg-brand-900/80 px-2 py-1 rounded border border-brand-800">Logistics</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-sm border-l-2 border-gold-400 pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Our Consultancy
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-colors">
                  Latest Job Openings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-500 hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-sm border-l-2 border-gold-400 pl-2.5">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span>Head Office: Mumbai / New Delhi, India <br /><span className="text-xs text-slate-500">(Full office address available on contact page)</span></span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:info@joymanpowersolution.com" className="hover:text-white transition-colors">
                  info@joymanpowersolution.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon – Sat: 9:30 AM – 6:30 PM (IST)</span>
              </li>
            </ul>

            <div className="pt-1">
              <a
                href="https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20want%20to%20apply%20for%20Gulf%20vacancies."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Ethical Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Joy Manpower Solution. All rights reserved.</p>
          <p className="text-center md:text-right">
            Dedicated recruitment for UAE & Saudi Arabia. Authentic employment contracts and transparent processing.
          </p>
        </div>
      </div>
    </footer>
  )
}
