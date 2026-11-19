import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Target, 
  Eye, 
  ShieldCheck, 
  Users, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Globe2,
  FileCheck2,
  MessageCircle
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export const About = () => {
  const { settings } = useSettings()

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 w-full bg-white">
      {/* Header Banner */}
      <section className="bg-[#26075D] text-white py-14 sm:py-20 border-b border-[#3E0F87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-black border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#FFC900]" />
            <span>Authorized Overseas Manpower Consultancy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Specialized Overseas Recruitment for Saudi Arabia & UAE
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Joy Manpower Solution provides transparent, reliable, and ethical recruitment pathways for certified technical personnel and trade specialists from India to premier corporate employers in Dubai and Saudi Arabia.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#321078] bg-[#F7F4FC] border border-[#DDD0F3] px-3.5 py-1 rounded-full inline-block">
              Consultancy Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#26075D]">
              Connecting Indian Talent with Gulf Industry Leaders
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#58617F] leading-relaxed">
              <strong>Joy Manpower Solution</strong> is an India-based manpower recruitment consultancy focused exclusively on overseas career opportunities in the <strong>Kingdom of Saudi Arabia (KSA)</strong> and the <strong>United Arab Emirates (UAE – Dubai)</strong>.
            </p>
            <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
              We bridge the gap between verified Middle Eastern employers seeking certified trade competence and qualified Indian job seekers seeking better compensation, professional growth, and international work experience.
            </p>
            <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
              By concentrating our efforts solely on Saudi Arabia and the UAE, our agency maintains deep domain expertise in GCC labor regulations, Musaned/Qiwa (KSA) and MOHRE (UAE) visa systems, trade test standards, and corporate sponsor contracts.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3]">
                <div className="text-[#26075D] font-extrabold text-sm mb-1">Direct Employer Visas</div>
                <p className="text-xs text-[#58617F]">
                  Every vacancy is verified directly from corporate sponsors in Dubai and Saudi Arabia. No visit-to-work visa schemes.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3]">
                <div className="text-[#26075D] font-extrabold text-sm mb-1">Practical Trade Testing</div>
                <p className="text-xs text-[#58617F]">
                  Every candidate undergoes workshop skill testing to ensure correct salary fixation and employer satisfaction.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#26075D]">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Overseas recruitment meeting"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26075D]/95 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-[11px] font-bold text-[#FFC900] uppercase tracking-wider block">
                    Authentic Gulf Recruitment
                  </span>
                  <div className="text-sm font-extrabold">
                    Strict ethical recruitment, pre-departure orientation, and legal contract compliance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#F7F4FC] py-14 sm:py-18 border-y border-[#E9EBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[#DDD0F3] shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#321078] text-[#FFC900] flex items-center justify-center shadow-sm">
                <Target className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-[#26075D]">Our Mission</h3>
              <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
                To connect qualified Indian technicians, skilled trades, and professionals with authentic, verified corporate employers in Saudi Arabia and the UAE through transparent, zero-exploitation recruitment practices.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#DDD0F3] shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#321078] text-[#FFC900] flex items-center justify-center shadow-sm">
                <Eye className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-[#26075D]">Our Vision</h3>
              <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
                To become the most dependable and trusted overseas manpower partner for Gulf corporate sponsors and Indian job seekers, recognized for integrity, compliance, and career transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#321078] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">
              Ready to explore your overseas career in UAE or Saudi Arabia?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Browse current vacancies or submit your resume directly to our recruitment team.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-8 py-3.5 rounded-full shadow-lg transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wide shrink-0"
          >
            <span>Explore Vacancies</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
