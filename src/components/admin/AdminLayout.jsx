import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  Database,
  Building,
  Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminLayout = () => {
  const { user, logout, isSupabaseConfigured } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Job Vacancies', path: '/admin/jobs', icon: Briefcase },
    { name: 'Candidate Applications', path: '/admin/applications', icon: Users }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-brand-950 text-white p-4 flex items-center justify-between border-b border-brand-900 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-800 flex items-center justify-center font-bold text-sm text-gold-400">
            JMS
          </div>
          <span className="font-bold text-sm tracking-tight">Admin Portal</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-brand-900 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-brand-950 text-slate-300 flex flex-col justify-between border-r border-brand-900 transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 pb-5 border-b border-brand-800/80">
            <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-white">
                <span className="text-gold-400">J</span>MS
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white tracking-tight leading-tight">
                JOY MANPOWER
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Recruitment CMS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pb-1">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-brand-800 text-white shadow-sm border border-brand-700/60'
                      : 'text-slate-400 hover:text-white hover:bg-brand-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Public Website Link */}
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pb-1">
              Public Front
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-brand-900/50 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>View Live Website</span>
              </span>
            </Link>
          </div>
        </div>

        {/* User Info & Connection Status */}
        <div className="p-4 border-t border-brand-900/80 bg-brand-900/30 space-y-3">
          {/* Supabase Status Pill */}
          <div className="flex items-center justify-between text-[11px] bg-brand-900/60 px-2.5 py-1.5 rounded-lg border border-brand-800">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Backend:</span>
            </span>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium" title="Configure VITE_SUPABASE_URL in .env to connect Supabase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Demo / Local</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="truncate max-w-[150px]">
              <span className="text-xs font-semibold text-white block truncate">
                {user?.email || 'Admin User'}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase">
                Administrator
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-brand-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
