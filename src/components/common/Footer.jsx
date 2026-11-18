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
import { getActiveSocialLinks, socialConfig } from '../../config/socialLinks'

export const Footer = () => {
  const activeSocials = getActiveSocialLinks()

  return (
    <footer className="bg-[#F5F8F9] text-[#64748B] border-t-4 border-[#087F8C] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-[#E5E7EB]">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#087F8C] border border-[#065A64] flex items-center justify-center shadow-xs">
                <span className="text-lg font-black text-white">
                  J<span className="text-[#20A66A]">MS</span>
                </span>
              </div>
              <div>
                <span className="text-lg font-black text-[#202B33] tracking-tight block">JOY MANPOWER</span>
                <span className="text-[10px] uppercase tracking-wider text-[#087F8C] font-bold block">
                  Overseas Job Consultancy
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Joy Manpower Solution is an India-based overseas recruitment consultancy dedicated exclusively to connecting certified workforce with verified corporate sponsors in <strong>UAE (Dubai)</strong> and <strong>Saudi Arabia</strong>.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#20A66A] font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#20A66A]" />
              <span>100% Genuine Direct Gulf Employer Vacancies</span>
            </div>

            {/* Social Icons Row */}
            <div className="pt-2 flex items-center gap-2">
              {activeSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  title={social.name}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-[#087F8C] text-[#202B33] hover:text-white flex items-center justify-center transition-colors text-xs border border-[#E5E7EB] shadow-xs"
                >
                  <span className="text-xs font-bold">{social.name[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Exclusive Destinations */}
          <div className="space-y-4">
            <h3 className="text-[#202B33] text-sm font-bold tracking-wide uppercase border-l-2 border-[#20A66A] pl-2.5">
              Target Destinations
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/jobs?country=UAE" 
                  className="flex items-center justify-between text-[#64748B] hover:text-[#087F8C] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇦🇪</span>
                    <span className="font-medium">UAE – Dubai Vacancies</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#087F8C]" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs?country=Saudi Arabia" 
                  className="flex items-center justify-between text-[#64748B] hover:text-[#087F8C] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇸🇦</span>
                    <span className="font-medium">Saudi Arabia Vacancies</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#087F8C]" />
                </Link>
              </li>
            </ul>

            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#202B33] pt-2">
              Key Sectors
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="bg-white px-2 py-1 rounded-md border border-[#E5E7EB] text-[#64748B]">Facility Mgmt</span>
              <span className="bg-white px-2 py-1 rounded-md border border-[#E5E7EB] text-[#64748B]">Construction</span>
              <span className="bg-white px-2 py-1 rounded-md border border-[#E5E7EB] text-[#64748B]">Oil & Gas</span>
              <span className="bg-white px-2 py-1 rounded-md border border-[#E5E7EB] text-[#64748B]">Hospitality</span>
              <span className="bg-white px-2 py-1 rounded-md border border-[#E5E7EB] text-[#64748B]">Logistics</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[#202B33] text-sm font-bold tracking-wide uppercase border-l-2 border-[#20A66A] pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-[#64748B] hover:text-[#087F8C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#64748B] hover:text-[#087F8C] transition-colors">
                  About Our Agency
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-[#64748B] hover:text-[#087F8C] transition-colors">
                  Browse Active Vacancies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#64748B] hover:text-[#087F8C] transition-colors">
                  Contact & Assistance
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#64748B] hover:text-[#087F8C] transition-colors inline-flex items-center gap-1.5 pt-1 font-medium">
                  <Lock className="w-3 h-3 text-[#087F8C]" />
                  <span>Admin Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-[#202B33] text-sm font-bold tracking-wide uppercase border-l-2 border-[#20A66A] pl-2.5">
              Contact Details
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                <span>Head Office: Mumbai / New Delhi, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#087F8C] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#087F8C] transition-colors font-medium">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#087F8C] shrink-0" />
                <a href="mailto:info@joymanpowersolution.com" className="hover:text-[#087F8C] transition-colors truncate">
                  info@joymanpowersolution.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#087F8C] shrink-0" />
                <span>Mon – Sat: 9:30 AM – 6:30 PM (IST)</span>
              </li>
            </ul>

            <div className="pt-1">
              <a
                href={socialConfig.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#20A66A] hover:bg-[#188E59] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                <span>WhatsApp Recruitment Desk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#64748B] text-center md:text-left">
          <p>© {new Date().getFullYear()} Joy Manpower Solution. All rights reserved.</p>
          <p>
            Overseas job placements exclusively in <strong>UAE (Dubai)</strong> and <strong>Saudi Arabia</strong>.
          </p>
        </div>
      </div>
    </footer>
  )
}
