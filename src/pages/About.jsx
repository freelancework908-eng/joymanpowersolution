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
  FileText
} from 'lucide-react'

export const About = () => {
  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-gold-400 bg-brand-800 border border-brand-700 px-3 py-1 rounded-full">
              About Joy Manpower Solution
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Specialized Overseas Job Consultancy for UAE & Saudi Arabia
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Committed to providing transparent, professional, and reliable overseas employment pathways for skilled and technical workforce from India to premier employers in Dubai (UAE) and Saudi Arabia.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Who We Are
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>Joy Manpower Solution</strong> is an India-based manpower recruitment consultancy focused exclusively on overseas career opportunities in the <strong>United Arab Emirates (UAE)</strong> and the <strong>Kingdom of Saudi Arabia (KSA)</strong>.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We bridge the gap between reputable Middle Eastern employers seeking verified talent and ambitious Indian job seekers seeking better remuneration, professional growth, and international work experience.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              By concentrating our efforts solely on UAE and Saudi Arabia, our consultancy maintains deep domain expertise in GCC labor regulations, visa sponsorship systems, trade test standards, and employer expectations.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-brand-900 font-bold text-base mb-1">Authentic Vacancies</div>
                <p className="text-xs text-slate-600">
                  Every vacancy posted is verified directly from corporate clients in Dubai and Saudi Arabia.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-brand-900 font-bold text-base mb-1">Ethical Processing</div>
                <p className="text-xs text-slate-600">
                  Zero hidden charges, clear contracts, and transparent communication throughout the journey.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-brand-800" />
                <span>Our Exclusive Geographies</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                    <span>🇦🇪</span>
                    <span>United Arab Emirates (UAE – Dubai)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sourcing for facility management, commercial building maintenance, hospitality, engineering, logistics, and retail businesses.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                    <span>🇸🇦</span>
                    <span>Kingdom of Saudi Arabia (KSA)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Deploying talent for Vision 2030 giga-projects, oil & gas plants, civil infrastructure, heavy machinery, and industrial operations in Riyadh, Jeddah, and Dammam.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong>Note:</strong> Joy Manpower Solution operates strictly within UAE and Saudi Arabia to ensure highest service quality and candidate protection.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To empower Indian job seekers with genuine overseas employment opportunities in UAE and Saudi Arabia through ethical recruitment, rigorous skill matching, transparent visa procedures, and unwavering candidate welfare.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be the most dependable and respected overseas manpower consultancy for Dubai and Saudi Arabia, known for uncompromising integrity, prompt deployment, and sustainable careers for our workforce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Recruitment Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            Ethical Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Recruitment Standards
          </h2>
          <p className="text-sm text-slate-600">
            We adhere to rigorous standards designed to safeguard candidates and deliver top talent to overseas sponsors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-brand-800" />
            <h4 className="font-bold text-slate-900 text-base">Direct Company Visas</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We process only direct company employment visas. No tourist or visit visa employment gimmicks are ever entertained.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-brand-800" />
            <h4 className="font-bold text-slate-900 text-base">Written Employment Terms</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every candidate is provided with complete written details regarding monthly basic salary, overtime eligibility, accommodation, and medical insurance before departure.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-brand-800" />
            <h4 className="font-bold text-slate-900 text-base">Pre-Departure Guidance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Candidates receive complete orientation about local culture, labor rights in UAE / Saudi Arabia, emergency helpline numbers, and airport protocols.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-xs transition-colors"
          >
            <span>Explore Current Vacancies</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      </section>
    </div>
  )
}
