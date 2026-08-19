import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Layout'
import { Icon } from '../components/Icon'
import { TOTAL_LEVELS, TOTAL_ITEMS, MODULES } from '../data/levels'

export default function About() {
  const nav = useNavigate()
  return (
    <div className="app-wrap">
      <Topbar title="Tentang Jovely" onBack={() => nav('/profile')} />
      <div className="page fade-in">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, var(--lylac-300), var(--lylac-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon name="heart" size={36} />
          </div>
          <h3 className="h-title">Jovely</h3>
          <p className="muted">versi 1.0.0</p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Apa itu Jovely?</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Jovely adalah aplikasi self-assessment kesiapan menikah yang dikemas dengan gamifikasi
            ala Duolingo. Bukan kuesioner kaku — tapi pengalaman seperti main game yang tetap
            menghasilkan hasil psikometri bermakna di akhir.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Yang Kamu Temui</h3>
          <div className="col" style={{ gap: 10, fontSize: 14 }}>
            <div className="between"><span className="muted">Total Level</span><strong>{TOTAL_LEVELS}</strong></div>
            <div className="between"><span className="muted">Total Item Reflektif</span><strong>{TOTAL_ITEMS}</strong></div>
            <div className="between"><span className="muted">Modul A — {MODULES[0].name}</span><strong>{MODULES[0].levels.length} level</strong></div>
            <div className="between"><span className="muted">Modul B — {MODULES[1].name}</span><strong>{MODULES[1].levels.length} level</strong></div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--lylac-50)' }}>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, textAlign: 'center' }}>
            Hasil di Jovely bersifat reflektif & edukatif, bukan diagnosis klinis. Untuk keputusan
            penting, temani dengan diskusi bersama pasangan atau konselor profesional. 🤍
          </p>
        </div>
      </div>
    </div>
  )
}
