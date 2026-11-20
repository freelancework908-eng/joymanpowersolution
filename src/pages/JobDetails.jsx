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
import { useSettings } from '../context/SettingsContext'

export const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { settings } = useSettings()

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

  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-[#DDD0F3] p-8 space-y-6 animate-pulse">
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
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#26075D]">Job Vacancy Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The requested job vacancy may have closed or been unlisted by the administrator.
        </p>
        <div className="pt-2">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#321078] text-[#FFC900] font-bold text-xs sm:text-sm hover:bg-[#26075D] transition-colors"
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
    <div className="py-8 sm:py-12 space-y-6 sm:space-y-8 w-full bg-[#F4F5F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#321078] hover:text-[#26075D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Vacancies</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#26075D] bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#321078]" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Vacancy'}</span>
          </button>
        </div>

        {/* Job Header Hero Box */}
        <div className="bg-white rounded-3xl border border-[#DDD0F3] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isUAE
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span>{isUAE ? '🇦🇪' : '🇸🇦'}</span>
                  <span>{isUAE ? 'UAE – Dubai' : 'Saudi Arabia'}</span>
                </span>

                <span className="text-xs font-bold text-[#321078] bg-[#F7F4FC] px-3 py-1 rounded-full border border-[#DDD0F3]">
                  {job.category}
                </span>

                {job.status === 'published' ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active Opening
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {job.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#26075D] tracking-tight leading-snug">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#26075D]">
                  <MapPin className="w-4 h-4 text-[#321078]" />
                  <span>{job.location}</span>
                </span>
                {job.vacancies && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{job.vacancies} {job.vacancies === 1 ? 'Open Vacancy' : 'Open Vacancies'}</span>
                  </span>
                )}
                {job.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Deadline: {job.deadline}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(
                  job.title
                )}%20vacancy%20in%20${encodeURIComponent(job.country)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#16B83D] hover:bg-[#139c34] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs active:scale-95"
              >
                <span>WhatsApp Query</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 stroke-[2.5]" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3]">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Salary (10 hrs)
              </span>
              <span className="text-xs sm:text-sm md:text-base font-black text-[#26075D] mt-0.5 block truncate">
                {job.salary_currency && !String(job.salary).includes(job.salary_currency)
                  ? `${job.salary_currency} ${job.salary}`
                  : job.salary}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Working Hours
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-[#26075D] mt-0.5 block truncate">
                {job.working_hours || '10 Hours / Day'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Experience
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-[#26075D] mt-0.5 block truncate">
                {job.experience}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Visa Category
              </span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-[#26075D] mt-0.5 block">
                Company Provided Visa
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid (Left Details, Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Salary Breakdown & Hours Card if Available */}
            {(job.basic_salary || job.compulsory_ot_salary || job.working_hours) && (
              <div className="bg-white rounded-3xl border border-[#DDD0F3] p-6 sm:p-8 space-y-4">
                <h2 className="text-base sm:text-lg font-black text-[#26075D] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#321078]" />
                  <span>Salary Structure & Working Conditions</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {job.basic_salary && (
                    <div className="p-4 rounded-xl bg-[#F7F4FC] border border-[#DDD0F3]">
                      <span className="text-[11px] font-bold text-slate-500 block">Monthly Salary (8 hrs)</span>
                      <span className="text-lg font-black text-[#26075D] mt-1 block">
                        {job.salary_currency ? `${job.salary_currency} ${job.basic_salary}` : job.basic_salary}
                      </span>
                    </div>
                  )}
                  {job.compulsory_ot_salary && (
                    <div className="p-4 rounded-xl bg-[#F7F4FC] border border-[#DDD0F3]">
                      <span className="text-[11px] font-bold text-slate-500 block">Compulsory OT (2 hrs)</span>
                      <span className="text-lg font-black text-[#26075D] mt-1 block">
                        {job.salary_currency ? `${job.salary_currency} ${job.compulsory_ot_salary}` : job.compulsory_ot_salary}
                      </span>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-[#321078] text-white">
                    <span className="text-[11px] font-bold text-[#FFC900] block">Total for 10 Hours</span>
                    <span className="text-lg font-black text-white mt-1 block">
                      {job.salary_currency ? `${job.salary_currency} ${job.salary}` : job.salary}
                    </span>
                  </div>
                </div>
                {job.overtime_details && (
                  <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-xl leading-relaxed">
                    <strong>Overtime Policy:</strong> {job.overtime_details}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-[#26075D] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#321078]" />
                <span>Job Description & Role Overview</span>
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
                <h2 className="text-base sm:text-lg font-black text-[#26075D] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#16B83D]" />
                  <span>Key Responsibilities & Duties</span>
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Candidate Requirements */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-[#26075D] border-b border-slate-100 pb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#321078]" />
                <span>Candidate Requirements</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#321078] shrink-0 mt-0.5" />
                  <span><strong>Educational Qualification:</strong> {job.qualification}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#321078] shrink-0 mt-0.5" />
                  <span><strong>Work Experience:</strong> {job.experience}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#321078] shrink-0 mt-0.5" />
                  <span><strong>Passport Status:</strong> Valid Indian Passport with minimum 1-year remaining validity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#321078] shrink-0 mt-0.5" />
                  <span><strong>Medical Fitness:</strong> Must clear standard GCC GAMCA medical examination.</span>
                </li>
              </ul>
            </div>

            {/* Benefits & Provided Facilities */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-[#26075D] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#FFC900]" />
                <span>Company Provided Benefits & Employment Facilities</span>
              </h2>
              {job.accommodation_details && (
                <div className="p-3 bg-[#F7F4FC] rounded-xl border border-[#DDD0F3] text-xs text-slate-700">
                  <strong>Accommodation:</strong> {job.accommodation_details}
                </div>
              )}
              {job.transportation_details && (
                <div className="p-3 bg-[#F7F4FC] rounded-xl border border-[#DDD0F3] text-xs text-slate-700">
                  <strong>Transportation:</strong> {job.transportation_details}
                </div>
              )}
              {job.benefits && (
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-2">
                  {job.benefits}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl border border-[#DDD0F3] p-5 sm:p-6 space-y-4 shadow-xs">
              <h3 className="font-black text-[#26075D] text-sm sm:text-base border-b border-slate-100 pb-2.5">
                Overview & Quick Apply
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Target Country:</span>
                  <span className="font-bold text-[#26075D]">{job.country}</span>
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
                  <span className="text-slate-400">Monthly Salary:</span>
                  <span className="font-black text-[#321078]">{job.salary}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Open for Submissions
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3 px-4 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <FileText className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Your Resume</span>
              </button>

              <div className="p-3 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3] text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#321078] shrink-0 mt-0.5" />
                <span>
                  All candidate data is handled confidentially and submitted directly to the verified overseas sponsor.
                </span>
              </div>
            </div>

            {/* Related Jobs in Same Country */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
                <h3 className="font-black text-[#26075D] text-xs sm:text-sm border-b border-slate-100 pb-2">
                  More Vacancies in {job.country}
                </h3>
                <div className="space-y-2.5">
                  {relatedJobs.map((r) => (
                    <Link
                      key={r.id}
                      to={`/jobs/${r.id}`}
                      className="block p-3 rounded-2xl bg-[#F7F4FC] hover:bg-[#DDD0F3]/30 border border-[#DDD0F3]/60 transition-colors group"
                    >
                      <h4 className="text-xs font-black text-[#26075D] group-hover:text-[#5015A8] line-clamp-1">
                        {r.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>{r.location}</span>
                        <span className="font-bold text-[#321078]">{r.salary}</span>
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
