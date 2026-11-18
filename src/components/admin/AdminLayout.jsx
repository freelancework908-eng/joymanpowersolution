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
  Database
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
    <div className="min-h-screen bg-surface-section flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-charcoal-900 text-white p-4 flex items-center justify-between border-b border-charcoal-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-sm text-white">
            JMS
          </div>
          <span className="font-bold text-sm tracking-tight">Admin Portal</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-charcoal-800 text-slate-300 hover:text-white"
          aria-label="Toggle admin sidebar"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-charcoal-900 text-slate-300 flex flex-col justify-between border-r border-charcoal-800 transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 pb-5 border-b border-charcoal-800">
            <div className="w-10 h-10 rounded-xl bg-primary-500 border border-primary-400 flex items-center justify-center shadow-sm">
              <span className="text-lg font-black text-white">
                J<span className="text-secondary-300">MS</span>
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white tracking-tight leading-tight">
                JOY MANPOWER
              </div>
              <div className="text-[10px] text-primary-300 font-semibold uppercase tracking-wider">
                Recruitment CMS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
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
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Public Website Link */}
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
              Public Portal
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-charcoal-800 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-primary-400" />
                <span>View Live Portal</span>
              </span>
            </Link>
          </div>
        </div>

        {/* User Info & Connection Status */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-950/40 space-y-3">
          {/* Supabase Status Pill */}
          <div className="flex items-center justify-between text-[11px] bg-charcoal-800 px-2.5 py-1.5 rounded-lg border border-charcoal-700">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Backend:</span>
            </span>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 text-secondary-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse"></span>
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-primary-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                <span>Local Mode</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="truncate max-w-[150px]">
              <span className="text-xs font-semibold text-white block truncate">
                {user?.email || 'Admin User'}
              </span>
              <span className="text-[10px] text-slate-400 block uppercase">
                Administrator
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-charcoal-800 transition-colors"
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
