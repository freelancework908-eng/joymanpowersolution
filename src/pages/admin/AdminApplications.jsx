import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  X,
  Trash2
} from 'lucide-react'
import { applicationService } from '../../services/applicationService'

export const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    setLoading(true)
    const { data } = await applicationService.getAllApplications({
      status: statusFilter,
      search: searchQuery
    })
    if (data) setApplications(data)
    setLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadApplications()
  }

  const handleStatusChange = async (appId, newStatus) => {
    await applicationService.updateApplicationStatus(appId, newStatus)
    loadApplications()
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus }))
    }
  }

  const handleDelete = async (id) => {
    await applicationService.deleteApplication(id)
    setDeleteConfirmId(null)
    if (selectedCandidate?.id === id) setSelectedCandidate(null)
    loadApplications()
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Applications & Resumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review candidate qualifications, download resumes, and track status.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
          Total Candidates: <strong className="text-brand-900 font-bold">{applications.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            {['All', 'pending', 'shortlisted', 'selected', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search candidate name, email, mobile, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-800 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                  <th className="py-3.5 px-4">Applied Job</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate Name & Contact */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 text-sm">
                        {app.candidate_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{app.mobile}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{app.email}</span>
                        </span>
                      </div>
                    </td>

                    {/* Job Applied For */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 max-w-xs truncate">
                        {app.job_title || 'Overseas Vacancy'}
                      </div>
                      {app.job_country && (
                        <span className="text-[11px] text-brand-800 font-medium">
                          {app.job_country}
                        </span>
                      )}
                    </td>

                    {/* Experience & Location */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-700">
                      <div>{app.experience}</div>
                      <div className="text-[11px] text-slate-400">{app.current_location}</div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-xs">
                      {new Date(app.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          app.status === 'selected'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Resume File Link */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {app.resume_url && app.resume_url !== '#' ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                          <FileText className="w-3.5 h-3.5" />
                          <span>On File</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCandidate(app)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No candidate applications match your current status filter or search query.
            </p>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-gold-600">
                  Candidate Profile
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedCandidate.candidate_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Applied Position</span>
                <span className="font-bold text-slate-900 block text-sm">
                  {selectedCandidate.job_title}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Mobile Phone</span>
                  <a href={`tel:${selectedCandidate.mobile}`} className="font-bold text-brand-800">
                    {selectedCandidate.mobile}
                  </a>
                </div>
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <a href={`mailto:${selectedCandidate.email}`} className="font-bold text-brand-800 truncate block">
                    {selectedCandidate.email}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Total Experience</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.experience}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Current Location</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.current_location}</span>
                </div>
              </div>

              {/* Status Update In Modal */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Candidate Application Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['pending', 'shortlisted', 'selected', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedCandidate.id, st)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        selectedCandidate.status === st
                          ? 'bg-brand-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume download */}
              {selectedCandidate.resume_url && selectedCandidate.resume_url !== '#' && (
                <div className="pt-2">
                  <a
                    href={selectedCandidate.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Uploaded Resume File</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Delete Application?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this candidate application record?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
