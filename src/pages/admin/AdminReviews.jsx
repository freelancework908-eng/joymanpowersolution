import React, { useState, useEffect, useRef } from 'react'
import { 
  Film, 
  Video, 
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause, 
  UploadCloud, 
  AlertCircle, 
  Loader2, 
  X, 
  Check, 
  Eye, 
  Sparkles,
  Camera,
  MapPin,
  Volume2,
  VolumeX
} from 'lucide-react'
import { reviewService } from '../../services/reviewService'
import { storageService } from '../../services/storageService'

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

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Video Preview Modal
  const [previewModalReview, setPreviewModalReview] = useState(null)

  // Upload progress states
  const [videoProgress, setVideoProgress] = useState(0)
  const [thumbProgress, setThumbProgress] = useState(0)
  const [selectedVideoFile, setSelectedVideoFile] = useState(null)
  const [selectedThumbFile, setSelectedThumbFile] = useState(null)
  const [localVideoPreviewUrl, setLocalVideoPreviewUrl] = useState('')
  const [localThumbPreviewUrl, setLocalThumbPreviewUrl] = useState('')
  const [isCapturingThumb, setIsCapturingThumb] = useState(false)

  const videoInputRef = useRef(null)
  const thumbInputRef = useRef(null)

  // Form State
  const [formData, setFormData] = useState({
    candidate_name: '',
    country: 'UAE',
    job_category: 'Facility Management',
    testimonial_title: '',
    video_url: '',
    thumbnail_url: '',
    status: 'published'
  })

  useEffect(() => {
    loadReviews()
  }, [statusFilter, countryFilter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const { data } = await reviewService.getAllReviews({
        status: statusFilter,
        country: countryFilter,
        search: searchQuery
      })
      if (data) setReviews(data)
    } catch (err) {
      console.warn('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadReviews()
  }

  const openAddModal = () => {
    setEditingReview(null)
    setFormData({
      candidate_name: '',
      country: 'UAE',
      job_category: 'Facility Management',
      testimonial_title: '',
      video_url: '',
      thumbnail_url: '',
      status: 'published'
    })
    setSelectedVideoFile(null)
    setSelectedThumbFile(null)
    setLocalVideoPreviewUrl('')
    setLocalThumbPreviewUrl('')
    setVideoProgress(0)
    setThumbProgress(0)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (review) => {
    setEditingReview(review)
    setFormData({
      candidate_name: review.candidate_name || '',
      country: review.country || 'UAE',
      job_category: review.job_category || 'Facility Management',
      testimonial_title: review.testimonial_title || '',
      video_url: review.video_url || '',
      thumbnail_url: review.thumbnail_url || '',
      status: review.status || 'published'
    })
    setSelectedVideoFile(null)
    setSelectedThumbFile(null)
    setLocalVideoPreviewUrl(review.video_url || '')
    setLocalThumbPreviewUrl(review.thumbnail_url || '')
    setVideoProgress(0)
    setThumbProgress(0)
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingReview(null)
    setSelectedVideoFile(null)
    setSelectedThumbFile(null)
    setLocalVideoPreviewUrl('')
    setLocalThumbPreviewUrl('')
    setVideoProgress(0)
    setThumbProgress(0)
    setFormError('')
  }

  // Handle Video file change with strict MP4 & 50MB check
  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = storageService.validateVideo(file)
    if (!validation.valid) {
      setFormError(validation.error)
      return
    }

    setFormError('')
    setSelectedVideoFile(file)
    const objUrl = URL.createObjectURL(file)
    setLocalVideoPreviewUrl(objUrl)

    // Automatically try to extract a thumbnail if no thumbnail is set yet
    if (!formData.thumbnail_url && !selectedThumbFile) {
      try {
        setIsCapturingThumb(true)
        const capturedThumb = await storageService.generateVideoThumbnail(file)
        if (capturedThumb) {
          setLocalThumbPreviewUrl(capturedThumb)
          setFormData((prev) => ({ ...prev, thumbnail_url: capturedThumb }))
        }
      } catch (e) {
        console.warn('Auto-thumbnail extraction error:', e)
      } finally {
        setIsCapturingThumb(false)
      }
    }
  }

  // Handle Thumbnail file change
  const handleThumbFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = storageService.validateImage(file, 5 * 1024 * 1024, 'Thumbnail')
    if (!validation.valid) {
      setFormError(validation.error)
      return
    }

    setFormError('')
    setSelectedThumbFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setLocalThumbPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Manual Trigger to Capture Frame from loaded video
  const handleCaptureFrame = async () => {
    if (!selectedVideoFile && !formData.video_url) {
      setFormError('Please select or provide a video first to extract a frame.')
      return
    }
    try {
      setIsCapturingThumb(true)
      const target = selectedVideoFile || formData.video_url
      const thumb = await storageService.generateVideoThumbnail(target)
      if (thumb) {
        setLocalThumbPreviewUrl(thumb)
        setFormData((prev) => ({ ...prev, thumbnail_url: thumb }))
        setSuccessToast('Thumbnail captured successfully from video frame.')
      } else {
        setFormError('Could not capture frame from this video. Please upload an image directly.')
      }
    } catch {
      setFormError('Frame capture failed. Please upload a thumbnail file.')
    } finally {
      setIsCapturingThumb(false)
    }
  }

  // Submit Review Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!selectedVideoFile && !formData.video_url.trim()) {
      setFormError('Please upload an MP4 video file or provide a video URL.')
      return
    }

    if (formData.country && !['UAE', 'Saudi Arabia'].includes(formData.country)) {
      setFormError('Country must be UAE or Saudi Arabia.')
      return
    }

    setIsSubmitting(true)

    try {
      let finalVideoUrl = formData.video_url.trim()
      let finalThumbUrl = formData.thumbnail_url?.trim() || ''

      // 1. Upload Video File if selected
      if (selectedVideoFile) {
        setVideoProgress(15)
        const { url: videoUrl, error: videoErr } = await storageService.uploadReviewVideo(
          selectedVideoFile,
          (progress) => setVideoProgress(progress)
        )

        if (videoErr || !videoUrl) {
          throw new Error(videoErr?.message || 'Video upload failed. Please try again.')
        }

        finalVideoUrl = videoUrl
      }

      // 2. Upload Thumbnail File if selected
      if (selectedThumbFile) {
        setThumbProgress(20)
        const { url: thumbUrl, error: thumbErr } = await storageService.uploadReviewThumbnail(
          selectedThumbFile,
          (progress) => setThumbProgress(progress)
        )

        if (thumbErr || !thumbUrl) {
          throw new Error(thumbErr?.message || 'Thumbnail upload failed.')
        }

        finalThumbUrl = thumbUrl
      } else if (localThumbPreviewUrl && !finalThumbUrl) {
        finalThumbUrl = localThumbPreviewUrl
      }

      const reviewPayload = {
        candidate_name: formData.candidate_name.trim() || null,
        country: formData.country,
        job_category: formData.job_category.trim() || null,
        testimonial_title: formData.testimonial_title.trim() || null,
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbUrl || null,
        status: formData.status
      }

      let res
      if (editingReview) {
        res = await reviewService.updateReview(editingReview.id, reviewPayload)
      } else {
        res = await reviewService.createReview(reviewPayload)
      }

      if (res.error) throw res.error

      setSuccessToast(
        editingReview
          ? 'Review updated successfully!'
          : 'New video review uploaded and published!'
      )

      closeModal()
      await loadReviews()
    } catch (err) {
      setFormError(err.message || 'Failed to save review.')
    } finally {
      setIsSubmitting(false)
      setVideoProgress(0)
      setThumbProgress(0)
    }
  }

  // Toggle publish / unpublish
  const handleToggleStatus = async (review) => {
    const nextStatus = review.status === 'published' ? 'unpublished' : 'published'
    const { error } = await reviewService.updateReviewStatus(review.id, nextStatus)
    if (error) {
      alert('Failed to update status: ' + error.message)
    } else {
      setSuccessToast(`Review marked as ${nextStatus}.`)
      await loadReviews()
    }
  }

  // Delete Review
  const handleDeleteReview = async (id) => {
    const { error } = await reviewService.deleteReview(id)
    if (error) {
      alert('Failed to delete review: ' + error.message)
    } else {
      setSuccessToast('Review removed successfully.')
      setDeleteConfirmId(null)
      await loadReviews()
    }
  }

  const publishedCount = reviews.filter((r) => r.status === 'published').length
  const unpublishedCount = reviews.filter((r) => r.status === 'unpublished').length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="bg-charcoal-900 text-white rounded-2xl p-6 sm:p-8 border border-charcoal-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 text-secondary-400 text-xs font-semibold">
            <Film className="w-3.5 h-3.5" />
            <span>Customer Review Shorts / Reels</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Manage Testimonial Videos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload vertical 9:16 MP4 video testimonials (max 50 MB) and manage candidate reviews.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Upload New Review</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-600 hover:text-emerald-800 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-surface-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Reviews</span>
          <span className="text-2xl font-black text-charcoal-800 block mt-1">{reviews.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-surface-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-600 block">Published (Live)</span>
          <span className="text-2xl font-black text-secondary-600 block mt-1">{publishedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-surface-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Unpublished</span>
          <span className="text-2xl font-black text-slate-600 block mt-1">{unpublishedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-surface-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 block">Destinations</span>
          <span className="text-xs font-semibold text-charcoal-800 block mt-2">
            🇦🇪 {reviews.filter((r) => r.country === 'UAE').length} UAE | 🇸🇦 {reviews.filter((r) => r.country === 'Saudi Arabia').length} KSA
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, role, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {['All', 'published', 'unpublished'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  statusFilter === st ? 'bg-white text-charcoal-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-charcoal-800 bg-white focus:outline-none focus:border-primary-500"
          >
            <option value="All">All Countries</option>
            <option value="UAE">🇦🇪 UAE</option>
            <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards / Grid Display */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500 mb-2" />
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-3">
          <Film className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-800">No Review Testimonials Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by clicking "Upload New Review" to add customer video testimonials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {reviews.map((r) => {
            const isLive = r.status === 'published'
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* 9:16 Mini Reel Poster */}
                <div className="relative aspect-[9/16] w-full bg-charcoal-900 overflow-hidden group">
                  {r.thumbnail_url ? (
                    <img
                      src={r.thumbnail_url}
                      alt={r.testimonial_title || 'Review Thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-charcoal-950 text-slate-500">
                      <Video className="w-10 h-10" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-charcoal-950/60" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-xs">
                      {r.country === 'UAE' ? '🇦🇪 UAE' : '🇸🇦 Saudi Arabia'}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLive ? 'bg-secondary-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isLive ? 'Published' : 'Unpublished'}
                    </span>
                  </div>

                  {/* Play Button Overlay to Preview Video */}
                  <button
                    onClick={() => setPreviewModalReview(r)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary-500/90 group-hover:bg-primary-500 text-white flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110"
                    title="Play Preview"
                  >
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </button>

                  {/* Bottom Text Over Thumbnail */}
                  <div className="absolute bottom-2.5 inset-x-2.5 text-white space-y-0.5">
                    {r.candidate_name && (
                      <div className="font-bold text-xs truncate flex items-center gap-1">
                        <span>{r.candidate_name}</span>
                        <CheckCircle2 className="w-3 h-3 text-secondary-400 shrink-0" />
                      </div>
                    )}
                    {r.job_category && (
                      <div className="text-[10px] text-slate-300 truncate">{r.job_category}</div>
                    )}
                  </div>
                </div>

                {/* Card Content & Meta */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-800 line-clamp-2">
                      {r.testimonial_title || 'Untitled Testimonial'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Uploaded: {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleToggleStatus(r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        isLive
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          : 'bg-secondary-50 hover:bg-secondary-100 text-secondary-700 border border-secondary-200'
                      }`}
                    >
                      {isLive ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(r)}
                        title="Edit Review Details"
                        className="p-1 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(r.id)}
                        title="Delete Review"
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-charcoal-800">Delete Testimonial Review?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this video review? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal (Watch 9:16 Video in Full) */}
      {previewModalReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-sm w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20">
            <button
              onClick={() => setPreviewModalReview(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/30"
            >
              <X className="w-4 h-4" />
            </button>

            <video
              src={previewModalReview.video_url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-surface-border flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal-800">
                    {editingReview ? 'Edit Testimonial Review' : 'Upload Video Testimonial'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Vertical 9:16 MP4 video format (max 50 MB).
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-charcoal-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Video File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Video Testimonial File (MP4 only, max 50 MB) <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload Box */}
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-primary-50/20 flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal-800 block">
                        Browse MP4 Video File
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Max 50 MB • Vertical 9:16
                      </span>
                    </div>
                    {selectedVideoFile && (
                      <span className="text-[11px] text-secondary-600 font-semibold bg-secondary-50 px-2 py-0.5 rounded truncate max-w-[200px]">
                        {selectedVideoFile.name} ({(selectedVideoFile.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Or Direct Video URL */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-charcoal-700 block">
                      Or Paste Direct MP4 URL:
                    </span>
                    <input
                      type="url"
                      placeholder="https://.../video.mp4"
                      value={formData.video_url}
                      onChange={(e) => {
                        setFormData({ ...formData, video_url: e.target.value })
                        if (!selectedVideoFile) setLocalVideoPreviewUrl(e.target.value)
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-charcoal-800 focus:outline-none focus:border-primary-500 bg-white"
                    />
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Must point to an MP4 video stream or Supabase storage public link.
                    </p>
                  </div>
                </div>

                {/* Video Upload Progress Bar */}
                {videoProgress > 0 && videoProgress < 100 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Uploading MP4 video...</span>
                      <span>{videoProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-200"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Video Thumbnail Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Video Thumbnail (Optional)
                  </label>
                  {(selectedVideoFile || formData.video_url) && (
                    <button
                      type="button"
                      onClick={handleCaptureFrame}
                      disabled={isCapturingThumb}
                      className="inline-flex items-center gap-1.5 text-[11px] text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isCapturingThumb ? 'Capturing Frame...' : 'Snap Frame from Video'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Thumbnail File Upload */}
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="border border-slate-300 hover:border-primary-500 rounded-xl p-3.5 text-center cursor-pointer bg-slate-50/50 hover:bg-primary-50/20 flex items-center justify-center gap-3"
                  >
                    <Camera className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-charcoal-800 block">
                        Upload custom thumbnail image
                      </span>
                      <span className="text-[10px] text-slate-400 block">JPG, PNG, WebP up to 5 MB</span>
                    </div>
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleThumbFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Thumbnail Preview Box */}
                  <div className="h-16 rounded-xl border border-slate-200 bg-charcoal-900 overflow-hidden flex items-center justify-between p-2">
                    {localThumbPreviewUrl ? (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={localThumbPreviewUrl}
                          alt="Thumbnail preview"
                          className="h-12 w-9 object-cover rounded-md border border-white/20"
                        />
                        <span className="text-[11px] text-slate-300 font-medium truncate max-w-[150px]">
                          Thumbnail set
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 px-2">No thumbnail selected yet.</span>
                    )}

                    {localThumbPreviewUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocalThumbPreviewUrl('')
                          setSelectedThumbFile(null)
                          setFormData({ ...formData, thumbnail_url: '' })
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Candidate Name & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Candidate Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mohammed Imran"
                    value={formData.candidate_name}
                    onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Destination Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-charcoal-800 bg-white focus:outline-none focus:border-primary-500 font-medium"
                  >
                    <option value="UAE">🇦🇪 UAE (Dubai)</option>
                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                  </select>
                </div>
              </div>

              {/* 4. Job Category & Testimonial Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Job Category (Optional)
                  </label>
                  <select
                    value={formData.job_category}
                    onChange={(e) => setFormData({ ...formData, job_category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-charcoal-800 bg-white focus:outline-none focus:border-primary-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Publication Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-charcoal-800 bg-white focus:outline-none focus:border-primary-500 font-semibold"
                  >
                    <option value="published">Published (Visible on Public Website)</option>
                    <option value="unpublished">Unpublished (Hidden Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                  Testimonial Title / Short Quote (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Secured HVAC Technician Role in Dubai with Company Accommodation"
                  value={formData.testimonial_title}
                  onChange={(e) => setFormData({ ...formData, testimonial_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-charcoal-800 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Review...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{editingReview ? 'Update Review' : 'Publish Review'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
