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
  Upload,
  Eye,
  Tag,
  DollarSign,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react'
import { jobService, ALL_DEFAULT_CATEGORIES } from '../../services/jobService'
import { storageService } from '../../services/storageService'

export const AdminJobs = () => {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState(ALL_DEFAULT_CATEGORIES)
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

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [catError, setCatError] = useState('')
  const [catSuccess, setCatSuccess] = useState('')

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    country: 'UAE',
    location: '',
    category: 'Mason - Block/Plaster',
    salary: '',
    salary_currency: '',
    basic_salary: '',
    compulsory_ot_salary: '',
    vacancies: 1,
    working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
    overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours.',
    accommodation_details: 'Shared accommodation provided by company',
    transportation_details: 'Transportation provided by company',
    experience: '',
    qualification: '',
    description: '',
    responsibilities: '',
    benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
    deadline: '',
    image_url: '',
    status: 'published'
  })

  useEffect(() => {
    loadJobs()
    loadCategories()
  }, [statusFilter, countryFilter])

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal()
    }
  }, [searchParams])

  const loadCategories = async () => {
    try {
      const cats = await jobService.getCategories()
      if (cats && cats.length > 0) {
        setCategories(cats)
      } else {
        setCategories(ALL_DEFAULT_CATEGORIES)
      }
    } catch {
      setCategories(ALL_DEFAULT_CATEGORIES)
    }
  }

  const loadJobs = async () => {
    setLoading(true)
    const { data } = await jobService.getAllJobs({
      status: statusFilter,
      country: countryFilter,
      search: searchQuery
    })
    if (data && Array.isArray(data)) setJobs(data)
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
      category: categories[0] || 'Mason - Block/Plaster',
      salary: '',
      salary_currency: '',
      basic_salary: '',
      compulsory_ot_salary: '',
      vacancies: 50,
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours.',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: '2-5 Years relevant trade experience',
      qualification: 'Skilled trade certification / trade test passed',
      description: '',
      responsibilities: '',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      image_url: '',
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
      category: job.category || 'Mason - Block/Plaster',
      salary: job.salary || '',
      salary_currency: job.salary_currency || '',
      basic_salary: job.basic_salary || '',
      compulsory_ot_salary: job.compulsory_ot_salary || '',
      vacancies: job.vacancies || 1,
      working_hours: job.working_hours || '',
      overtime_details: job.overtime_details || '',
      accommodation_details: job.accommodation_details || '',
      transportation_details: job.transportation_details || '',
      experience: job.experience || '',
      qualification: job.qualification || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      benefits: job.benefits || '',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      image_url: job.image_url || '',
      status: job.status || 'draft'
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      // Auto compute total salary if basic and ot are numeric and salary is empty or matching
      if ((name === 'basic_salary' || name === 'compulsory_ot_salary') && !isNaN(Number(next.basic_salary)) && !isNaN(Number(next.compulsory_ot_salary))) {
        if (Number(next.basic_salary) > 0 && Number(next.compulsory_ot_salary) >= 0) {
          next.salary = String(Number(next.basic_salary) + Number(next.compulsory_ot_salary))
        }
      }
      return next
    })
  }

  const handleCountrySelect = (c) => {
    setFormData((prev) => ({
      ...prev,
      country: c,
      location: c === 'UAE' ? 'Dubai, UAE' : 'Riyadh, Saudi Arabia'
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setUploadProgress(0)

    try {
      const res = await storageService.uploadJobImage(file, (p) => setUploadProgress(p))
      if (res.error) throw res.error
      if (res.url) {
        setFormData((prev) => ({ ...prev, image_url: res.url }))
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim()) {
      setFormError('Job title is required.')
      return
    }
    if (!formData.salary.trim()) {
      setFormError('Total salary details are required.')
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

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setCatError('')
    setCatSuccess('')

    if (!newCatName.trim()) {
      setCatError('Category name is required.')
      return
    }

    try {
      const res = await jobService.createCategory({ name: newCatName.trim() })
      if (res.error) throw res.error
      setCatSuccess(`Category "${newCatName.trim()}" added successfully!`)
      setNewCatName('')
      loadCategories()
    } catch (err) {
      setCatError(err.message || 'Failed to add category')
    }
  }

  const handleDeleteCategory = async (catName) => {
    if (!window.confirm(`Remove category "${catName}"?`)) return
    try {
      // Find id if available from getAdminCategories
      const res = await jobService.getAdminCategories()
      const match = res.data?.find((c) => c.name === catName)
      if (match && match.id) {
        await jobService.deleteCategory(match.id)
      }
      loadCategories()
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#26075D] tracking-tight">
            Job Vacancy & Manpower Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage UAE (Dubai) and Saudi Arabia vacancies, exact salary figures, OT hours, and trade categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#F7F4FC] hover:bg-[#DDD0F3]/40 text-[#321078] border border-[#DDD0F3] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            <Tag className="w-4 h-4 text-[#321078]" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 shrink-0 uppercase tracking-wide"
          >
            <PlusCircle className="w-4 h-4 text-[#26075D]" />
            <span>Add New Vacancy</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-[#F7F4FC] rounded-xl border border-[#DDD0F3]">
            {['All', 'published', 'draft', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-[#321078] text-[#FFC900] shadow-xs'
                    : 'text-slate-600 hover:text-[#26075D]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Country Tabs */}
          <div className="inline-flex p-1 bg-[#F7F4FC] rounded-xl border border-[#DDD0F3]">
            {['All', 'UAE', 'Saudi Arabia'].map((ct) => (
              <button
                key={ct}
                onClick={() => setCountryFilter(ct)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  countryFilter === ct
                    ? 'bg-[#26075D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#26075D]'
                }`}
              >
                {ct === 'All' ? 'All Countries' : ct === 'UAE' ? '🇦🇪 UAE' : '🇸🇦 Saudi'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, location, or trade category (e.g. Mason, Scaffolder, Driver)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#321078] hover:bg-[#26075D] text-[#FFC900] font-bold text-xs rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#321078] mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading vacancies from TiDB...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#F7F4FC] border-b border-[#DDD0F3] text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Job Title & Trade</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Salary Breakdown</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Hours / OT</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    {/* Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-black text-[#26075D] text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#321078] bg-[#F7F4FC] px-2 py-0.5 rounded border border-[#DDD0F3]">
                          {job.category}
                        </span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                          job.country === 'UAE'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <span>{job.country === 'UAE' ? '🇦🇪' : '🇸🇦'}</span>
                        <span>{job.country}</span>
                      </span>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-black text-[#321078] text-sm">
                        {job.salary_currency ? `${job.salary_currency} ${job.salary}` : job.salary}
                      </div>
                      {job.basic_salary && job.compulsory_ot_salary && (
                        <div className="text-[10px] text-slate-500">
                          8h: {job.basic_salary} + OT: {job.compulsory_ot_salary}
                        </div>
                      )}
                    </td>

                    {/* Vacancies / Quantity */}
                    <td className="py-4 px-4 whitespace-nowrap font-black text-slate-800">
                      <span className="bg-[#F7F4FC] px-2.5 py-1 rounded-lg border border-[#DDD0F3]">
                        {job.vacancies || 1}
                      </span>
                    </td>

                    {/* Working Hours / OT */}
                    <td className="py-4 px-4 text-xs text-slate-600 max-w-[160px] truncate" title={job.working_hours}>
                      {job.working_hours ? job.working_hours : '10 hrs/day'}
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
                          onClick={() => {
                            setEditingJob(job)
                            setFormData({
                              ...job,
                              salary_currency: job.salary_currency || '',
                              basic_salary: job.basic_salary || '',
                              compulsory_ot_salary: job.compulsory_ot_salary || '',
                              working_hours: job.working_hours || '',
                              overtime_details: job.overtime_details || '',
                              accommodation_details: job.accommodation_details || '',
                              transportation_details: job.transportation_details || '',
                              image_url: job.image_url || '',
                              deadline: job.deadline ? job.deadline.split('T')[0] : ''
                            })
                            setIsPreviewOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#321078] hover:bg-[#F7F4FC] transition-colors"
                          title="Preview Job"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#321078] hover:bg-[#F7F4FC] transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(job.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="p-10 text-center space-y-2">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#26075D]">No Job Vacancies Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No vacancies match your current status or country filter.
            </p>
          </div>
        )}
      </div>

      {/* Category Management Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#DDD0F3]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#321078]" />
                <h3 className="text-base font-black text-[#26075D]">Manage Job Categories</h3>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {catError}
              </div>
            )}
            {catSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                {catSuccess}
              </div>
            )}

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="New Category name (e.g. DRIVER, ENGINEER, POCKET PACKER)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#321078]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#321078] hover:bg-[#26075D] text-[#FFC900] font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Add Category
              </button>
            </form>

            {/* Current Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Categories ({categories.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 bg-[#F7F4FC] text-[#26075D] border border-[#DDD0F3] px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#DDD0F3] overflow-hidden my-4 sm:my-8 animate-fadeIn">
            <div className="bg-[#26075D] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {editingJob ? 'Edit Overseas Job Vacancy' : 'Create New Overseas Job Vacancy'}
                </h3>
                <p className="text-xs text-[#FFC900]">
                  UAE (Dubai) & Saudi Arabia • Full Manpower Specification & Conditions
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Mason - Block/Plaster, Tile Mason, Driver..."
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Job Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-[#321078]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Country Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCountrySelect('UAE')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        formData.country === 'UAE'
                          ? 'bg-[#321078] text-[#FFC900] border-[#321078]'
                          : 'bg-[#F7F4FC] text-slate-700 border-[#DDD0F3] hover:bg-slate-100'
                      }`}
                    >
                      <span>🇦🇪 UAE (Dubai)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect('Saudi Arabia')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        formData.country === 'Saudi Arabia'
                          ? 'bg-[#321078] text-[#FFC900] border-[#321078]'
                          : 'bg-[#F7F4FC] text-slate-700 border-[#DDD0F3] hover:bg-slate-100'
                      }`}
                    >
                      <span>🇸🇦 Saudi Arabia</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Specific Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Dubai, UAE or Riyadh, Saudi Arabia"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#321078]"
                  />
                </div>
              </div>

              {/* Quantity / Vacancies & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Number of Vacancies / Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    min="1"
                    required
                    placeholder="e.g. 150, 100, 50"
                    value={formData.vacancies}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Salary Currency (Configurable)
                  </label>
                  <select
                    name="salary_currency"
                    value={formData.salary_currency}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-[#321078]"
                  >
                    <option value="">None / As Listed (Exact Figure)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>

              {/* Salary Breakdown: 8h basic, 2h compulsory OT, Total for 10h */}
              <div className="p-4 bg-[#F7F4FC] rounded-2xl border border-[#DDD0F3] space-y-3">
                <span className="text-xs font-black text-[#26075D] block">
                  Salary Breakdown (Preserve exact figures from recruitment document)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Monthly Salary (8 hours)
                    </label>
                    <input
                      type="text"
                      name="basic_salary"
                      placeholder="e.g. 1500, 1600, 1400"
                      value={formData.basic_salary}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white border border-[#DDD0F3] rounded-xl text-xs font-black text-[#26075D] focus:outline-none focus:border-[#321078]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Compulsory OT (2 hours)
                    </label>
                    <input
                      type="text"
                      name="compulsory_ot_salary"
                      placeholder="e.g. 200"
                      value={formData.compulsory_ot_salary}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white border border-[#DDD0F3] rounded-xl text-xs font-black text-[#26075D] focus:outline-none focus:border-[#321078]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Total Salary (10 hours) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      required
                      placeholder="e.g. 1700, 1800, 1600"
                      value={formData.salary}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-white border border-[#DDD0F3] rounded-xl text-xs font-black text-[#321078] focus:outline-none focus:border-[#321078]"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours & Overtime Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="working_hours"
                    placeholder="e.g. 10 hours per day (8 hours + 2 hours compulsory OT)"
                    value={formData.working_hours}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Overtime Details
                  </label>
                  <input
                    type="text"
                    name="overtime_details"
                    placeholder="e.g. Overtime extra over 10 hours as per UAE labour laws"
                    value={formData.overtime_details}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>
              </div>

              {/* Accommodation & Transportation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Accommodation Details
                  </label>
                  <input
                    type="text"
                    name="accommodation_details"
                    placeholder="e.g. Shared accommodation provided by company"
                    value={formData.accommodation_details}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Transportation Details
                  </label>
                  <input
                    type="text"
                    name="transportation_details"
                    placeholder="e.g. Transportation provided by company"
                    value={formData.transportation_details}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>
              </div>

              {/* Experience & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Experience Requirements
                  </label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 2-5 Years relevant trade experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Qualification Requirements
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="e.g. Trade certificate / practical test passed"
                    value={formData.qualification}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>
              </div>

              {/* Deadline & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26075D] mb-1">
                    Publication Status
                  </label>
                  <div className="flex gap-4 pt-2">
                    {['published', 'draft', 'closed'].map((st) => (
                      <label key={st} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 capitalize cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={st}
                          checked={formData.status === st}
                          onChange={handleFormChange}
                          className="text-[#321078]"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Image Upload or URL */}
              <div>
                <label className="block text-xs font-bold text-[#26075D] mb-1">
                  Job Banner / Document Image (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL or upload file below..."
                    value={formData.image_url}
                    onChange={handleFormChange}
                    className="flex-1 px-3.5 py-2 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#321078]"
                  />
                  <label className="px-4 py-2 bg-[#321078] hover:bg-[#26075D] text-white text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? `${uploadProgress}%` : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#26075D] mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Overview of the vacancy and candidate requirements..."
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                ></textarea>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-bold text-[#26075D] mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  rows={3}
                  placeholder="• Trade responsibilities&#10;• Site coordination..."
                  value={formData.responsibilities}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                ></textarea>
              </div>

              {/* Employment Benefits and Conditions */}
              <div>
                <label className="block text-xs font-bold text-[#26075D] mb-1">
                  Employment Conditions & Benefits
                </label>
                <textarea
                  name="benefits"
                  rows={4}
                  placeholder="Overtime extra over 10 hours as per UAE labour laws. Joining tickets from India only. Visa provided..."
                  value={formData.benefits}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F4FC] border border-[#DDD0F3] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078]"
                ></textarea>
              </div>

              {/* Actions & Preview */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#321078] bg-[#F7F4FC] hover:bg-[#DDD0F3]/40 border border-[#DDD0F3] rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Vacancy</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all disabled:opacity-60 flex items-center gap-2 active:scale-95 uppercase tracking-wide"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#26075D]" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingJob ? 'Update Vacancy' : 'Publish Vacancy'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-[#DDD0F3] my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#321078]" />
                <h3 className="text-base font-black text-[#26075D]">Public Website Preview</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#321078] bg-white px-3 py-1 rounded-full border border-[#DDD0F3]">
                    {formData.country === 'UAE' ? '🇦🇪 UAE – Dubai' : '🇸🇦 Saudi Arabia'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{formData.category}</span>
                </div>

                <h4 className="text-lg font-black text-[#26075D]">{formData.title || 'Job Title'}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>📍 {formData.location || 'Location'}</span>
                  <span>👥 {formData.vacancies || 1} Vacancies</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DDD0F3] flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Offered Salary:</span>
                  <span className="text-sm font-black text-[#321078]">
                    {formData.salary_currency ? `${formData.salary_currency} ${formData.salary}` : formData.salary}
                  </span>
                </div>

                {formData.basic_salary && formData.compulsory_ot_salary && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">8h Basic:</span>
                      <strong className="text-slate-700">{formData.basic_salary}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">2h Compulsory OT:</span>
                      <strong className="text-slate-700">{formData.compulsory_ot_salary}</strong>
                    </div>
                    <div className="p-2 bg-[#321078] text-white rounded-lg">
                      <span className="text-[10px] text-[#FFC900] block">10h Total:</span>
                      <strong className="text-white">{formData.salary}</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <strong className="text-[#26075D]">Description:</strong>
                  <p className="whitespace-pre-line mt-0.5">{formData.description}</p>
                </div>
                {formData.benefits && (
                  <div>
                    <strong className="text-[#26075D]">Conditions & Benefits:</strong>
                    <p className="whitespace-pre-line mt-0.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {formData.benefits}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2.5 bg-[#321078] hover:bg-[#26075D] text-[#FFC900] font-black text-xs rounded-xl shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#26075D]">Delete Job Vacancy?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this job vacancy from TiDB? This action cannot be undone.
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
