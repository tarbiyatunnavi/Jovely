import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import { BottomNav } from './components/Layout'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import MapPage from './pages/MapPage'
import LevelPlay from './pages/LevelPlay'
import Result from './pages/Result'
import Profile from './pages/Profile'
import Terms from './pages/Terms'
import About from './pages/About'
import Contact from './pages/Contact'

function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!isAuthed) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

function Shell({ children }) {
  return (
    <div className="app-wrap">
      {children}
      <BottomNav />
    </div>
  )
}

function RoutesInner() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/map" element={<RequireAuth><ProgressProvider><Shell><MapPage /></Shell></ProgressProvider></RequireAuth>} />
      <Route path="/level/:id" element={<RequireAuth><ProgressProvider><Shell><LevelPlay /></Shell></ProgressProvider></RequireAuth>} />
      <Route path="/result" element={<RequireAuth><ProgressProvider><Shell><Result /></Shell></ProgressProvider></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProgressProvider><Shell><Profile /></Shell></ProgressProvider></RequireAuth>} />
      <Route path="/terms" element={<Shell><Terms /></Shell>} />
      <Route path="/about" element={<Shell><About /></Shell>} />
      <Route path="/contact" element={<Shell><Contact /></Shell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesInner />
      </BrowserRouter>
    </AuthProvider>
  )
}
