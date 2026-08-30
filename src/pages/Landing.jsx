import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Icon } from '../components/Icon'
import { TOTAL_LEVELS, TOTAL_ITEMS, MODULES } from '../data/levels'

export default function Landing() {
  const { isAuthed, loading } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (!loading && isAuthed) nav('/map', { replace: true })
  }, [isAuthed, loading, nav])

  return (
    <div className="app-wrap" style={{ padding: 0 }}>
      <div className="page fade-in" style={{ gap: 24, paddingTop: 60 }}>
        <div className="center" style={{ gap: 14 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 28,
            background: 'linear-gradient(135deg, var(--lylac-300), var(--lylac-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Icon name="heart" size={48} />
            <span style={{ position: 'absolute', color: '#fff', fontSize: 40 }}>·</span>
          </div>
          <h1 className="h-title" style={{ fontSize: 32 }}>Jovely</h1>
          <p className="h-sub" style={{ maxWidth: 280, textAlign: 'center', fontSize: 15 }}>
            Apakah kamu si perencana matang atau si penjelajah rasa? Ikuti alurnya, buat keputusanmu,
            dan buka cermin refleksi diri dengan cara yang jauh lebih menyenangkan.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lylac-600)' }}>{TOTAL_LEVELS}</div>
            <div className="muted">Level</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lylac-600)' }}>{TOTAL_ITEMS}</div>
            <div className="muted">Cermin Refleksi</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lylac-600)' }}>{MODULES.length}</div>
            <div className="muted">Modul</div>
          </div>
        </div>

        <div className="col" style={{ marginTop: 'auto' }}>
          <Link to="/register" className="btn">Mulai Perjalanan</Link>
          <Link to="/login" className="btn-ghost btn">Udah punya akun? Masuk</Link>
        </div>

        <div className="muted" style={{ textAlign: 'center', fontSize: 12, paddingBottom: 20 }}>
          Untuk dewasa muda 18+. Hasil bersifat reflektif, bukan diagnosis klinis.
        </div>
      </div>
    </div>
  )
}
