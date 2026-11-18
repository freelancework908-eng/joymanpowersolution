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
  FileCheck2
} from 'lucide-react'

export const About = () => {
  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12 w-full">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-500 text-white rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-secondary-200 bg-primary-600/60 border border-primary-400 px-3 py-1 rounded-full inline-block">
              About Joy Manpower Solution
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Specialized Overseas Recruitment for UAE & Saudi Arabia
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-primary-100 leading-relaxed">
              Committed to providing transparent, professional, and reliable overseas employment pathways for skilled and technical workforce from India to premier employers in Dubai (UAE) and Saudi Arabia.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800">
              Who We Are
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              <strong>Joy Manpower Solution</strong> is an India-based manpower recruitment consultancy focused exclusively on overseas career opportunities in the <strong>United Arab Emirates (UAE)</strong> and the <strong>Kingdom of Saudi Arabia (KSA)</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We bridge the gap between reputable Middle Eastern employers seeking verified talent and ambitious Indian job seekers seeking better remuneration, professional growth, and international work experience.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              By concentrating our efforts solely on UAE and Saudi Arabia, our consultancy maintains deep domain expertise in GCC labor regulations, visa sponsorship systems, trade test standards, and employer expectations.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-surface-section border border-surface-border">
                <div className="text-charcoal-800 font-bold text-sm mb-1">Authentic Vacancies</div>
                <p className="text-xs text-slate-500">
                  Every vacancy posted is verified directly from corporate clients in Dubai and Saudi Arabia.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-section border border-surface-border">
                <div className="text-charcoal-800 font-bold text-sm mb-1">Ethical Processing</div>
                <p className="text-xs text-slate-500">
                  Zero hidden charges, clear contracts, and transparent communication throughout the journey.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image / Geographies Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-surface-border shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                alt="Dubai and Saudi Arabia business infrastructure"
                className="w-full h-48 sm:h-56 object-cover"
                loading="lazy"
              />
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-charcoal-800 border-b border-surface-border pb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-primary-500" />
                <span>Our Exclusive GCC Geographies</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="flex items-center gap-2 font-bold text-charcoal-800 text-xs sm:text-sm mb-0.5">
                    <span>🇦🇪</span>
                    <span>United Arab Emirates (UAE – Dubai)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Sourcing for facility management, commercial building maintenance, hospitality, engineering, logistics, and retail businesses.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-secondary-50/60 border border-secondary-100">
                  <div className="flex items-center gap-2 font-bold text-charcoal-800 text-xs sm:text-sm mb-0.5">
                    <span>🇸🇦</span>
                    <span>Kingdom of Saudi Arabia (KSA)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Deploying talent for Vision 2030 megaprojects, oil & gas plants, civil infrastructure, heavy machinery, and industrial operations in Riyadh, Jeddah, and Dammam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface-section border-y border-surface-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-800">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To empower Indian job seekers with genuine overseas employment opportunities in UAE and Saudi Arabia through ethical recruitment, rigorous skill matching, transparent visa procedures, and unwavering candidate welfare.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-800">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To be the most dependable and respected overseas manpower consultancy for Dubai and Saudi Arabia, recognized for uncompromising integrity, prompt deployment, and sustainable careers for our workforce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full inline-block">
            Our Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800">
            Recruitment Quality Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Strict measures to protect candidates and provide verified talent to overseas employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-secondary-500" />
            <h4 className="font-bold text-charcoal-800 text-sm sm:text-base">Direct Company Visas</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We process only direct company employment visas. No visit visa employment conversions are entertained.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-secondary-500" />
            <h4 className="font-bold text-charcoal-800 text-sm sm:text-base">Transparent Terms</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Candidates receive complete written offers detailing basic salary, accommodation, overtime, and medical cover before signing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-secondary-500" />
            <h4 className="font-bold text-charcoal-800 text-sm sm:text-base">Pre-Departure Guidance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete briefing regarding local labor rights, emergency helplines, airport arrival protocols, and workplace expectations.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors active:scale-95"
          >
            <span>Explore Active Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
