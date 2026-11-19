import React, { useState, useEffect, useRef } from 'react'
import { 
  Image as ImageIcon, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Edit, 
  RefreshCw, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Sliders,
  Check,
  CheckCircle,
  X
} from 'lucide-react'
import { bannerService } from '../../services/bannerService'
import { storageService } from '../../services/storageService'

export const AdminBanner = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Editing state
  const [editingBannerId, setEditingBannerId] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  // Form fields
  const [formData, setFormData] = useState({
    image_url: '',
    mobile_image_url: '',
    sub_heading: 'Foreign Job Consultancy Services',
    heading: 'Saudi Arabia & Dubai',
    description: 'Authorized overseas recruitment consultancy connecting skilled Indian technicians, trades, and professionals with verified corporate sponsors across UAE & Saudi Arabia.',
    benefit1: 'Direct Corporate Sponsor Visas',
    benefit2: 'Certified Skill & Workshop Trade Testing',
    benefit3: 'Zero Hidden Charges & Transparent Terms',
    button_text: 'Apply Now',
    button_link: '/jobs',
    is_active: true
  })

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const { data } = await bannerService.getAllBanners()
      if (data) {
        setBanners(data)
        const active = data.find((b) => b.is_active)
        if (active && !editingBannerId) {
          populateForm(active)
        }
      }
    } catch (err) {
      console.warn('Failed to load banners:', err)
    } finally {
      setLoading(false)
    }
  }

  const populateForm = (banner) => {
    setEditingBannerId(banner.id)
    setFormData({
      image_url: banner.image_url || '',
      mobile_image_url: banner.mobile_image_url || '',
      sub_heading: banner.sub_heading || 'Foreign Job Consultancy Services',
      heading: banner.heading || '',
      description: banner.description || '',
      benefit1: banner.benefit1 || '',
      benefit2: banner.benefit2 || '',
      benefit3: banner.benefit3 || '',
      button_text: banner.button_text || 'Apply Now',
      button_link: banner.button_link || '/jobs',
      is_active: Boolean(banner.is_active)
    })
    setPreviewImage(banner.image_url || null)
    setSelectedFile(null)
    setUploadProgress(0)
    setErrorMsg('')
    setSuccessMsg('')
  }

  const resetFormForNew = () => {
    setEditingBannerId(null)
    setFormData({
      image_url: '',
      mobile_image_url: '',
      sub_heading: 'Foreign Job Consultancy Services',
      heading: 'Saudi Arabia & Dubai',
      description: '',
      benefit1: 'Direct Corporate Sponsor Visas',
      benefit2: 'Certified Skill & Workshop Trade Testing',
      benefit3: 'Zero Hidden Charges & Transparent Terms',
      button_text: 'Apply Now',
      button_link: '/jobs',
      is_active: true
    })
    setPreviewImage(null)
    setSelectedFile(null)
    setUploadProgress(0)
    setErrorMsg('')
    setSuccessMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = storageService.validateImage(file, 10 * 1024 * 1024, 'Banner Image')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!selectedFile && !formData.image_url.trim()) {
      setErrorMsg('Please select or upload a banner image.')
      return
    }

    setIsSubmitting(true)

    try {
      let finalImageUrl = formData.image_url.trim()

      if (selectedFile) {
        setUploadProgress(10)
        const { url, error: uploadErr } = await storageService.uploadBannerImage(
          selectedFile,
          (p) => setUploadProgress(p)
        )

        if (uploadErr || !url) {
          throw new Error(uploadErr?.message || 'Failed to upload banner image.')
        }

        finalImageUrl = url
      }

      const payload = {
        ...formData,
        image_url: finalImageUrl
      }

      let res
      if (editingBannerId) {
        res = await bannerService.updateBanner(editingBannerId, payload)
      } else {
        res = await bannerService.createBanner(payload)
      }

      if (res.error) {
        throw res.error
      }

      setSuccessMsg(
        editingBannerId
          ? 'Homepage banner updated successfully!'
          : 'New homepage banner published successfully!'
      )

      await loadBanners()
      setSelectedFile(null)
      setUploadProgress(0)
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving the banner.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (banner) => {
    const nextStatus = !banner.is_active
    const { error } = await bannerService.toggleActive(banner.id, nextStatus)
    if (error) {
      setErrorMsg(error.message || 'Failed to update banner status')
    } else {
      setSuccessMsg(`Banner ${nextStatus ? 'activated' : 'deactivated'} successfully.`)
      await loadBanners()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return

    const { error } = await bannerService.deleteBanner(id)
    if (error) {
      setErrorMsg(error.message || 'Failed to delete banner')
    } else {
      setSuccessMsg('Banner removed successfully.')
      if (editingBannerId === id) resetFormForNew()
      await loadBanners()
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#26075D] tracking-tight">
            Homepage Hero Banner Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize the primary hero banner displayed on the homepage. Change headings, recruitment benefits, CTA link, and overseas imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetFormForNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#321078]" />
            <span>New Banner</span>
          </button>
        </div>
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

      {/* Live Preview Box (Matching Full Background Image with Small Text in Left Corner) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#321078]" />
            <span>Live Hero Banner Preview (Full Background Image with Left Corner Small Text)</span>
          </span>
          <span className="text-[11px] text-slate-400">Desktop & Mobile View</span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#DDD0F3] shadow-lg bg-[#1A063E] min-h-[360px] flex items-center">
          {/* Full Background Image */}
          {previewImage ? (
            <img
              src={previewImage}
              alt="Banner preview"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A063E] flex items-center justify-center text-slate-500">
              <ImageIcon className="w-12 h-12 stroke-[1.5]" />
            </div>
          )}

          {/* High-Contrast Gradient Overlay for Left Corner Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180738]/95 via-[#26075D]/85 md:via-[#26075D]/65 to-[#26075D]/25 z-10" />
          <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />

          {/* Left Corner Small Text Box */}
          <div className="relative z-20 p-6 sm:p-8 max-w-md text-left space-y-3.5 text-white">
            {/* Small Badge */}
            {formData.sub_heading && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-[#FFC900] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC900] animate-pulse" />
                <span>{formData.sub_heading}</span>
              </div>
            )}

            {/* Compact Main Heading */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              Overseas Careers in <br />
              <span className="text-[#FFC900]">
                {formData.heading || 'Saudi Arabia & Dubai'}
              </span>
            </h2>

            {/* Small Supporting description */}
            <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed font-normal">
              {formData.description || 'Authorized overseas recruitment consultancy connecting skilled Indian technicians, trades, and professionals with verified corporate sponsors across UAE & Saudi Arabia.'}
            </p>

            {/* Small Benefit bullets */}
            <div className="space-y-1 pt-0.5">
              {[formData.benefit1, formData.benefit2, formData.benefit3].filter(Boolean).map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-100 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-[#FFC900] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Small CTA buttons */}
            <div className="pt-1.5 flex items-center gap-2.5">
              {formData.button_text && (
                <span className="inline-flex items-center gap-1.5 bg-[#FFC900] text-[#26075D] font-black px-4 py-2 rounded-xl text-xs shadow-md">
                  <span>{formData.button_text}</span>
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-white/10 text-white font-bold px-3 py-2 rounded-xl text-xs border border-white/20">
                Browse Jobs
              </span>
            </div>
          </div>

          {/* Right badge watermark indicating live image */}
          <div className="hidden sm:block absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-xs text-[#FFC900] text-[10px] px-2.5 py-1 rounded-md font-bold border border-white/10">
            Overseas Workforce Background
          </div>
        </div>
      </div>

      {/* Banner Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#26075D]">
              {editingBannerId ? 'Edit Banner Configuration' : 'Create New Homepage Banner'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recommended image resolution: 1920x800 or 16:9 landscape aspect ratio.
            </p>
          </div>
          {editingBannerId && (
            <span className="text-xs font-bold text-[#321078] bg-[#F7F4FC] px-3 py-1 rounded-lg border border-[#DDD0F3]">
              Active Banner ID: {editingBannerId}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload / Image Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Primary Banner Image *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drop / Click Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#321078] rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-[#F7F4FC] flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#F7F4FC] text-[#321078] flex items-center justify-center border border-[#DDD0F3]">
                  <UploadCloud className="w-5 h-5 text-[#5015A8]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to browse or replace hero image
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    JPG, PNG, WebP up to 10 MB
                  </span>
                </div>
                {selectedFile && (
                  <span className="text-xs text-[#26075D] font-bold bg-[#FFC900]/30 px-2.5 py-1 rounded-md border border-[#FFC900]">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Or Direct Image URL input */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block">
                  Or enter Direct Image URL:
                </span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value })
                    if (!selectedFile) setPreviewImage(e.target.value)
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#321078] bg-white font-medium"
                />
                <p className="text-[11px] text-slate-400 leading-normal">
                  You can paste an external high-resolution overseas workforce photograph or upload a file.
                </p>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs text-slate-500 font-bold">
                  <span>Uploading banner image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#321078] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Subheading, Heading & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Top Badge Sub-Heading
              </label>
              <input
                type="text"
                placeholder="Foreign Job Consultancy Services"
                value={formData.sub_heading}
                onChange={(e) => setFormData({ ...formData, sub_heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#321078]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Main Hero Heading *
              </label>
              <input
                type="text"
                required
                placeholder="Saudi Arabia & Dubai"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#321078]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Supporting Recruitment Description
              </label>
              <textarea
                rows={2}
                placeholder="Authorized overseas recruitment consultancy connecting skilled Indian technicians..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#321078]"
              />
            </div>
          </div>

          {/* Three Benefit Statements */}
          <div className="bg-[#F7F4FC] rounded-2xl p-4 sm:p-5 border border-[#DDD0F3] space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#26075D] block">
              Three Benefit Statements (Shown with Checkmarks)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Benefit 1</label>
                <input
                  type="text"
                  placeholder="Direct Corporate Sponsor Visas"
                  value={formData.benefit1}
                  onChange={(e) => setFormData({ ...formData, benefit1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#321078]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Benefit 2</label>
                <input
                  type="text"
                  placeholder="Certified Skill & Workshop Trade Testing"
                  value={formData.benefit2}
                  onChange={(e) => setFormData({ ...formData, benefit2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#321078]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Benefit 3</label>
                <input
                  type="text"
                  placeholder="Zero Hidden Charges & Transparent Terms"
                  value={formData.benefit3}
                  onChange={(e) => setFormData({ ...formData, benefit3: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#321078]"
                />
              </div>
            </div>
          </div>

          {/* CTA Button Text & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                placeholder="Apply Now"
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#321078]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Button Link
              </label>
              <input
                type="text"
                placeholder="/jobs"
                value={formData.button_link}
                onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#321078]"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-[#321078] rounded border-slate-300 focus:ring-[#321078]"
            />
            <label htmlFor="is_active" className="text-xs sm:text-sm font-bold text-slate-700 select-none">
              Set as currently active homepage hero banner
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {editingBannerId && (
              <button
                type="button"
                onClick={resetFormForNew}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Banner...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingBannerId ? 'Update Banner' : 'Publish Banner'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Banners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#26075D]">All Saved Banners</h3>
            <p className="text-xs text-slate-400">
              Only one banner can be active at a time. Activating one automatically displays it on the homepage.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {banners.length} Banners
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No banners found. Create one using the form above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {banners.map((b) => (
              <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-[#26075D]">
                        {b.heading || 'Untitled Banner'}
                      </span>
                      {b.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{b.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      b.is_active
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-[#321078] text-[#FFC900] hover:bg-[#26075D]'
                    }`}
                  >
                    {b.is_active ? 'Deactivate' : 'Set as Active'}
                  </button>

                  <button
                    onClick={() => populateForm(b)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#26075D]"
                    title="Edit banner"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    title="Delete banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
