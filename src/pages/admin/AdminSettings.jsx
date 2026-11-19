import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Share2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Globe, 
  MessageCircle,
  Eye,
  RefreshCw,
  X
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { settingsService } from '../../services/settingsService'
import { storageService } from '../../services/storageService'

export const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings()
  const [selectedLogoFile, setSelectedLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoProgress, setLogoProgress] = useState(0)
  const [formData, setFormData] = useState({
    company_name: 'Joy Manpower Solution',
    tagline: 'Overseas Manpower Recruitment Consultancy',
    logo_url: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    address: '',
    working_hours: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    linkedin_url: '',
    uae_contact: '',
    saudi_contact: ''
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || 'Joy Manpower Solution',
        tagline: settings.tagline || 'Overseas Manpower Recruitment Consultancy',
        logo_url: settings.logo_url || '',
        phone: settings.phone || '',
        whatsapp_number: settings.whatsapp_number || '',
        email: settings.email || '',
        address: settings.address || '',
        working_hours: settings.working_hours || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || '',
        linkedin_url: settings.linkedin_url || '',
        uae_contact: settings.uae_contact || '',
        saudi_contact: settings.saudi_contact || ''
      })
    }
  }, [settings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = storageService.validateImage(file, 5 * 1024 * 1024, 'Logo')
    if (!validation.valid) {
      setErrorMsg(validation.error)
      return
    }
    setErrorMsg('')
    setSelectedLogoFile(file)
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      let finalLogoUrl = formData.logo_url

      if (selectedLogoFile) {
        setLogoProgress(15)
        const { url, error: uploadErr } = await storageService.uploadLogo(
          selectedLogoFile,
          (p) => setLogoProgress(p)
        )
        if (uploadErr || !url) {
          throw new Error(uploadErr?.message || 'Failed to upload logo to B2 storage.')
        }
        finalLogoUrl = url
      }

      const payload = {
        ...formData,
        logo_url: finalLogoUrl
      }

      const { data, error } = await settingsService.updateSettings(payload)
      if (error) throw error

      setFormData((prev) => ({ ...prev, logo_url: finalLogoUrl }))
      setSelectedLogoFile(null)
      await refreshSettings()
      setSuccessMsg('Company settings updated successfully! Website header, footer, and contact links are now synchronized.')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update company settings.')
    } finally {
      setSaving(false)
      setLogoProgress(0)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#26075D] tracking-tight">
            Company Settings & Contact Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update company branding, contact numbers, email, physical address, and official social media channels. Changes reflect dynamically across the website.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Brand & Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-[#321078]" />
            <h2 className="text-sm sm:text-base font-black text-[#26075D]">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tagline / Sub-title
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Logo (Stored in Backblaze B2)
              </label>
              
              <div className="flex items-center gap-4">
                {(logoPreview || formData.logo_url) ? (
                  <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={logoPreview || formData.logo_url}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#321078] file:text-white hover:file:bg-[#26075D] cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">
                    Upload PNG, JPG, WebP, or SVG. Automatically uploaded to Backblaze B2 cloud storage.
                  </p>
                  {logoProgress > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#321078] h-full transition-all" style={{ width: `${logoProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-[#321078]" />
            <h2 className="text-sm sm:text-base font-black text-[#26075D]">Contact Numbers & Email</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Top Bar & Contact Page)
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Number (Floating Button & Direct Chat)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                placeholder="+91 98765 43210 or 919876543210"
                value={formData.whatsapp_number}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used directly for floating WhatsApp and hero quick-apply buttons.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="info@joymanpowersolution.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Working Hours
              </label>
              <input
                type="text"
                name="working_hours"
                placeholder="Mon - Sat: 9:30 AM - 6:30 PM"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Head Office Location / Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="e.g. Joy Manpower Solution, Business Tower, Mumbai, India"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Share2 className="w-5 h-5 text-[#321078]" />
            <h2 className="text-sm sm:text-base font-black text-[#26075D]">Social Media Channels</h2>
          </div>
          <p className="text-xs text-slate-500">
            Active icons will appear in the top contact bar and right floating social bar. Leave blank to hide a platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebook_url"
                placeholder="https://facebook.com/joymanpower"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                name="youtube_url"
                placeholder="https://youtube.com/@joymanpower"
                value={formData.youtube_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Profile / Company URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                placeholder="https://linkedin.com/company/joymanpower"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                name="instagram_url"
                placeholder="https://instagram.com/joymanpower"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: GCC Regional Coordination Contacts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-[#321078]" />
            <h2 className="text-sm sm:text-base font-black text-[#26075D]">Overseas Coordination Desks (UAE & Saudi Arabia)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                UAE – Dubai Liaison Desk Contact
              </label>
              <input
                type="text"
                name="uae_contact"
                placeholder="e.g. Dubai Representative Desk: +971 50 123 4567"
                value={formData.uae_contact}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Saudi Arabia Liaison Desk Contact
              </label>
              <input
                type="text"
                name="saudi_contact"
                placeholder="e.g. Riyadh / Dammam Desk: +966 50 123 4567"
                value={formData.saudi_contact}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#321078] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between pt-4">
          <span className="text-xs text-slate-400">
            * All changes are instantly synced to website visitors.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
