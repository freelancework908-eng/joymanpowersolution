import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Database,
  ShieldCheck
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
    <div className="min-h-screen bg-[#140233] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Purple Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#5015A8]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top back link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center text-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FFC900]" />
          <span>Return to Public Website</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>TiDB & B2 Cloud Connected</span>
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#26075D] border border-[#3E0F87] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FFC900] text-[#26075D] flex items-center justify-center mx-auto shadow-md">
            <span className="text-xl font-black">JMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-300">
            Sign in to manage UAE & Saudi Arabian job postings, banner, gallery, and candidate resumes.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@joymanpowersolution.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#140233] border border-[#3E0F87] rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFC900]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#140233] border border-[#3E0F87] rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFC900]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#FFC900] hover:bg-[#F5B900] text-[#26075D] font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#26075D]" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Shortcut */}
        <div className="pt-2 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] text-slate-400">
            For testing or evaluation:
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold rounded-xl border border-white/10 transition-colors"
          >
            Fill Demo Credentials (admin@joymanpowersolution.com / admin123)
          </button>
        </div>
      </div>
    </div>
  )
}
