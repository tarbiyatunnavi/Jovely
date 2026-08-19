import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Topbar, Alert } from '../components/Layout'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [form, setForm] = useState({ name: '', age: '', gender: 'P', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
        password: form.password
      })
      nav(loc.state?.from || '/map', { replace: true })
    } catch (err) {
      setErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrap">
      <Topbar title="Daftar Akun" onBack={() => nav('/')} />
      <form className="page" onSubmit={submit} style={{ paddingTop: 20 }}>
        <h2 className="h-title">Bikin akun Jovely ✨</h2>
        <p className="h-sub">Sedikit data, langsung mulai eksplorasi.</p>
        <Alert>{err}</Alert>
        <div className="col">
          <div>
            <label className="label">Nama</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama kamu" required />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Usia</label>
              <input className="input" type="number" min="18" max="120" value={form.age} onChange={e => set('age', e.target.value)} placeholder="18+" required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Jenis Kelamin</label>
              <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="P">Perempuan</option>
                <option value="L">Laki-laki</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Nomor HP (WhatsApp)</label>
            <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxx atau 62xxx" inputMode="tel" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimal 6 karakter" minLength="6" required />
          </div>
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Mendaftarkan...' : 'Daftar'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>
          Udah punya akun? <Link to="/login" style={{ color: 'var(--lylac-600)', fontWeight: 600 }}>Masuk sini</Link>
        </p>
      </form>
    </div>
  )
}
