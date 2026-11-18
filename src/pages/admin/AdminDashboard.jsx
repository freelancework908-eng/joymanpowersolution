import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  MapPin, 
  FileText,
  Eye,
  Building,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'

export const AdminDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [jobsRes, appsRes] = await Promise.all([
      jobService.getAllJobs(),
      applicationService.getAllApplications()
    ])

    if (jobsRes.data) setJobs(jobsRes.data)
    if (appsRes.data) setApplications(appsRes.data)
    setLoading(false)
  }

  const totalJobs = jobs.length
  const publishedJobs = jobs.filter((j) => j.status === 'published').length
  const closedJobs = jobs.filter((j) => j.status === 'closed').length
  const draftJobs = jobs.filter((j) => j.status === 'draft').length
  const totalApplications = applications.length
  const pendingApplications = applications.filter((a) => a.status === 'pending').length

  const uaeJobs = jobs.filter((j) => j.country === 'UAE').length
  const saudiJobs = jobs.filter((j) => j.country === 'Saudi Arabia').length

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner / Welcome */}
      <div className="bg-brand-950 text-white rounded-2xl p-6 sm:p-8 border border-brand-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900 text-gold-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruitment Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor active vacancies for Dubai (UAE) & Saudi Arabia and review candidate resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs?action=new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-brand-700 transition-colors"
          >
            <Users className="w-4 h-4 text-brand-300" />
            <span>View Resumes</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Total Jobs
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
              {totalJobs}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              🇦🇪 {uaeJobs} UAE | 🇸🇦 {saudiJobs} Saudi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Published Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Published Jobs
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
              {publishedJobs}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              Live on Public Site
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Closed / Draft Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Closed Jobs
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-700 mt-1 block">
              {closedJobs}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {draftJobs} Drafts saved
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Total Applications
            </span>
            <span className="text-2xl sm:text-3xl font-black text-brand-900 mt-1 block">
              {totalApplications}
            </span>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">
              {pendingApplications} Pending review
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-800" />
              <h2 className="font-bold text-slate-900 text-base">Recent Candidate Applications</h2>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length > 0 ? (
              applications.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {app.candidate_name}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 truncate">
                      Applied for: <strong className="text-slate-700">{app.job_title}</strong>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>{app.mobile}</span>
                      <span>•</span>
                      <span>{app.current_location}</span>
                    </div>
                  </div>

                  <Link
                    to="/admin/applications"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-800 transition-colors shrink-0"
                    title="View candidate"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No candidate applications submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Jobs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-800" />
              <h2 className="font-bold text-slate-900 text-base">Recent Vacancies</h2>
            </div>
            <Link
              to="/admin/jobs"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900 flex items-center gap-1"
            >
              <span>Manage Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {jobs.length > 0 ? (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">
                        {job.country === 'UAE' ? '🇦🇪' : '🇸🇦'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {job.title}
                      </h4>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-brand-900">{job.salary}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      job.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : job.status === 'closed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No vacancies created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
