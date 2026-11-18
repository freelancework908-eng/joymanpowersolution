import React, { useState } from 'react'
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MapPin,
  ExternalLink
} from 'lucide-react'
import { applicationService } from '../../services/applicationService'
import { socialConfig } from '../../config/socialLinks'

export const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    candidate_name: '',
    mobile: '',
    email: '',
    experience: '',
    current_location: '',
    consent: false
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errorMessage) setErrorMessage('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setErrorMessage('Invalid file format. Please upload a PDF, DOC, or DOCX document.')
      setResumeFile(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Resume file is too large. Maximum allowed file size is 5MB.')
      setResumeFile(null)
      return
    }

    setErrorMessage('')
    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.candidate_name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!formData.mobile.trim() || !/^[0-9+\s-]{9,16}$/.test(formData.mobile.trim())) {
      setErrorMessage('Please enter a valid mobile number (e.g. +91 9876543210).')
      return
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!formData.experience.trim()) {
      setErrorMessage('Please enter your total work experience.')
      return
    }
    if (!formData.current_location.trim()) {
      setErrorMessage('Please enter your current city or state.')
      return
    }
    if (!resumeFile) {
      setErrorMessage('Please upload your resume in PDF, DOC, or DOCX format.')
      return
    }
    if (!formData.consent) {
      setErrorMessage('Please accept the consent agreement to submit your application.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await applicationService.submitApplication({
        job_id: job?.id,
        job_title: job?.title || 'Overseas Vacancy',
        candidate_name: formData.candidate_name,
        mobile: formData.mobile,
        email: formData.email,
        experience: formData.experience,
        current_location: formData.current_location,
        resumeFile
      })

      if (error) {
        setErrorMessage(error.message || 'Failed to submit application. Please try again.')
      } else {
        setSubmittedData(data || { id: 'APP-' + Math.floor(100000 + Math.random() * 900000) })
        if (onSuccess) onSuccess()
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      candidate_name: '',
      mobile: '',
      email: '',
      experience: '',
      current_location: '',
      consent: false
    })
    setResumeFile(null)
    setErrorMessage('')
    setSubmittedData(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-surface-border overflow-hidden my-4 sm:my-8">
        {/* Header with Deep Teal */}
        <div className="bg-primary-500 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-secondary-200">
                Application Form
              </span>
              <span className="text-primary-200">•</span>
              <span className="text-xs bg-primary-600 px-2 py-0.5 rounded text-white font-medium">
                {job?.country}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              {job?.title || 'Apply for Overseas Vacancy'}
            </h2>
            <p className="text-xs text-primary-100 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary-300" />
              <span>{job?.location}</span>
            </p>
          </div>
          <button
            onClick={resetForm}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {submittedData ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-charcoal-800">
                Application Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.candidate_name}</strong>. Your resume for the position of{' '}
                <strong>{job?.title}</strong> ({job?.country}) has been received by our overseas recruitment team.
              </p>

              <div className="bg-surface-section border border-surface-border rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate Name:</span>
                  <span className="font-semibold text-charcoal-800">{formData.candidate_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-semibold text-charcoal-800">{formData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Country:</span>
                  <span className="font-semibold text-primary-700">{job?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-secondary-700 font-bold bg-secondary-50 px-2 py-0.5 rounded">
                    Under Review
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Our recruitment coordinator will review your trade profile and contact you for client interview scheduling.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20just%20submitted%20my%20resume%20for%20${encodeURIComponent(
                    job?.title || 'the job'
                  )}%20(${encodeURIComponent(job?.country || '')}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span>WhatsApp Recruitment Team</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto bg-surface-section hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Job Auto Populated Field */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Applying for Vacancy
                </label>
                <input
                  type="text"
                  value={`${job?.title} (${job?.country})`}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-surface-section border border-surface-border rounded-xl text-xs font-medium text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Full Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="candidate_name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.candidate_name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Email & Total Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Total Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    required
                    placeholder="e.g. 4 Years"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Current Location (City / State) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="current_location"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={formData.current_location}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Resume Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Resume Upload (PDF, DOC, DOCX up to 5MB) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-surface-border rounded-xl p-4 text-center hover:border-primary-500 transition-colors bg-surface-section">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    {resumeFile ? (
                      <div className="flex items-center gap-2 text-primary-700 font-semibold text-xs sm:text-sm">
                        <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{resumeFile.name}</span>
                        <span className="text-xs text-slate-400">
                          ({(resumeFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-primary-500 mb-2" />
                        <span className="text-xs sm:text-sm font-bold text-primary-600">
                          Click to select your resume
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          PDF, DOC, DOCX (Max size 5MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-0.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span>
                    I confirm that the details provided are accurate and consent to Joy Manpower Solution reviewing my resume for overseas recruitment in UAE and Saudi Arabia.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-charcoal-800 bg-surface-section hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-xs hover:shadow transition-all inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
