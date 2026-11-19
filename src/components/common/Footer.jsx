import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Briefcase,
  Lock
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export const Footer = () => {
  const { settings } = useSettings()

  const cleanWhatsapp = (settings?.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Joy Manpower Solution, I am inquiring about overseas job vacancies.')}`
    : '#'

  return (
    <footer className="bg-[#26075D] text-slate-300 border-t-4 border-[#FFC900]">
      {/* Top Pre-Footer Bar: Build Your Global Career */}
      <div className="bg-[#321078] py-8 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Build Your Global Career with Joy Manpower Solution
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Verified employer sponsor visas for Saudi Arabia and Dubai (UAE). Zero hidden charges.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#16B83D] hover:bg-[#139C34] text-white font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat with Us on WhatsApp</span>
            </a>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-transform active:scale-95 uppercase tracking-wide"
            >
              <span>Explore Vacancies</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Company Logo & Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              {settings?.logo_url ? (
                <div className="w-12 h-12 rounded-xl bg-white border border-[#3E0F87] p-1 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={settings.logo_url}
                    alt={settings.company_name || 'Joy Manpower Solution'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#321078] border-2 border-[#FFC900] flex items-center justify-center shadow-md">
                  <span className="text-xl font-black text-[#FFC900] tracking-tighter">
                    J<span className="text-white">MS</span>
                  </span>
                </div>
              )}
              <div>
                <span className="text-lg font-black text-white tracking-tight block">
                  {settings?.company_name || 'JOY MANPOWER'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#FFC900] font-bold block">
                  Overseas Job Consultancy
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Joy Manpower Solution is an India-based overseas manpower recruitment consultancy dedicated exclusively to deploying certified trade workforce to corporate sponsors in <strong>Saudi Arabia</strong> and the <strong>United Arab Emirates (Dubai)</strong>.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#FFC900] font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#FFC900]" />
              <span>100% Genuine Direct Employer Vacancies</span>
            </div>

            {/* Social Media Circular Links */}
            <div className="pt-2 flex items-center gap-2">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs transition-colors border border-[#3E0F87]"
                >
                  f
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs transition-colors border border-[#3E0F87]"
                >
                  yt
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs transition-colors border border-[#3E0F87]"
                >
                  in
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#321078] hover:bg-[#FFC900] text-white hover:text-[#26075D] flex items-center justify-center font-bold text-xs transition-colors border border-[#3E0F87]"
                >
                  ig
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Exclusive Destinations */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black tracking-wide uppercase border-l-4 border-[#FFC900] pl-2.5">
              Destinations & Sectors
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/jobs?country=Saudi Arabia" 
                  className="flex items-center justify-between text-slate-300 hover:text-[#FFC900] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span>🇸🇦</span>
                    <span className="font-semibold">Saudi Arabia Jobs</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFC900]" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs?country=UAE" 
                  className="flex items-center justify-between text-slate-300 hover:text-[#FFC900] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span>🇦🇪</span>
                    <span className="font-semibold">Dubai & UAE Jobs</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFC900]" />
                </Link>
              </li>
            </ul>

            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 pt-2">
              Key Sectors
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="bg-[#321078] px-2.5 py-1 rounded-md text-slate-200 border border-[#3E0F87]">Facility Mgmt</span>
              <span className="bg-[#321078] px-2.5 py-1 rounded-md text-slate-200 border border-[#3E0F87]">Construction</span>
              <span className="bg-[#321078] px-2.5 py-1 rounded-md text-slate-200 border border-[#3E0F87]">Oil & Gas</span>
              <span className="bg-[#321078] px-2.5 py-1 rounded-md text-slate-200 border border-[#3E0F87]">Hospitality</span>
              <span className="bg-[#321078] px-2.5 py-1 rounded-md text-slate-200 border border-[#3E0F87]">Logistics</span>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black tracking-wide uppercase border-l-4 border-[#FFC900] pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  Foreign Jobs Catalog
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  Recruitment Gallery
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  Candidate Success Stories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-[#FFC900] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-300 hover:text-[#FFC900] transition-colors inline-flex items-center gap-1.5 pt-1 font-medium">
                  <Lock className="w-3 h-3 text-[#FFC900]" />
                  <span>Admin Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black tracking-wide uppercase border-l-4 border-[#FFC900] pl-2.5">
              Contact Information
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FFC900] shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-snug">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FFC900] shrink-0" />
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-slate-300 hover:text-[#FFC900]">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#16B83D] shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#16B83D] font-bold">
                    WhatsApp: {settings.whatsapp_display || settings.whatsapp}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FFC900] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-[#FFC900] truncate">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.working_hours && (
                <li className="flex items-center gap-2.5 text-slate-300 text-[11px]">
                  <Clock className="w-4 h-4 text-[#FFC900] shrink-0" />
                  <span>{settings.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 mt-8 border-t border-[#3E0F87] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Joy Manpower Solution. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#FFC900] font-bold">UAE & Saudi Arabia Recruitment Specialist</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
