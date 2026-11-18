import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Database
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminLogin = () => {
  const { login, isSupabaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.')
    }
  }

  const handleFillDemo = () => {
    setEmail('admin@joymanpowersolution.com')
    setPassword('admin123')
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top back link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center text-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>

        {isSupabaseConfigured ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Supabase Ready</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Demo Session Mode</span>
          </span>
        )}
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-800 border border-brand-700 text-gold-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in to manage UAE & Saudi Arabian job postings and candidate resumes.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@joymanpowersolution.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Shortcut */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-400">
            For testing or first-time evaluation:
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Fill Demo Credentials (admin@joymanpowersolution.com / admin123)
          </button>
        </div>
      </div>
    </div>
  )
}
