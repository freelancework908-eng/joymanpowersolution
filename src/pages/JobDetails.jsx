import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  DollarSign, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Gift, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  FileText
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { ApplyModal } from '../components/jobs/ApplyModal'

export const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [relatedJobs, setRelatedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    fetchJob()
    window.scrollTo(0, 0)
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await jobService.getJobById(id)
    if (err || !data) {
      setError('Job vacancy not found or may have been unlisted.')
      setJob(null)
    } else {
      setJob(data)
      // Fetch related jobs in same country
      const { data: related } = await jobService.getPublishedJobs({
        country: data.country
      })
      if (related) {
        setRelatedJobs(related.filter((r) => String(r.id) !== String(id)).slice(0, 3))
      }
    }
    setLoading(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Overseas Job Vacancy: ${job?.title} in ${job?.location}`,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4 pt-6">
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The requested job vacancy may have expired, closed, or been unlisted.
        </p>
        <div className="pt-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-800 text-white font-semibold text-sm hover:bg-brand-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Active Jobs</span>
          </Link>
        </div>
      </div>
    )
  }

  const isUAE = job.country === 'UAE'

  return (
    <div className="py-10 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Vacancy'}</span>
          </button>
        </div>

        {/* Job Header Hero Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isUAE
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
                  <span>{job.country}</span>
                </span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {job.category}
                </span>
                {job.status === 'published' ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active Vacancy
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {job.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{job.location}</span>
                </span>
                {job.vacancies && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{job.vacancies} {job.vacancies === 1 ? 'Open Position' : 'Open Positions'}</span>
                  </span>
                )}
                {job.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-amber-800">
                    <Clock className="w-4 h-4" />
                    <span>Apply before: {job.deadline}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(
                  job.title
                )}%20vacancy%20in%20${encodeURIComponent(job.country)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <span>WhatsApp Query</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md shadow-brand-900/10 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 text-gold-400" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Monthly Salary
              </span>
              <span className="text-sm sm:text-base font-extrabold text-brand-900 mt-0.5 block">
                {job.salary}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Experience
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 block">
                {job.experience}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Qualification
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 block truncate" title={job.qualification}>
                {job.qualification}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Visa Category
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 block">
                Employment Visa
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Left Details, Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Details Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-800" />
                <span>Job Description & Role Overview</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-800" />
                  <span>Key Responsibilities & Duties</span>
                </h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Required Qualifications & Experience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-800" />
                <span>Candidate Requirements</span>
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span><strong>Educational Qualification:</strong> {job.qualification}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span><strong>Work Experience:</strong> {job.experience}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span><strong>Passport Status:</strong> Valid Indian Passport with minimum 1-year remaining validity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span><strong>Medical Fitness:</strong> Must be fit to clear GCC GAMCA medical examination.</span>
                </li>
              </ul>
            </div>

            {/* Benefits Provided */}
            {job.benefits && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-brand-800" />
                  <span>Company Provided Benefits & Perks</span>
                </h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Overview & Apply
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-slate-800">{job.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-800">{job.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Industry:</span>
                  <span className="font-semibold text-slate-800">{job.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Monthly Remuneration:</span>
                  <span className="font-bold text-brand-900">{job.salary}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Open for Applications
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3.5 px-4 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-900/10 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-gold-400" />
                <span>Submit Your Resume</span>
              </button>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  All candidate data is handled confidentially and submitted directly to the official overseas sponsor.
                </span>
              </div>
            </div>

            {/* Related Jobs in Same Country */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  More Vacancies in {job.country}
                </h3>
                <div className="space-y-3">
                  {relatedJobs.map((r) => (
                    <Link
                      key={r.id}
                      to={`/jobs/${r.id}`}
                      className="block p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 transition-colors group"
                    >
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-800 line-clamp-1">
                        {r.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>{r.location}</span>
                        <span className="font-semibold text-brand-900">{r.salary}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {job && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}
