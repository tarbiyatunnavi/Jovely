import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { Topbar, Alert } from '../components/Layout'
import { Icon } from '../components/Icon'
import { TOTAL_LEVELS } from '../data/levels'

export default function Profile() {
  const { user, logout, authedFetch } = useAuth()
  const { completedCount, totalXP, resetAll } = useProgress()
  const nav = useNavigate()
  const [history, setHistory] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await authedFetch('/history')
        if (data.ok) setHistory(data.history || [])
      } catch (e) { setErr(e.message) }
    })()
  }, [])

  const onLogout = () => {
    logout()
    nav('/', { replace: true })
  }

  const onReset = async () => {
    if (!confirm('Yakin reset semua progress? Hasil tersimpan di server tidak dihapus.')) return
    resetAll()
    nav('/map')
  }

  return (
    <div className="app-wrap">
      <Topbar title="Profil" showBack={false} />
      <div className="page fade-in" style={{ paddingBottom: 120 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--lylac-300), var(--lylac-500))',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, margin: '0 auto 12px'
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.name}</div>
          <div className="muted">{user?.phone} · {user?.age} thn · {user?.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
        </div>

        <div className="row">
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lylac-600)' }}>{completedCount()}/{TOTAL_LEVELS}</div>
            <div className="muted" style={{ fontSize: 12 }}>Level selesai</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lylac-600)' }}>{totalXP()}</div>
            <div className="muted" style={{ fontSize: 12 }}>Total XP</div>
          </div>
        </div>

        {history.length > 0 && (
          <div>
            <h3 className="h-title" style={{ fontSize: 16, marginBottom: 8 }}>Riwayat Hasil</h3>
            <div className="col">
              {history.map(h => (
                <div key={h.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{h.total_percent}% kesiapan</div>
                    <div className="muted" style={{ fontSize: 12 }}>{new Date(h.completed_at).toLocaleString('id-ID')}</div>
                  </div>
                  <Icon name="result" size={22} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <Link to="/terms" className="row" style={{ padding: '14px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Syarat & Ketentuan</span><Icon name="back" size={18} style={{ transform: 'rotate(180deg)' }} />
          </Link>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <Link to="/about" className="row" style={{ padding: '14px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Tentang Aplikasi</span><Icon name="back" size={18} style={{ transform: 'rotate(180deg)' }} />
          </Link>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <Link to="/contact" className="row" style={{ padding: '14px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Hubungi Admin/CS</span><Icon name="back" size={18} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>

        <button className="btn btn-secondary" onClick={onReset}>Reset Progress Lokal</button>
        <button className="btn btn-ghost" style={{ color: '#b3261e' }} onClick={onLogout}>
          <Icon name="logout" size={18} /> Keluar
        </button>
      </div>
    </div>
  )
}
