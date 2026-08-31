import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { Topbar, Alert } from '../components/Layout'
import { Icon } from '../components/Icon'
import { playTapSFX } from '../hooks/useAmbientMusic'
import { TOTAL_LEVELS } from '../data/levels'

export default function Profile() {
  const { user, logout, authedFetch } = useAuth()
  const { completedCount, totalXP, resetAll, loadFromServer } = useProgress()
  const nav = useNavigate()
  const [history, setHistory] = useState([])
  const [err, setErr] = useState('')
  const [rating, setRating] = useState(() => {
    try { return Number(localStorage.getItem('jovely_rating')) || 0 } catch { return 0 }
  })
  const [ratingMsg, setRatingMsg] = useState(() => {
    try { return localStorage.getItem('jovely_rating_msg') || '' } catch { return '' }
  })
  const [ratingSaved, setRatingSaved] = useState(() => {
    try { return localStorage.getItem('jovely_rating_saved') === '1' } catch { return false }
  })

  const submitRating = () => {
    try {
      localStorage.setItem('jovely_rating', String(rating))
      localStorage.setItem('jovely_rating_msg', ratingMsg)
      localStorage.setItem('jovely_rating_saved', '1')
    } catch {}
    setRatingSaved(true)
    try { playTapSFX() } catch {}
  }

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
    if (!confirm('Yakin reset semua progress? Semua jawaban level akan dihapus.')) return
    await resetAll()
    await loadFromServer()
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

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 className="h-title" style={{ fontSize: 16, marginBottom: 4 }}>⭐ Penilaian Kamu</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Seberapa puas kamu sama Jovely?</p>
          <div className="rating-stars" style={{ marginBottom: 12 }}>
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`rating-star ${n <= rating ? 'active' : ''}`}
                aria-label={`${n} bintang`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && !ratingSaved && (
            <>
              <textarea
                className="input rating-feedback"
                placeholder="Ceritakan pengalamanmu (opsional)..."
                value={ratingMsg}
                onChange={e => setRatingMsg(e.target.value)}
                rows={2}
                style={{ width: '100%', resize: 'none', marginBottom: 10, fontSize: 13 }}
              />
              <button className="btn lk-submit" onClick={submitRating}>Kirim Penilaian</button>
            </>
          )}
          {ratingSaved && (
            <p style={{ fontSize: 14, color: 'var(--lylac-600)', fontWeight: 600 }}>Terima kasih atas penilaianmu! 💜</p>
          )}
        </div>

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
