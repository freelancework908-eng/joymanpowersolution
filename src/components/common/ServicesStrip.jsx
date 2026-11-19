import React from 'react'
import { 
  Briefcase, 
  FileCheck2, 
  Plane, 
  Home, 
  Compass, 
  Users 
} from 'lucide-react'

export const ServicesStrip = () => {
  const services = [
    {
      id: 1,
      title: 'Overseas Job Placement',
      description: 'Verified Gulf corporate employer opportunities',
      icon: Briefcase
    },
    {
      id: 2,
      title: 'Visa Assistance',
      description: 'GAMCA, MOFA & embassy stamping coordination',
      icon: FileCheck2
    },
    {
      id: 3,
      title: 'Air Ticket Support',
      description: 'Direct sponsor-provided travel flight booking',
      icon: Plane
    },
    {
      id: 4,
      title: 'Accommodation Support',
      description: 'Sponsor housing & pre-departure welfare briefing',
      icon: Home
    },
    {
      id: 5,
      title: 'Recruitment Guidance',
      description: 'Trade testing & career pathway counseling',
      icon: Users
    }
  ]

  return (
    <section id="services" className="py-12 sm:py-16 bg-white border-b border-[#E9EBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#321078] bg-[#F7F4FC] border border-[#DDD0F3] px-3.5 py-1 rounded-full inline-block">
            Our Recruitment Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#26075D]">
            Comprehensive Overseas Manpower Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#58617F]">
            Transparent and structured support from trade testing to reporting to your overseas sponsor in Dubai or Saudi Arabia.
          </p>
        </div>

        {/* 5 Services Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F7F4FC] hover:bg-white border border-[#E9EBF0] hover:border-[#321078] hover:shadow-lg transition-all duration-200 group"
              >
                {/* Circular Purple Icon with White Symbol */}
                <div className="w-16 h-16 rounded-full bg-[#321078] group-hover:bg-[#5015A8] text-white flex items-center justify-center shadow-md mb-3.5 transform group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-[#FFC900]" />
                </div>

                <h3 className="font-extrabold text-[#26075D] text-sm leading-snug group-hover:text-[#321078] transition-colors">
                  {service.title}
                </h3>

                <p className="text-[11px] text-[#58617F] mt-1.5 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
