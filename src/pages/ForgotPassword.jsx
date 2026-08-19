import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Topbar, Alert } from '../components/Layout'

export default function ForgotPassword() {
  const { authedFetch } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(1) // 1: kirim nomor, 2: input token+new pass
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [serverToken, setServerToken] = useState('') // untuk MVP
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const sendToken = async (e) => {
    e.preventDefault()
    setErr(''); setOk(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setServerToken(data.token)
      setOk('Kode reset dibuat. Untuk MVP, kode kamu: ' + data.token)
      setStep(2)
    } catch (err) {
      setErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  const doReset = async (e) => {
    e.preventDefault()
    setErr(''); setOk(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setOk('Password berhasil direset. Silakan login.')
      setTimeout(() => nav('/login'), 1500)
    } catch (err) {
      setErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrap">
      <Topbar title="Lupa Password" onBack={() => nav('/login')} />
      {step === 1 ? (
        <form className="page" onSubmit={sendToken} style={{ paddingTop: 20 }}>
          <h2 className="h-title">Reset Password</h2>
          <p className="h-sub">Masukin nomor HP kamu, kita kirim kode reset.</p>
          <Alert>{err}</Alert>
          <Alert type="ok">{ok}</Alert>
          <div>
            <label className="label">Nomor HP</label>
            <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxx" inputMode="tel" required />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Kode Reset'}</button>
          <Link to="/login" className="btn btn-ghost">Batal</Link>
        </form>
      ) : (
        <form className="page" onSubmit={doReset} style={{ paddingTop: 20 }}>
          <h2 className="h-title">Masukkan Kode</h2>
          <p className="h-sub">Cek kode 6 karakter di atas (MVP), lalu bikin password baru.</p>
          <Alert>{err}</Alert>
          <Alert type="ok">{ok}</Alert>
          <div>
            <label className="label">Kode Reset</label>
            <input className="input" value={token} onChange={e => setToken(e.target.value)} placeholder="ABC123" maxLength="6" required />
          </div>
          <div>
            <label className="label">Password Baru</label>
            <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" minLength="6" required />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Reset Password'}</button>
        </form>
      )}
    </div>
  )
}
