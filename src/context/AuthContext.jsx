import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_ADMIN_KEY = 'jms_admin_session'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession()
          if (mounted && data?.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email,
              role: 'admin',
              provider: 'supabase'
            })
          }
        } catch (e) {
          console.warn('Supabase auth session check failed:', e)
        }
      } else {
        // Local preview session
        const stored = localStorage.getItem(DEMO_ADMIN_KEY)
        if (stored && mounted) {
          try {
            setUser(JSON.parse(stored))
          } catch {
            localStorage.removeItem(DEMO_ADMIN_KEY)
          }
        }
      }

      if (mounted) setLoading(false)
    }

    initAuth()

    let authListener = null
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'admin',
            provider: 'supabase'
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })
      authListener = data.subscription
    }

    return () => {
      mounted = false
      if (authListener) authListener.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: 'admin',
          provider: 'supabase'
        })
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message || 'Invalid credentials' }
      }
    }

    // Local / Demo Admin Login
    // Default demo: admin@joymanpowersolution.com / admin123
    const defaultEmail = 'admin@joymanpowersolution.com'
    const defaultPass = 'admin123'

    if (
      (email.trim().toLowerCase() === defaultEmail && password === defaultPass) ||
      (email.trim().toLowerCase().includes('admin') && password.length >= 6)
    ) {
      const adminUser = {
        id: 'admin-local-' + Date.now(),
        email: email.trim().toLowerCase(),
        role: 'admin',
        provider: 'local_demo'
      }
      localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(adminUser))
      setUser(adminUser)
      return { success: true }
    }

    return {
      success: false,
      error: 'Invalid email or password. Use admin@joymanpowersolution.com / admin123 for demo access.'
    }
  }

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        console.warn('Sign out warning:', e)
      }
    }
    localStorage.removeItem(DEMO_ADMIN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
