import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Users, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react'

export const JobCard = ({ job, onQuickApply }) => {
  const isUAE = job.country === 'UAE'

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#087F8C] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Details */}
      <div className="p-5 sm:p-6 pb-4">
        {/* Country Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              isUAE
                ? 'bg-[#F0F9FA] text-[#087F8C] border border-[#B2E3E8]'
                : 'bg-[#EDF9F3] text-[#20A66A] border border-[#AEE6C8]'
            }`}
          >
            <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
            <span>{job.country}</span>
          </span>

          <span className="text-xs font-semibold text-[#64748B] bg-[#F5F8F9] px-2.5 py-1 rounded-lg border border-[#E5E7EB] truncate max-w-[150px]">
            {job.category}
          </span>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-[#202B33] group-hover:text-[#087F8C] transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Location & Vacancies */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#64748B] mt-2.5">
          <span className="inline-flex items-center gap-1 font-medium text-[#202B33]">
            <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 text-[#64748B]">
              <Users className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</span>
            </span>
          )}
        </div>

        {/* Salary Highlight Pill in Fresh Green */}
        <div className="mt-4 bg-[#EDF9F3] border border-[#AEE6C8] rounded-xl p-2.5 px-3 flex items-center justify-between">
          <span className="text-xs text-[#64748B] font-medium">Salary</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#147248]">
            {job.salary}
          </span>
        </div>

        {/* Experience & Deadline */}
        <div className="mt-3.5 space-y-1.5 text-xs text-[#64748B]">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Experience:</span>
            <span className="font-semibold text-[#202B33]">{job.experience}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Deadline:</span>
              <span className="font-medium text-amber-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{job.deadline}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Bottom Strip */}
      <div className="p-4 sm:px-6 bg-[#F5F8F9] border-t border-[#E5E7EB] flex items-center gap-2">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 text-center py-2 px-3 text-xs sm:text-sm font-semibold text-[#202B33] hover:text-[#087F8C] bg-white hover:bg-[#F5F8F9] border border-[#E5E7EB] rounded-xl transition-colors"
        >
          View Details
        </Link>

        <button
          onClick={() => (onQuickApply ? onQuickApply(job) : null)}
          className="py-2 px-4 text-xs sm:text-sm font-bold text-white bg-[#087F8C] hover:bg-[#076F7B] rounded-xl shadow-xs hover:shadow transition-all inline-flex items-center gap-1 active:scale-95"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}
