import React, { useState } from 'react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Globe
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export const Contact = () => {
  const { settings } = useSettings()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetCountry: 'UAE',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, contact phone, and message.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 600)
  }

  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')

  return (
    <div className="py-8 sm:py-12 space-y-10 sm:space-y-12 w-full bg-[#F4F5F8]">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#26075D] text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl border border-[#3E0F87]">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#FFC900] bg-white/10 border border-white/20 px-3.5 py-1 rounded-full inline-block">
              Get in Touch
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white">
              Contact Joy Manpower Solution
            </h1>
            <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Have questions regarding verified overseas job vacancies in <strong>UAE (Dubai)</strong> or <strong>Saudi Arabia</strong>? Connect with our recruitment counselors via phone, WhatsApp, or through the inquiry form below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#DDD0F3] p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-black text-[#26075D] border-b border-slate-100 pb-3">
                Corporate Headquarters & Desks
              </h2>

              <ul className="space-y-5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-black text-[#26075D]">Registered Office Location</span>
                    <span className="text-xs text-slate-500 leading-relaxed mt-0.5 block">
                      {settings?.address || 'Joy Manpower Solution, Business District, Mumbai, India'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-black text-[#26075D]">Direct Telephone</span>
                    <a href={`tel:${settings?.phone || '+919876543210'}`} className="text-xs text-[#321078] hover:text-[#5015A8] font-bold mt-0.5 block">
                      {settings?.phone || '+91 98765 43210'}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16B83D] flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-black text-[#26075D]">WhatsApp Recruitment Desk</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#16B83D] hover:text-emerald-700 font-bold mt-0.5"
                    >
                      <span>{settings?.whatsapp_number || '+91 98765 43210'} (Click to Chat)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-black text-[#26075D]">Official Email</span>
                    <a href={`mailto:${settings?.email || 'info@joymanpowersolution.com'}`} className="text-xs text-[#321078] hover:text-[#5015A8] font-medium mt-0.5 block">
                      {settings?.email || 'info@joymanpowersolution.com'}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F4FC] text-[#321078] flex items-center justify-center shrink-0 border border-[#DDD0F3]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-black text-[#26075D]">Consultation Hours</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      {settings?.working_hours || 'Monday to Saturday: 9:30 AM – 6:30 PM (IST)'}
                    </span>
                  </div>
                </li>
              </ul>

              {/* Liaison Desks */}
              {(settings?.uae_contact || settings?.saudi_contact) && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-black text-[#26075D] uppercase tracking-wider block">
                    Overseas Coordination Desks
                  </span>
                  {settings.uae_contact && (
                    <div className="text-xs text-slate-600 bg-[#F7F4FC] p-2.5 rounded-xl border border-[#DDD0F3]">
                      🇦🇪 <strong>Dubai Desk:</strong> {settings.uae_contact}
                    </div>
                  )}
                  {settings.saudi_contact && (
                    <div className="text-xs text-slate-600 bg-[#F7F4FC] p-2.5 rounded-xl border border-[#DDD0F3]">
                      🇸🇦 <strong>Saudi Desk:</strong> {settings.saudi_contact}
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DDD0F3] text-xs text-slate-600 space-y-1">
                <div className="font-black text-[#26075D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#321078]" />
                  <span>Important Candidate Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Joy Manpower Solution operates strictly under authorized overseas recruitment frameworks. Always confirm interview credentials with our official desk.
                </p>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#DDD0F3] p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-black text-[#26075D] border-b border-slate-100 pb-3">
                Send an Online Inquiry
              </h2>

              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-[#16B83D] rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#26075D]">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to our recruitment desk. We will respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        targetCountry: 'UAE',
                        message: ''
                      })
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#321078] hover:bg-[#26075D] text-[#FFC900] text-xs font-black transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#321078] focus:ring-2 focus:ring-[#321078]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#321078] focus:ring-2 focus:ring-[#321078]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078] focus:ring-2 focus:ring-[#321078]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Target Country Destination
                      </label>
                      <select
                        name="targetCountry"
                        value={formData.targetCountry}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-[#26075D] focus:outline-none focus:border-[#321078] focus:ring-2 focus:ring-[#321078]/20"
                      >
                        <option value="UAE">🇦🇪 UAE – Dubai Opportunities</option>
                        <option value="Saudi Arabia">🇸🇦 Saudi Arabia Opportunities</option>
                        <option value="Both">Both UAE & Saudi Arabia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Job Inquiry <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please let us know your trade skill, years of experience, or any questions..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#321078] focus:ring-2 focus:ring-[#321078]/20"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors disabled:opacity-60 active:scale-95 uppercase tracking-wider"
                    >
                      <Send className="w-4 h-4 stroke-[3]" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Embed Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#DDD0F3] overflow-hidden shadow-sm">
          <div className="p-4 bg-[#F7F4FC] border-b border-[#DDD0F3] flex items-center justify-between">
            <span className="text-xs font-black text-[#26075D] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#321078]" />
              <span>Office Location Map</span>
            </span>
            <span className="text-xs text-slate-500">Corporate Consultation Desk</span>
          </div>
          <div className="w-full h-64 sm:h-72 bg-slate-100 flex items-center justify-center relative">
            <iframe
              title="Joy Manpower Solution Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
