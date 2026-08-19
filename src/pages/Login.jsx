import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Topbar, Alert } from '../components/Layout'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await login(form.phone, form.password)
      nav(loc.state?.from || '/map', { replace: true })
    } catch (err) {
      setErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrap">
      <Topbar title="Masuk" onBack={() => nav('/')} />
      <form className="page" onSubmit={submit} style={{ paddingTop: 20 }}>
        <h2 className="h-title">Halo lagi! 👋</h2>
        <p className="h-sub">Lanjutin perjalanan kamu dari yang terakhir.</p>
        <Alert>{err}</Alert>
        <div className="col">
          <div>
            <label className="label">Nomor HP</label>
            <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xxx" inputMode="tel" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" required />
          </div>
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Masuk...' : 'Masuk'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>
          Lupa password? <Link to="/forgot" style={{ color: 'var(--lylac-600)', fontWeight: 600 }}>Reset di sini</Link>
        </p>
        <p className="muted" style={{ textAlign: 'center' }}>
          Belum punya akun? <Link to="/register" style={{ color: 'var(--lylac-600)', fontWeight: 600 }}>Daftar</Link>
        </p>
      </form>
    </div>
  )
}
