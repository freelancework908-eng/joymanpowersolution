import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Jobs } from './pages/Jobs'
import { JobDetails } from './pages/JobDetails'
import { Contact } from './pages/Contact'

// Admin
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminJobs } from './pages/admin/AdminJobs'
import { AdminApplications } from './pages/admin/AdminApplications'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-slate-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/jobs"
            element={
              <PublicLayout>
                <Jobs />
              </PublicLayout>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <PublicLayout>
                <JobDetails />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
