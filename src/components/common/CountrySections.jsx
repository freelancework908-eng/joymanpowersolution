import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Building, Flame } from 'lucide-react'

export const CountrySections = ({ uaeCount = 0, saudiCount = 0 }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#F4F5F8] border-b border-[#E9EBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#321078] bg-white border border-[#DDD0F3] px-3.5 py-1 rounded-full inline-block">
            Target Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#26075D]">
            Explore Vacancies by Country
          </h2>
          <p className="text-xs sm:text-sm text-[#58617F]">
            We focus strictly on two premier economies with direct employer visas and verified sponsors.
          </p>
        </div>

        {/* 3 Visual Cards in 1 Row on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Saudi Arabia Jobs */}
          <div className="bg-white rounded-3xl border border-[#E9EBF0] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Image with Tag */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#26075D]">
                <img
                  src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80"
                  alt="Saudi Arabia Overseas Recruitment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26075D]/90 via-[#26075D]/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26075D]/80 backdrop-blur-xs text-[#FFC900] text-xs font-black border border-[#FFC900]/30 shadow-xs">
                    <span>🇸🇦 Kingdom of Saudi Arabia</span>
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-xl font-black text-white">Saudi Arabia Jobs</h3>
                  <p className="text-[11px] text-slate-200">Riyadh, Jeddah, Dammam & Jubail</p>
                </div>
              </div>

              {/* Details & Categories */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
                  Huge demand powered by Vision 2030 industrial, oil & gas, and infrastructure megaprojects with provided accommodation and direct Iqama sponsorship.
                </p>

                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#321078]">
                    Featured Job Sectors:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Oil & Gas Plants
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Industrial Electricians
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Heavy Crane Operators
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Logistics & Warehousing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Jobs Button */}
            <div className="p-6 pt-0">
              <Link
                to="/jobs?country=Saudi Arabia"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#321078] hover:bg-[#5015A8] text-white font-black text-xs sm:text-sm transition-colors shadow-md active:scale-95"
              >
                <span>View Saudi Arabia Jobs</span>
                <ArrowRight className="w-4 h-4 text-[#FFC900]" />
              </Link>
            </div>
          </div>

          {/* Card 2: Dubai Jobs */}
          <div className="bg-white rounded-3xl border border-[#E9EBF0] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Image with Tag */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#26075D]">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
                  alt="Dubai UAE Overseas Recruitment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26075D]/90 via-[#26075D]/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26075D]/80 backdrop-blur-xs text-[#FFC900] text-xs font-black border border-[#FFC900]/30 shadow-xs">
                    <span>🇦🇪 United Arab Emirates</span>
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-xl font-black text-white">Dubai & UAE Jobs</h3>
                  <p className="text-[11px] text-slate-200">Dubai, Abu Dhabi & Sharjah</p>
                </div>
              </div>

              {/* Details & Categories */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-[#58617F] leading-relaxed">
                  World-class commercial center offering tax-free Gulf salaries, high standard of living, and continuous openings in facility management and civil engineering.
                </p>

                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#321078]">
                    Featured Job Sectors:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Facility Management
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      HVAC & MEP Technicians
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Civil Site Supervisors
                    </span>
                    <span className="bg-[#F7F4FC] text-[#321078] font-semibold px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                      Hospitality & Catering
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Jobs Button */}
            <div className="p-6 pt-0">
              <Link
                to="/jobs?country=UAE"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#321078] hover:bg-[#5015A8] text-white font-black text-xs sm:text-sm transition-colors shadow-md active:scale-95"
              >
                <span>View Dubai & UAE Jobs</span>
                <ArrowRight className="w-4 h-4 text-[#FFC900]" />
              </Link>
            </div>
          </div>

          {/* Card 3: Why Choose Us */}
          <div className="bg-gradient-to-br from-[#321078] to-[#26075D] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-bold border border-white/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Client Verified Benefits</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Why Joy Manpower Solution?
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Dedicated exclusively to sourcing, testing, and deploying qualified technical manpower to registered corporate entities.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Recruitment Guidance</h4>
                    <p className="text-[11px] text-slate-300">Expert guidance on Gulf trade tests and document attestation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Candidate Support</h4>
                    <p className="text-[11px] text-slate-300">Complete pre-flight assistance and GAMCA medical test support.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Transparent Recruitment Process</h4>
                    <p className="text-[11px] text-slate-300">Zero hidden service fees and clear contract terms before flying.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFC900] text-[#26075D] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Overseas Employment Assistance</h4>
                    <p className="text-[11px] text-slate-300">Only verified corporate employer sponsor visas; no visit-to-work.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/about"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm transition-colors shadow-md"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
