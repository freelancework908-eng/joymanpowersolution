import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  X,
  FileCheck,
  Eye
} from 'lucide-react'
import { jobService } from '../../services/jobService'

const CATEGORIES = [
  'Facility Management',
  'Construction & Engineering',
  'Oil & Gas',
  'Hospitality & Catering',
  'Logistics & Transport',
  'Healthcare & Nursing',
  'Information Technology',
  'Retail & Sales'
]

export const AdminJobs = () => {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    country: 'UAE',
    location: '',
    category: 'Facility Management',
    salary: '',
    vacancies: 1,
    experience: '',
    qualification: '',
    description: '',
    responsibilities: '',
    benefits: '',
    deadline: '',
    status: 'published'
  })

  useEffect(() => {
    loadJobs()
  }, [statusFilter, countryFilter])

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal()
    }
  }, [searchParams])

  const loadJobs = async () => {
    setLoading(true)
    const { data } = await jobService.getAllJobs({
      status: statusFilter,
      country: countryFilter,
      search: searchQuery
    })
    if (data) setJobs(data)
    setLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadJobs()
  }

  const openAddModal = () => {
    setEditingJob(null)
    setFormData({
      title: '',
      country: 'UAE',
      location: 'Dubai, UAE',
      category: 'Facility Management',
      salary: '',
      vacancies: 5,
      experience: '2-5 Years',
      qualification: 'Diploma / Relevant Trade Certificate',
      description: '',
      responsibilities: '',
      benefits: 'Free Accommodation, Transportation, Medical Insurance, Direct Company Employment Visa',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'published'
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title || '',
      country: job.country || 'UAE',
      location: job.location || '',
      category: job.category || 'Facility Management',
      salary: job.salary || '',
      vacancies: job.vacancies || 1,
      experience: job.experience || '',
      qualification: job.qualification || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      benefits: job.benefits || '',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      status: job.status || 'draft'
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCountrySelect = (c) => {
    setFormData((prev) => ({
      ...prev,
      country: c,
      location: c === 'UAE' ? 'Dubai, UAE' : 'Riyadh, Saudi Arabia'
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim()) {
      setFormError('Job title is required.')
      return
    }
    if (!formData.salary.trim()) {
      setFormError('Salary details are required.')
      return
    }
    if (!formData.description.trim()) {
      setFormError('Job description is required.')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingJob) {
        const { error } = await jobService.updateJob(editingJob.id, formData)
        if (error) throw error
      } else {
        const { error } = await jobService.createJob(formData)
        if (error) throw error
      }
      setIsModalOpen(false)
      loadJobs()
    } catch (err) {
      setFormError(err.message || 'Failed to save job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusToggle = async (job, newStatus) => {
    await jobService.updateJobStatus(job.id, newStatus)
    loadJobs()
  }

  const handleDelete = async (id) => {
    await jobService.deleteJob(id)
    setDeleteConfirmId(null)
    loadJobs()
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Vacancy Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, publish, or close vacancies for UAE (Dubai) and Saudi Arabia.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 text-gold-400" />
          <span>Add New Job Vacancy</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            {['All', 'published', 'draft', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white text-brand-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Country Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            {['All', 'UAE', 'Saudi Arabia'].map((ct) => (
              <button
                key={ct}
                onClick={() => setCountryFilter(ct)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  countryFilter === ct
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ct === 'All' ? 'All Countries' : ct === 'UAE' ? '🇦🇪 UAE' : '🇸🇦 Saudi'}
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
              placeholder="Search by title, location, or trade category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-800 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading vacancies...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Job Title & Details</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Vacancies</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          job.country === 'UAE'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span>{job.country === 'UAE' ? '🇦🇪' : '🇸🇦'}</span>
                        <span>{job.country}</span>
                      </span>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-4 whitespace-nowrap font-semibold text-brand-900">
                      {job.salary}
                    </td>

                    {/* Vacancies */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {job.vacancies || 1}
                    </td>

                    {/* Status with Quick Toggle Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusToggle(job, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          job.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : job.status === 'closed'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(job.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Job"
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
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Job Vacancies Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No vacancies match your current status or country filter. Try resetting or create a new job.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingJob ? 'Edit Overseas Job Vacancy' : 'Create New Overseas Job Vacancy'}
                </h3>
                <p className="text-xs text-slate-300">
                  Target Destination: UAE (Dubai) or Saudi Arabia
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. HVAC Maintenance Technician"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                />
              </div>

              {/* Country & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCountrySelect('UAE')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        formData.country === 'UAE'
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>🇦🇪 UAE (Dubai)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect('Saudi Arabia')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        formData.country === 'Saudi Arabia'
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>🇸🇦 Saudi Arabia</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Dubai, UAE or Riyadh, Saudi Arabia"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Salary Package <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="salary"
                    required
                    placeholder={formData.country === 'UAE' ? 'e.g. AED 3,500 - 4,200 / month' : 'e.g. SAR 3,800 - 4,500 / month'}
                    value={formData.salary}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Vacancies & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    min="1"
                    value={formData.vacancies}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    required
                    placeholder="e.g. 3-5 Years (GCC Preferred)"
                    value={formData.experience}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Qualification & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Required Qualification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    required
                    placeholder="e.g. ITI, Diploma, or Degree"
                    value={formData.qualification}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Status
                </label>
                <div className="flex gap-4">
                  {['published', 'draft', 'closed'].map((st) => (
                    <label key={st} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 capitalize cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={st}
                        checked={formData.status === st}
                        onChange={handleFormChange}
                        className="text-brand-800"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Overview of the company, role, and main duties..."
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                ></textarea>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  rows={3}
                  placeholder="• Daily maintenance and repairs&#10;• Coordinate with site engineer..."
                  value={formData.responsibilities}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                ></textarea>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Benefits Provided
                </label>
                <input
                  type="text"
                  name="benefits"
                  placeholder="Free Accommodation, Food Allowance, Medical Insurance, Visa Provided"
                  value={formData.benefits}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-700 focus:bg-white"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Job...</span>
                    </>
                  ) : (
                    <span>{editingJob ? 'Update Job Vacancy' : 'Publish Job Vacancy'}</span>
                  )}
                </button>
              </div>
            </form>
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
            <h4 className="text-lg font-bold text-slate-900">Delete Job Vacancy?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this job vacancy? This action cannot be undone.
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
