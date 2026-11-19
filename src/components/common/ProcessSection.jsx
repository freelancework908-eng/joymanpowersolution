import React from 'react'
import { Search, CheckCircle, FileText, UserCheck, PlaneTakeoff } from 'lucide-react'

export const ProcessSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Explore Available Jobs',
      description: 'Browse verified overseas openings in Dubai & Saudi Arabia.',
      icon: Search
    },
    {
      num: '02',
      title: 'Select a Suitable Vacancy',
      description: 'Review role requirements, salary, accommodation and eligibility.',
      icon: CheckCircle
    },
    {
      num: '03',
      title: 'Submit Your Resume',
      description: 'Apply online with your trade experience and contact details.',
      icon: FileText
    },
    {
      num: '04',
      title: 'Application Review',
      description: 'Technical screening, trade test and overseas client interview.',
      icon: UserCheck
    },
    {
      num: '05',
      title: 'Recruitment Follow-up',
      description: 'Visa stamping, GAMCA medical clearance, ticket & deployment.',
      icon: PlaneTakeoff
    }
  ]

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E9EBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#321078] bg-[#F7F4FC] border border-[#DDD0F3] px-3.5 py-1 rounded-full inline-block">
            Straightforward Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#26075D]">
            How Our Recruitment Process Works
          </h2>
          <p className="text-xs sm:text-sm text-[#58617F]">
            Five clear, structured steps connecting you directly with your verified Gulf employer.
          </p>
        </div>

        {/* 5 Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative bg-[#F7F4FC] rounded-2xl p-6 border border-[#E9EBF0] hover:border-[#321078] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#321078] text-[#FFC900] font-black flex items-center justify-center text-xs shadow-sm">
                    {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#5015A8] group-hover:scale-110 transition-transform" />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#26075D] text-sm sm:text-base leading-snug group-hover:text-[#321078] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#58617F] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 text-[10px] font-bold text-[#5015A8] uppercase tracking-wider">
                  Step {idx + 1} of 5
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
