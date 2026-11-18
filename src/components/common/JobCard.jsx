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
    <div className="bg-white rounded-2xl border border-surface-border hover:border-primary-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Details */}
      <div className="p-5 sm:p-6 pb-4">
        {/* Country Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              isUAE
                ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                : 'bg-secondary-50 text-secondary-700 border border-secondary-200/80'
            }`}
          >
            <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
            <span>{job.country}</span>
          </span>

          <span className="text-xs font-semibold text-slate-500 bg-surface-section px-2.5 py-1 rounded-lg border border-surface-border truncate max-w-[150px]">
            {job.category}
          </span>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-charcoal-800 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Location & Vacancies */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2.5">
          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</span>
            </span>
          )}
        </div>

        {/* Salary Highlight Pill */}
        <div className="mt-4 bg-secondary-50/80 border border-secondary-200/80 rounded-xl p-2.5 px-3 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Salary</span>
          <span className="text-xs sm:text-sm font-extrabold text-secondary-800">
            {job.salary}
          </span>
        </div>

        {/* Experience & Deadline */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Experience:</span>
            <span className="font-semibold text-charcoal-800">{job.experience}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-slate-400">Deadline:</span>
              <span className="font-medium text-amber-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{job.deadline}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Bottom Strip */}
      <div className="p-4 sm:px-6 bg-surface-section border-t border-surface-border flex items-center gap-2">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 text-center py-2 px-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary-600 bg-white hover:bg-slate-50 border border-surface-border rounded-xl transition-colors"
        >
          View Details
        </Link>

        <button
          onClick={() => (onQuickApply ? onQuickApply(job) : null)}
          className="py-2 px-4 text-xs sm:text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-xs hover:shadow transition-all inline-flex items-center gap-1 active:scale-95"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
