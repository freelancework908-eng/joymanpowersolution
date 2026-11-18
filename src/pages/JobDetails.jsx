import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Users, 
  Clock, 
  ShieldCheck, 
  Gift, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  FileText,
  GraduationCap
} from 'lucide-react'
import { jobService } from '../services/jobService'
import { ApplyModal } from '../components/jobs/ApplyModal'
import { socialConfig } from '../config/socialLinks'

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
        <div className="bg-white rounded-2xl border border-surface-border p-8 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal-800">Job Vacancy Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The requested job vacancy may have closed or been unlisted by the administrator.
        </p>
        <div className="pt-2">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-xs sm:text-sm hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Active Vacancies</span>
          </Link>
        </div>
      </div>
    )
  }

  const isUAE = job.country === 'UAE'

  return (
    <div className="py-8 sm:py-12 space-y-6 sm:space-y-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Vacancies</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-charcoal-800 bg-white border border-surface-border px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-primary-500" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Vacancy'}</span>
          </button>
        </div>

        {/* Job Header Hero Box */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isUAE
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-secondary-50 text-secondary-700 border border-secondary-200'
                  }`}
                >
                  <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
                  <span>{job.country}</span>
                </span>

                <span className="text-xs font-semibold text-slate-600 bg-surface-section px-3 py-1 rounded-full border border-surface-border">
                  {job.category}
                </span>

                {job.status === 'published' ? (
                  <span className="text-xs font-bold text-secondary-700 bg-secondary-50 px-2.5 py-0.5 rounded-full border border-secondary-200">
                    Active Opening
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {job.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal-800 tracking-tight leading-snug">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-charcoal-800">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{job.location}</span>
                </span>
                {job.vacancies && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{job.vacancies} {job.vacancies === 1 ? 'Open Vacancy' : 'Open Vacancies'}</span>
                  </span>
                )}
                {job.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Deadline: {job.deadline}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(
                  job.title
                )}%20vacancy%20in%20${encodeURIComponent(job.country)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs active:scale-95"
              >
                <span>WhatsApp Query</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-500/20 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-surface-border">
            <div className="p-3.5 rounded-xl bg-secondary-50/70 border border-secondary-200">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Monthly Salary
              </span>
              <span className="text-xs sm:text-sm md:text-base font-black text-secondary-800 mt-0.5 block truncate">
                {job.salary}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-section border border-surface-border">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Experience
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-charcoal-800 mt-0.5 block truncate">
                {job.experience}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-section border border-surface-border">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Qualification
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-charcoal-800 mt-0.5 block truncate" title={job.qualification}>
                {job.qualification}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-section border border-surface-border">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Visa Status
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-charcoal-800 mt-0.5 block">
                Employment Visa
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid (Left Details, Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-charcoal-800 border-b border-surface-border pb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                <span>Job Description & Role Overview</span>
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-charcoal-800 border-b border-surface-border pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                  <span>Key Responsibilities & Duties</span>
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Candidate Requirements */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-charcoal-800 border-b border-surface-border pb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                <span>Candidate Requirements</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span><strong>Educational Qualification:</strong> {job.qualification}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span><strong>Work Experience:</strong> {job.experience}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span><strong>Passport Status:</strong> Valid Indian Passport with minimum 1-year remaining validity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span><strong>Medical Fitness:</strong> Must clear standard GCC GAMCA medical examination.</span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-charcoal-800 border-b border-surface-border pb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-secondary-500" />
                  <span>Company Provided Benefits & Perks</span>
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-charcoal-800 text-sm sm:text-base border-b border-surface-border pb-2.5">
                Overview & Quick Apply
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-slate-400">Target Country:</span>
                  <span className="font-bold text-charcoal-800">{job.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-charcoal-800">{job.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-slate-400">Industry:</span>
                  <span className="font-semibold text-charcoal-800">{job.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-slate-400">Monthly Salary:</span>
                  <span className="font-bold text-secondary-700">{job.salary}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="font-bold text-secondary-700 bg-secondary-50 px-2 py-0.5 rounded">
                    Open for Submissions
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Your Resume</span>
              </button>

              <div className="p-3 rounded-xl bg-surface-section border border-surface-border text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                <span>
                  All candidate data is handled confidentially and submitted directly to the official overseas sponsor.
                </span>
              </div>
            </div>

            {/* Related Jobs in Same Country */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 space-y-3 shadow-xs">
                <h3 className="font-bold text-charcoal-800 text-xs sm:text-sm border-b border-surface-border pb-2">
                  More Vacancies in {job.country}
                </h3>
                <div className="space-y-2.5">
                  {relatedJobs.map((r) => (
                    <Link
                      key={r.id}
                      to={`/jobs/${r.id}`}
                      className="block p-3 rounded-xl bg-surface-section hover:bg-primary-50/60 border border-surface-border transition-colors group"
                    >
                      <h4 className="text-xs font-bold text-charcoal-800 group-hover:text-primary-600 line-clamp-1">
                        {r.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>{r.location}</span>
                        <span className="font-bold text-primary-600">{r.salary}</span>
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
