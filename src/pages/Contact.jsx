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
  ShieldCheck
} from 'lucide-react'
import { socialConfig } from '../config/socialLinks'

export const Contact = () => {
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

  return (
    <div className="py-8 sm:py-12 space-y-10 sm:space-y-12 w-full">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-500 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5 relative z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-secondary-200 bg-primary-600/60 border border-primary-400 px-3 py-1 rounded-full inline-block">
              Get in Touch
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Contact Joy Manpower Solution
            </h1>
            <p className="text-xs sm:text-sm text-primary-100 leading-relaxed max-w-2xl">
              Have questions regarding overseas job vacancies in <strong>UAE (Dubai)</strong> or <strong>Saudi Arabia</strong>? Connect with our recruitment counselors via phone, WhatsApp, or through the inquiry form below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-charcoal-800 border-b border-surface-border pb-3">
                Headquarters & Communication
              </h2>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-800">Office Location</span>
                    <span className="text-xs text-slate-500 leading-relaxed">
                      Joy Manpower Solution <br />
                      Corporate District, Mumbai / New Delhi, India <br />
                      <span className="text-[11px] text-primary-600">(Consultation by appointment)</span>
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-800">Phone Support</span>
                    <a href="tel:+919876543210" className="text-xs text-primary-600 hover:underline font-bold">
                      +91 98765 43210
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-800">WhatsApp Direct Desk</span>
                    <a
                      href={socialConfig.whatsapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-secondary-700 hover:text-secondary-800 font-bold"
                    >
                      <span>+91 98765 43210 (Click to Chat)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-800">Official Email</span>
                    <a href="mailto:info@joymanpowersolution.com" className="text-xs text-primary-600 hover:underline">
                      info@joymanpowersolution.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-800">Consultation Hours</span>
                    <span className="text-xs text-slate-500">
                      Monday to Saturday: 9:30 AM – 6:30 PM (IST)
                    </span>
                  </div>
                </li>
              </ul>

              <div className="p-3.5 rounded-xl bg-surface-section border border-surface-border text-xs text-slate-600 space-y-1">
                <div className="font-bold text-charcoal-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary-600" />
                  <span>Important Candidate Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Joy Manpower Solution never requests cash deposits before verified interview selection. Always apply through our official portal.
                </p>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-8 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-charcoal-800 border-b border-surface-border pb-3">
                Send an Inquiry
              </h2>

              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-800">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to our recruitment desk. We will respond shortly.
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                        Target Country Destination
                      </label>
                      <select
                        name="targetCountry"
                        value={formData.targetCountry}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                      >
                        <option value="UAE">🇦🇪 UAE – Dubai Opportunities</option>
                        <option value="Saudi Arabia">🇸🇦 Saudi Arabia Opportunities</option>
                        <option value="Both">Both UAE & Saudi Arabia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                      Message / Job Inquiry <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please let us know your trade skill, years of experience, or any questions..."
                      className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                    ></textarea>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors disabled:opacity-60 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Embed Section Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-xs">
          <div className="p-3.5 sm:p-4 bg-surface-section border-b border-surface-border flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
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
