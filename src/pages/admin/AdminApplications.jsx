import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Download, 
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-charcoal-800 tracking-tight">
            Candidate Applications & Resumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review candidate qualifications, download resumes, and update recruitment status.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-surface-border px-3.5 py-2 rounded-xl shadow-xs self-start sm:self-auto">
          Total Candidates: <strong className="text-primary-700 font-bold">{applications.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-surface-section rounded-xl border border-surface-border">
            {['All', 'pending', 'shortlisted', 'selected', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-charcoal-800'
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
              className="w-full pl-10 pr-4 py-2 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-surface-section hover:bg-slate-200 text-charcoal-800 font-bold text-xs rounded-xl transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-section border-b border-surface-border text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                  <th className="py-3.5 px-4">Applied Job</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-section transition-colors">
                    {/* Candidate Name & Contact */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-charcoal-800 text-sm">
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
                          <span className="truncate max-w-[150px]">{app.email}</span>
                        </span>
                      </div>
                    </td>

                    {/* Job Applied For */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-charcoal-800 max-w-xs truncate">
                        {app.job_title || 'Overseas Vacancy'}
                      </div>
                      {app.job_country && (
                        <span className="text-[11px] text-primary-600 font-bold">
                          {app.job_country}
                        </span>
                      )}
                    </td>

                    {/* Experience & Location */}
                    <td className="py-4 px-4 whitespace-nowrap text-charcoal-800">
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
                            ? 'bg-secondary-50 text-secondary-800 border-secondary-200'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : app.status === 'rejected'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
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
                      {app.resume_path ? (
                        <button
                          type="button"
                          onClick={() => applicationService.downloadResume(app.id, app.candidate_name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
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
                          className="px-3 py-1 rounded-lg text-xs font-bold text-slate-700 bg-surface-section hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="p-10 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-charcoal-800">No Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No candidate applications match your current status filter or search query.
            </p>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 shadow-2xl relative animate-fadeIn border border-surface-border">
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-secondary-600">
                  Candidate Profile
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-charcoal-800">
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
              <div className="p-3.5 rounded-xl bg-surface-section border border-surface-border space-y-0.5">
                <span className="text-xs font-semibold text-slate-500 block">Applied Position</span>
                <span className="font-bold text-charcoal-800 block text-sm">
                  {selectedCandidate.job_title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-surface-border">
                  <span className="text-slate-400 block mb-0.5">Mobile Phone</span>
                  <a href={`tel:${selectedCandidate.mobile}`} className="font-bold text-primary-600">
                    {selectedCandidate.mobile}
                  </a>
                </div>
                <div className="p-3 rounded-xl border border-surface-border">
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <a href={`mailto:${selectedCandidate.email}`} className="font-bold text-primary-600 truncate block">
                    {selectedCandidate.email}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-surface-border">
                  <span className="text-slate-400 block mb-0.5">Total Experience</span>
                  <span className="font-bold text-charcoal-800">{selectedCandidate.experience}</span>
                </div>
                <div className="p-3 rounded-xl border border-surface-border">
                  <span className="text-slate-400 block mb-0.5">Current Location</span>
                  <span className="font-bold text-charcoal-800">{selectedCandidate.current_location}</span>
                </div>
              </div>

              {/* Status Update In Modal */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                  Update Candidate Application Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['pending', 'shortlisted', 'selected', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedCandidate.id, st)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedCandidate.status === st
                          ? 'bg-primary-500 text-white shadow-xs'
                          : 'bg-surface-section text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume download */}
              {selectedCandidate.resume_path && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => applicationService.downloadResume(selectedCandidate.id, selectedCandidate.candidate_name)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Uploaded Resume File</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-surface-border">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-charcoal-800">Delete Application?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this candidate application record?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-surface-section hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
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
