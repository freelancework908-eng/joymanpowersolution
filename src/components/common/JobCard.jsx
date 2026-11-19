import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Users, 
  ArrowRight,
  Clock
} from 'lucide-react'

export const JobCard = ({ job, onQuickApply }) => {
  const isUAE = job.country === 'UAE'

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E9EBF0] hover:border-[#321078] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Details */}
      <div className="p-5 sm:p-6 pb-4">
        {/* Country Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#F7F4FC] text-[#321078] border border-[#DDD0F3]">
            <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
            <span>{isUAE ? 'UAE – Dubai' : 'Saudi Arabia'}</span>
          </span>

          <span className="text-xs font-semibold text-[#58617F] bg-[#F4F5F8] px-2.5 py-1 rounded-lg border border-[#E9EBF0] truncate max-w-[150px]">
            {job.category}
          </span>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className="block">
          <h3 className="text-base sm:text-lg font-black text-[#26075D] group-hover:text-[#5015A8] transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Location & Vacancies */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#58617F] mt-2.5">
          <span className="inline-flex items-center gap-1 font-medium text-[#252039]">
            <MapPin className="w-3.5 h-3.5 text-[#321078] shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 text-[#58617F]">
              <Users className="w-3.5 h-3.5 text-[#5015A8] shrink-0" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</span>
            </span>
          )}
        </div>

        {/* Salary Highlight Pill */}
        <div className="mt-4 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl p-2.5 px-3.5 flex items-center justify-between">
          <span className="text-xs text-[#58617F] font-medium">Offered Salary</span>
          <span className="text-xs sm:text-sm font-black text-[#321078]">
            {job.salary}
          </span>
        </div>

        {/* Experience & Deadline */}
        <div className="mt-3.5 space-y-1.5 text-xs text-[#58617F]">
          <div className="flex items-center justify-between">
            <span>Experience Required:</span>
            <span className="font-bold text-[#252039]">{job.experience}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center justify-between">
              <span>Closing Deadline:</span>
              <span className="font-semibold text-amber-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{job.deadline}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Bottom Strip: Yellow Apply Button */}
      <div className="p-4 sm:px-6 bg-[#F7F4FC] border-t border-[#E9EBF0] flex items-center gap-2">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold text-[#321078] hover:text-[#26075D] bg-white hover:bg-slate-50 border border-[#DDD0F3] rounded-xl transition-colors shadow-xs"
        >
          View Details
        </Link>

        <button
          onClick={() => (onQuickApply ? onQuickApply(job) : null)}
          className="py-2.5 px-5 text-xs sm:text-sm font-black text-[#26075D] bg-[#FFC900] hover:bg-[#F5B900] rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-1.5 active:scale-95 uppercase tracking-wide"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  )
}
