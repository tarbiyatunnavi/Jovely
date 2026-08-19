import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'jovely_token'
const USER_KEY = 'jovely_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [loading, setLoading] = useState(true)

  const API = import.meta.env.PROD ? '/api' : '/api'

  const req = useCallback(async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API}${path}`, { ...opts, headers })
    const data = await res.json().catch(() => ({ ok: false, error: 'Network error' }))
    if (!res.ok && res.status !== 401) throw new Error(data.error || 'Request gagal')
    return { res, data }
  }, [token, API])

  const authedFetch = useCallback(async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API}${path}`, { ...opts, headers })
    return res.json().catch(() => ({ ok: false, error: 'Network error' }))
  }, [token, API])

  const login = useCallback(async (phone, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Login gagal')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  }, [API])

  const register = useCallback(async (payload) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Registrasi gagal')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  }, [API])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) { setLoading(false); return }
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.ok) {
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } else {
        logout()
      }
    } catch {
      // offline: keep local
    } finally {
      setLoading(false)
    }
  }, [token, API, logout])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const value = {
    user, token, loading, isAuthed: !!user,
    login, register, logout, refreshUser,
    authedFetch, req
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus di dalam AuthProvider')
  return ctx
}
