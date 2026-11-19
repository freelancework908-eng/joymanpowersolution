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
  Eye, 
  Sparkles, 
  Image as ImageIcon, 
  Film,
  Images,
  Settings
} from 'lucide-react'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { bannerService } from '../../services/bannerService'
import { reviewService } from '../../services/reviewService'
import { galleryService } from '../../services/galleryService'

export const AdminDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [activeBanner, setActiveBanner] = useState(null)
  const [reviews, setReviews] = useState([])
  const [galleryCount, setGalleryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [jobsRes, appsRes, bannerRes, reviewsRes, galleryRes] = await Promise.all([
      jobService.getAllJobs(),
      applicationService.getAllApplications(),
      bannerService.getActiveBanner(),
      reviewService.getAllReviews(),
      galleryService.getAllGallery()
    ])

    if (jobsRes.data) setJobs(jobsRes.data)
    if (appsRes.data) setApplications(appsRes.data)
    if (bannerRes.data) setActiveBanner(bannerRes.data)
    if (reviewsRes.data) setReviews(reviewsRes.data)
    if (galleryRes.data) setGalleryCount(galleryRes.data.length)
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner / Welcome */}
      <div className="bg-[#26075D] text-white rounded-3xl p-6 sm:p-8 border border-[#3E0F87] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFC900] text-xs font-black border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC900]" />
            <span>Recruitment Operations Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor verified vacancies for UAE (Dubai) & Saudi Arabia, candidate applications, gallery, and reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/jobs?action=new"
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/admin/banner"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-[#FFC900]" />
            <span>Hero Banner</span>
          </Link>
          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-colors"
          >
            <Film className="w-4 h-4 text-[#FFC900]" />
            <span>Reviews</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-colors"
          >
            <Images className="w-4 h-4 text-[#FFC900]" />
            <span>Gallery</span>
          </Link>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-colors"
          >
            <Settings className="w-4 h-4 text-[#FFC900]" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Total Vacancies
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#26075D] mt-1 block">
              {totalJobs}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 block truncate">
              🇦🇪 {uaeJobs} UAE | 🇸🇦 {saudiJobs} Saudi
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Published Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Published Jobs
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
              {publishedJobs}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold mt-0.5 block">
              Live on Website
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Candidate Resumes
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#321078] mt-1 block">
              {totalApplications}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-700 font-bold mt-0.5 block">
              {pendingApplications} Pending review
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F4FC] text-[#5015A8] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Activity Gallery Photos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Activity Gallery
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#26075D] mt-1 block">
              {galleryCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#321078] font-bold mt-0.5 block">
              Documented Drives
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
            <Images className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Content Status: Homepage Banner & Customer Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#321078]" />
                <h3 className="font-black text-[#26075D] text-sm sm:text-base">Homepage Hero Banner</h3>
              </div>
              <p className="text-xs text-slate-500">
                {activeBanner?.is_active ? 'Active hero banner displayed on homepage' : 'No banner currently active'}
              </p>
            </div>
            {activeBanner?.is_active ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Inactive
              </span>
            )}
          </div>

          {activeBanner?.image_url && (
            <div className="relative h-24 rounded-xl overflow-hidden bg-[#26075D] border border-slate-200">
              <img
                src={activeBanner.image_url}
                alt="Active banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#26075D]/90 via-[#26075D]/50 to-transparent flex items-center p-3">
                <span className="text-xs text-white font-bold line-clamp-1">
                  {activeBanner.heading || 'Active Homepage Banner'}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Updated: {activeBanner?.updated_at ? new Date(activeBanner.updated_at).toLocaleDateString() : 'N/A'}
            </span>
            <Link
              to="/admin/banner"
              className="text-xs font-bold text-[#321078] hover:text-[#26075D] flex items-center gap-1"
            >
              <span>Manage Banner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Customer Reviews Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#321078]" />
                <h3 className="font-black text-[#26075D] text-sm sm:text-base">Candidate Video Testimonials</h3>
              </div>
              <p className="text-xs text-slate-500">
                Vertical 9:16 Shorts & Client Testimonials
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F7F4FC] text-[#321078] border border-[#DDD0F3] text-xs font-bold">
              {reviews.filter((r) => r.status === 'published').length} Live Published
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
              <span className="text-base font-black text-[#26075D]">{reviews.length}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">🇦🇪 UAE</span>
              <span className="text-base font-black text-[#26075D]">
                {reviews.filter((r) => r.country === 'UAE').length}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">🇸🇦 Saudi</span>
              <span className="text-base font-black text-[#26075D]">
                {reviews.filter((r) => r.country === 'Saudi Arabia').length}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Only published videos appear publicly
            </span>
            <Link
              to="/admin/reviews"
              className="text-xs font-bold text-[#321078] hover:text-[#26075D] flex items-center gap-1"
            >
              <span>Manage Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#321078]" />
              <h2 className="font-black text-[#26075D] text-sm sm:text-base">Recent Candidate Applications</h2>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-[#321078] hover:text-[#26075D] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length > 0 ? (
              applications.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#26075D] text-xs sm:text-sm truncate">
                        {app.candidate_name}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 truncate">
                      Applied for: <strong className="text-slate-800">{app.job_title}</strong>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{app.mobile}</span>
                      <span>•</span>
                      <span>{app.current_location}</span>
                    </div>
                  </div>

                  <Link
                    to="/admin/applications"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#F7F4FC] text-slate-600 hover:text-[#321078] transition-colors shrink-0"
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
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#321078]" />
              <h2 className="font-black text-[#26075D] text-sm sm:text-base">Recent Vacancies</h2>
            </div>
            <Link
              to="/admin/jobs"
              className="text-xs font-bold text-[#321078] hover:text-[#26075D] flex items-center gap-1"
            >
              <span>Manage Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {jobs.length > 0 ? (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">
                        {job.country === 'UAE' ? '🇦🇪' : '🇸🇦'}
                      </span>
                      <h4 className="font-bold text-[#26075D] text-xs truncate">
                        {job.title}
                      </h4>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="font-bold text-[#321078]">{job.salary}</span>
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
