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
  Database,
  Image as ImageIcon,
  Film,
  Images,
  Settings
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
    { name: 'Candidate Applications', path: '/admin/applications', icon: Users },
    { name: 'Homepage Banner', path: '/admin/banner', icon: ImageIcon },
    { name: 'Manage Reviews', path: '/admin/reviews', icon: Film },
    { name: 'Activity Gallery', path: '/admin/gallery', icon: Images },
    { name: 'Company Settings', path: '/admin/settings', icon: Settings }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#26075D] text-white p-4 flex items-center justify-between border-b border-[#3E0F87] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFC900] flex items-center justify-center font-black text-sm text-[#26075D]">
            JMS
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Admin CMS</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-[#321078] text-white"
          aria-label="Toggle admin sidebar"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#26075D] text-slate-200 flex flex-col justify-between border-r border-[#3E0F87] transition-transform duration-200 ease-in-out shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#FFC900] flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-[#26075D]">
                J<span className="text-[#5015A8]">MS</span>
              </span>
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-tight leading-tight">
                JOY MANPOWER
              </div>
              <div className="text-[10px] text-[#FFC900] font-bold uppercase tracking-wider">
                Recruitment Admin
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
              Recruitment CMS
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-[#FFC900] text-[#26075D] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#26075D] stroke-[2.5]' : 'text-slate-400'}`} />
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
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <ExternalLink className="w-3.5 h-3.5 text-[#FFC900]" />
                <span>View Live Website</span>
              </span>
            </Link>
          </div>
        </div>

        {/* User Info & Connection Status */}
        <div className="p-4 border-t border-white/10 bg-[#1D0547] space-y-3">
          {/* Supabase Status Pill */}
          <div className="flex items-center justify-between text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-[#FFC900]" />
              <span>Database:</span>
            </span>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#FFC900] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC900]"></span>
                <span>Local Storage</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="truncate max-w-[150px]">
              <span className="text-xs font-bold text-white block truncate">
                {user?.email || 'Admin User'}
              </span>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Administrator
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F4F5F8] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
