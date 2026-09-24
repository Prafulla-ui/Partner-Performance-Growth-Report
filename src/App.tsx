import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { ReportProvider } from './context/ReportContext'
import { Login } from './pages/Login'
import { ReportDetail } from './pages/ReportDetail'
import { ReportLibrary } from './pages/ReportLibrary'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AuthProvider>
        <ReportProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <ReportLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="/reports/:id"
              element={
                <RequireAuth>
                  <ReportDetail />
                </RequireAuth>
              }
            />
            <Route path="/shared/:id" element={<ReportDetail publicView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReportProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
