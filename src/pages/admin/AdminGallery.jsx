import React, { useState, useEffect, useRef } from 'react'
import { 
  Images, 
  Plus, 
  Trash2, 
  Edit,
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Filter,
  Eye,
  X,
  Sparkles
} from 'lucide-react'
import { galleryService } from '../../services/galleryService'
import { storageService } from '../../services/storageService'

export const AdminGallery = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const categories = ['Trade Testing', 'Client Interviews', 'Orientation', 'Deployments']

  const [formData, setFormData] = useState({
    title: '',
    category: 'Client Interviews',
    image_url: '',
    caption: ''
  })

  useEffect(() => {
    loadGallery()
  }, [selectedCategory])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const { data } = await galleryService.getAllGallery(selectedCategory)
      if (data) setItems(data)
    } catch (e) {
      console.warn('Failed to load gallery:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = storageService.validateImage(file, 10 * 1024 * 1024, 'Gallery Image')
    if (!validation.valid) {
      setErrorMsg(validation.error)
      return
    }

    setErrorMsg('')
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleOpenAdd = () => {
    resetForm()
    setEditingItemId(null)
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setErrorMsg('')
    setSuccessMsg('')
    setEditingItemId(item.id)
    setFormData({
      title: item.title || '',
      category: item.category || 'Client Interviews',
      image_url: item.image_url || '',
      caption: item.caption || ''
    })
    setPreviewImage(item.image_url || null)
    setSelectedFile(null)
    setUploadProgress(0)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!selectedFile && !formData.image_url.trim()) {
      setErrorMsg('Please upload an image file or provide an image URL.')
      return
    }

    if (!formData.title.trim()) {
      setErrorMsg('Please enter an activity title.')
      return
    }

    setIsSubmitting(true)

    try {
      let finalImageUrl = formData.image_url.trim()

      if (selectedFile) {
        setUploadProgress(15)
        const { url, error: uploadErr } = await storageService.uploadGalleryImage(
          selectedFile,
          (p) => setUploadProgress(p)
        )
        if (uploadErr || !url) {
          throw new Error(uploadErr?.message || 'Failed to upload gallery image.')
        }
        finalImageUrl = url
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        image_url: finalImageUrl,
        caption: formData.caption.trim()
      }

      if (editingItemId) {
        const { error } = await galleryService.updateGalleryItem(editingItemId, payload)
        if (error) throw error
        setSuccessMsg('Gallery item updated successfully!')
      } else {
        const { error } = await galleryService.createGalleryItem(payload)
        if (error) throw error
        setSuccessMsg('Gallery item added successfully!')
      }

      setShowModal(false)
      resetForm()
      await loadGallery()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save gallery item.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Client Interviews',
      image_url: '',
      caption: ''
    })
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadProgress(0)
    setEditingItemId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this gallery item'}"?`)) {
      return
    }

    try {
      const { error } = await galleryService.deleteGalleryItem(id)
      if (error) throw error
      setSuccessMsg('Gallery item deleted successfully.')
      await loadGallery()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete gallery item.')
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#26075D] tracking-tight">
              Activity Gallery Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F7F4FC] text-[#321078] text-xs font-bold border border-[#DDD0F3]">
              {items.length} Photos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload and update verified overseas recruitment photos, client interview drives, and deployment announcements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload New Photo</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="p-1 hover:bg-rose-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="flex-1">{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="p-1 hover:bg-emerald-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#321078] text-[#FFC900] shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'All' ? 'All Activities' : cat}
          </button>
        ))}
      </div>

      {/* Gallery List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#26075D]/90 text-[#FFC900] text-[10px] font-bold border border-white/10">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[#26075D] text-sm line-clamp-1">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-[#321078] hover:bg-[#F7F4FC] hover:text-[#26075D] transition-colors inline-flex items-center gap-1 font-bold text-xs"
                      title="Edit / Update item"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors inline-flex items-center gap-1 font-bold text-xs"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Images className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Gallery Items Found</h3>
          <p className="text-xs text-slate-400">Click "Upload New Photo" to add recruitment photos.</p>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 border border-[#DDD0F3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-[#26075D]">
                {editingItemId ? 'Update Gallery Photo Details' : 'Upload Gallery Activity Photo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#26075D] focus:ring-2 focus:ring-[#321078] outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai & Abu Dhabi Overseas Hiring: Drivers & Welders"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Caption / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of the recruitment drive, contact person, or roles..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Photo *
                </label>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#321078] rounded-xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-[#F7F4FC] transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-[#5015A8] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#321078] block">Click to upload photo</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 10 MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center text-[10px] font-bold text-slate-400 uppercase">
                  — or enter image URL / path directly —
                </div>

                <input
                  type="text"
                  placeholder="e.g. /gallery/jms-uae-hiring-drivers-welders.jpg or https://..."
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value })
                    if (!selectedFile) setPreviewImage(e.target.value)
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none font-medium"
                />
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-900">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    Preview
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Processing photo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#321078] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black px-5 py-2 rounded-xl text-xs shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#26075D]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItemId ? 'Update Photo' : 'Save Photo'}</span>
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
