import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { FloatingSocialLinks } from './components/common/FloatingSocialLinks'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Jobs } from './pages/Jobs'
import { JobDetails } from './pages/JobDetails'
import { Contact } from './pages/Contact'
import { Reviews } from './pages/Reviews'
import { Gallery } from './pages/Gallery'

// Admin
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminJobs } from './pages/admin/AdminJobs'
import { AdminApplications } from './pages/admin/AdminApplications'
import { AdminBanner } from './pages/admin/AdminBanner'
import { AdminReviews } from './pages/admin/AdminReviews'
import { AdminGallery } from './pages/admin/AdminGallery'
import { AdminSettings } from './pages/admin/AdminSettings'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { ErrorBoundary } from './components/common/ErrorBoundary'

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-white text-slate-600 antialiased overflow-x-hidden">
    <Navbar />
    <main className="flex-1 w-full">{children}</main>
    <Footer />
    {/* Floating Social Media Buttons (only on public portal) */}
    <FloatingSocialLinks />
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
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
            <Route
              path="/reviews"
              element={
                <PublicLayout>
                  <Reviews />
                </PublicLayout>
              }
            />
            <Route
              path="/gallery"
              element={
                <PublicLayout>
                  <Gallery />
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
              <Route path="banner" element={<AdminBanner />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  </ErrorBoundary>
)
}
