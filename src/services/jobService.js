import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { initialJobs } from '../data/initialJobs'

const LOCAL_STORAGE_KEY = 'jms_jobs_data'

const getStoredJobs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to read jobs from localStorage', e)
  }
  // Initialize with initialJobs
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialJobs))
  return initialJobs
}

const saveStoredJobs = (jobs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs))
  } catch (e) {
    console.error('Failed to save jobs to localStorage', e)
  }
}

export const jobService = {
  async getPublishedJobs(filters = {}) {
    const { country, category, search } = filters

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('jobs')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (country && country !== 'All') {
          query = query.eq('country', country)
        }
        if (category && category !== 'All') {
          query = query.eq('category', category)
        }

        const { data, error } = await query
        if (error) throw error

        let results = data || []
        if (search && search.trim()) {
          const s = search.toLowerCase().trim()
          results = results.filter(
            (j) =>
              j.title.toLowerCase().includes(s) ||
              j.location.toLowerCase().includes(s) ||
              j.description.toLowerCase().includes(s)
          )
        }
        return { data: results, error: null }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local data', err)
      }
    }

    // Local data fallback
    let list = getStoredJobs().filter((j) => j.status === 'published')
    if (country && country !== 'All') {
      list = list.filter((j) => j.country === country)
    }
    if (category && category !== 'All') {
      list = list.filter((j) => j.category === category)
    }
    if (search && search.trim()) {
      const s = search.toLowerCase().trim()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          j.location.toLowerCase().includes(s) ||
          j.description.toLowerCase().includes(s)
      )
    }
    return { data: list, error: null }
  },

  async getAllJobs(filters = {}) {
    const { status, country, search } = filters

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })

        if (status && status !== 'All') {
          query = query.eq('status', status)
        }
        if (country && country !== 'All') {
          query = query.eq('country', country)
        }

        const { data, error } = await query
        if (error) throw error

        let results = data || []
        if (search && search.trim()) {
          const s = search.toLowerCase().trim()
          results = results.filter(
            (j) =>
              j.title.toLowerCase().includes(s) ||
              j.location.toLowerCase().includes(s) ||
              j.category.toLowerCase().includes(s)
          )
        }
        return { data: results, error: null }
      } catch (err) {
        console.warn('Supabase getAllJobs failed, falling back to local data', err)
      }
    }

    let list = getStoredJobs()
    if (status && status !== 'All') {
      list = list.filter((j) => j.status === status)
    }
    if (country && country !== 'All') {
      list = list.filter((j) => j.country === country)
    }
    if (search && search.trim()) {
      const s = search.toLowerCase().trim()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          j.location.toLowerCase().includes(s) ||
          j.category.toLowerCase().includes(s)
      )
    }
    return { data: list, error: null }
  },

  async getJobById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && data) {
          return { data, error: null }
        }
      } catch (err) {
        console.warn('Supabase getJobById failed', err)
      }
    }

    const list = getStoredJobs()
    const found = list.find((j) => String(j.id) === String(id))
    return {
      data: found || null,
      error: found ? null : new Error('Job not found')
    }
  },

  async createJob(jobData) {
    // Validate country strictly
    if (!['UAE', 'Saudi Arabia'].includes(jobData.country)) {
      return { data: null, error: new Error('Country must be either UAE or Saudi Arabia') }
    }

    const cleanData = {
      title: jobData.title,
      country: jobData.country,
      location: jobData.location,
      category: jobData.category,
      salary: jobData.salary,
      vacancies: Number(jobData.vacancies) || 1,
      experience: jobData.experience,
      qualification: jobData.qualification,
      description: jobData.description,
      responsibilities: jobData.responsibilities || '',
      benefits: jobData.benefits || '',
      deadline: jobData.deadline || null,
      status: jobData.status || 'draft'
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert([cleanData])
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      } catch (err) {
        console.error('Supabase createJob error:', err)
        return { data: null, error: err }
      }
    }

    // Local fallback
    const newJob = {
      ...cleanData,
      id: 'job-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const current = getStoredJobs()
    const updated = [newJob, ...current]
    saveStoredJobs(updated)
    return { data: newJob, error: null }
  },

  async updateJob(id, updates) {
    if (updates.country && !['UAE', 'Saudi Arabia'].includes(updates.country)) {
      return { data: null, error: new Error('Country must be either UAE or Saudi Arabia') }
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      } catch (err) {
        console.error('Supabase updateJob error:', err)
        return { data: null, error: err }
      }
    }

    // Local fallback
    const current = getStoredJobs()
    const idx = current.findIndex((j) => String(j.id) === String(id))
    if (idx === -1) {
      return { data: null, error: new Error('Job not found') }
    }
    const updatedItem = {
      ...current[idx],
      ...updates,
      updated_at: new Date().toISOString()
    }
    current[idx] = updatedItem
    saveStoredJobs(current)
    return { data: updatedItem, error: null }
  },

  async deleteJob(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', id)

        if (error) throw error
        return { error: null }
      } catch (err) {
        console.error('Supabase deleteJob error:', err)
        return { error: err }
      }
    }

    // Local fallback
    const current = getStoredJobs()
    const updated = current.filter((j) => String(j.id) !== String(id))
    saveStoredJobs(updated)
    return { error: null }
  },

  async updateJobStatus(id, newStatus) {
    return this.updateJob(id, { status: newStatus })
  }
}
