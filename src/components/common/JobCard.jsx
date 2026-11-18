import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react'

export const JobCard = ({ job, onQuickApply }) => {
  const isUAE = job.country === 'UAE'

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-brand-500/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Country Badge */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              isUAE
                ? 'bg-red-50 text-red-700 border border-red-200/80'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
            }`}
          >
            <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
            <span>{job.country}</span>
          </span>

          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {job.category}
          </span>
        </div>

        {/* Title */}
        <Link to={`/jobs/${job.id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Location & Vacancies */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2.5">
          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{job.location}</span>
          </span>
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</span>
            </span>
          )}
        </div>

        {/* Salary Highlight Pill */}
        <div className="mt-4 bg-brand-50/70 border border-brand-100 rounded-lg p-2.5 px-3 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Salary</span>
          <span className="text-sm font-bold text-brand-900">
            {job.salary}
          </span>
        </div>

        {/* Experience & Qualification pills */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Experience:</span>
            <span className="font-semibold text-slate-700">{job.experience}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-slate-400">Deadline:</span>
              <span className="font-medium text-amber-700 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{job.deadline}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 text-center py-2 px-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
        >
          View Details
        </Link>
        <button
          onClick={() => (onQuickApply ? onQuickApply(job) : null)}
          className="py-2 px-4 text-xs sm:text-sm font-semibold text-white bg-brand-800 hover:bg-brand-900 rounded-lg shadow-xs hover:shadow transition-all inline-flex items-center gap-1"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
