import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { initialApplications } from '../data/initialJobs'

const LOCAL_STORAGE_APP_KEY = 'jms_applications_data'

const getStoredApplications = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APP_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to read applications from localStorage', e)
  }
  localStorage.setItem(LOCAL_STORAGE_APP_KEY, JSON.stringify(initialApplications))
  return initialApplications
}

const saveStoredApplications = (apps) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_APP_KEY, JSON.stringify(apps))
  } catch (e) {
    console.error('Failed to save applications to localStorage', e)
  }
}

export const applicationService = {
  async submitApplication({
    job_id,
    job_title,
    candidate_name,
    mobile,
    email,
    experience,
    current_location,
    resumeFile
  }) {
    // 1. Mandatory Validations
    if (!candidate_name || candidate_name.trim().length < 2) {
      return { error: new Error('Candidate full name is required.') }
    }
    if (!mobile || !/^[0-9+\s-]{8,18}$/.test(mobile.trim())) {
      return { error: new Error('Please enter a valid mobile number with at least 10 digits.') }
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { error: new Error('Please enter a valid email address.') }
    }
    if (!experience || experience.trim().length === 0) {
      return { error: new Error('Total experience is required.') }
    }
    if (!current_location || current_location.trim().length === 0) {
      return { error: new Error('Current location is required.') }
    }
    if (!resumeFile) {
      return { error: new Error('Please upload your resume file (PDF, DOC, DOCX).') }
    }

    // File validation: PDF, DOC, DOCX only, max 5MB
    const allowedExtensions = ['pdf', 'doc', 'docx']
    const fileExt = resumeFile.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(fileExt)) {
      return { error: new Error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.') }
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return { error: new Error('File size exceeds the 5MB limit. Please upload a smaller file.') }
    }

    let resume_path = ''
    let resume_url = ''

    if (isSupabaseConfigured) {
      try {
        // Upload resume to Supabase Storage 'resumes' bucket
        const sanitizedName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filePath = `resumes/${Date.now()}_${sanitizedName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.warn('Storage upload warning:', uploadError.message)
          // Still proceed if file upload fails due to RLS, save relative path
          resume_path = filePath
        } else {
          resume_path = uploadData?.path || filePath
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(resume_path)

        resume_url = urlData?.publicUrl || ''

        // Insert application record
        const { data, error } = await supabase
          .from('applications')
          .insert([
            {
              job_id,
              candidate_name: candidate_name.trim(),
              mobile: mobile.trim(),
              email: email.trim().toLowerCase(),
              experience: experience.trim(),
              current_location: current_location.trim(),
              resume_path,
              resume_url,
              status: 'pending'
            }
          ])
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      } catch (err) {
        console.warn('Supabase application submission failed, saving to local store:', err)
      }
    }

    // Local fallback
    const newApp = {
      id: 'app-' + Date.now(),
      job_id,
      job_title: job_title || 'Overseas Job Vacancy',
      candidate_name: candidate_name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      experience: experience.trim(),
      current_location: current_location.trim(),
      resume_path: `resumes/local_${Date.now()}_${resumeFile.name}`,
      resume_url: URL.createObjectURL(resumeFile),
      resume_fileName: resumeFile.name,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const current = getStoredApplications()
    const updated = [newApp, ...current]
    saveStoredApplications(updated)
    return { data: newApp, error: null }
  },

  async getAllApplications(filters = {}) {
    const { status, search, jobId } = filters

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('applications')
          .select(`
            *,
            jobs:job_id (
              id,
              title,
              country,
              location
            )
          `)
          .order('created_at', { ascending: false })

        if (status && status !== 'All') {
          query = query.eq('status', status)
        }
        if (jobId && jobId !== 'All') {
          query = query.eq('job_id', jobId)
        }

        const { data, error } = await query
        if (error) throw error

        let results = (data || []).map((app) => ({
          ...app,
          job_title: app.jobs?.title || 'Unknown Job',
          job_country: app.jobs?.country || ''
        }))

        if (search && search.trim()) {
          const s = search.toLowerCase().trim()
          results = results.filter(
            (a) =>
              a.candidate_name.toLowerCase().includes(s) ||
              a.email.toLowerCase().includes(s) ||
              a.mobile.includes(s) ||
              (a.job_title && a.job_title.toLowerCase().includes(s))
          )
        }
        return { data: results, error: null }
      } catch (err) {
        console.warn('Supabase getAllApplications failed, using local store', err)
      }
    }

    let list = getStoredApplications()
    if (status && status !== 'All') {
      list = list.filter((a) => a.status === status)
    }
    if (jobId && jobId !== 'All') {
      list = list.filter((a) => String(a.job_id) === String(jobId))
    }
    if (search && search.trim()) {
      const s = search.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.candidate_name.toLowerCase().includes(s) ||
          a.email.toLowerCase().includes(s) ||
          a.mobile.includes(s) ||
          (a.job_title && a.job_title.toLowerCase().includes(s))
      )
    }
    return { data: list, error: null }
  },

  async updateApplicationStatus(id, newStatus) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({ status: newStatus })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      } catch (err) {
        console.error('Supabase updateApplicationStatus error:', err)
        return { data: null, error: err }
      }
    }

    // Local fallback
    const current = getStoredApplications()
    const idx = current.findIndex((a) => String(a.id) === String(id))
    if (idx === -1) {
      return { data: null, error: new Error('Application not found') }
    }
    current[idx].status = newStatus
    saveStoredApplications(current)
    return { data: current[idx], error: null }
  },

  async deleteApplication(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id)

        if (error) throw error
        return { error: null }
      } catch (err) {
        console.error('Supabase deleteApplication error:', err)
        return { error: err }
      }
    }

    const current = getStoredApplications()
    const updated = current.filter((a) => String(a.id) !== String(id))
    saveStoredApplications(updated)
    return { error: null }
  }
}
