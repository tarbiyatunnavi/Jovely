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
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Selamat Datang di JOVELY! 🪐✨</h3>
            <p style={{ marginBottom: 12 }}>
              Pernah penasaran bagaimana caramu mengambil keputusan saat dihadapkan pada dinamika rasa, pilihan hidup, dan alur masa depan? JOVELY hadir sebagai ruang simulasi interaktif tempat kamu bisa bebas mengeksplorasi navigasi hatimu dengan cara yang seru, santai, dan penuh makna.
            </p>
            <p style={{ marginBottom: 14 }}>
              Di sini, kamu bukan sedang diuji atau dinilai. JOVELY adalah cermin interaktif sebuah petualangan mini untuk membantumu mengurai benang kusut di kepala, memahami pola energimu sendiri, dan menemukan kembali kejernihan langkahmu.
            </p>
            <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Apa yang Bisa Kamu Temukan di JOVELY?</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>🧭</span>
                <span><strong>Peta Eksplorasi Interaktif:</strong> Lewati berbagai alur cerita dan skenario unik. Setiap pilihan yang kamu ambil akan membuka babak baru dalam peta perjalananmu.</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>🛡️</span>
                <span><strong>Kartu Karakter Unik:</strong> Di akhir setiap petualangan, buka Archetype atau tipe karakter khusus yang menggambarkan gaya navigasimu dan amunisi yang kamu miliki.</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>💡</span>
                <span><strong>Ruang Refleksi Diri:</strong> Temukan insight bermakna yang bisa membantumu lebih mengenal diri sendiri dengan cara yang menyenangkan tanpa menghakimi.</span>
              </li>
            </ul>
            <p style={{ marginBottom: 12 }}>
              Tidak ada jawaban benar atau salah di dunia JOVELY. Setiap keputusan adalah cerminan dari cerita unikmu sendiri.
            </p>
            <p>
              Siap memulai ekspedisimu hari ini? Ambil kendali kompasmu dan temukan ke mana arah angin membawamu! 🚀🎮
            </p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Yang Kamu Temui</h3>
          <div className="col" style={{ gap: 10, fontSize: 14 }}>
            <div className="between"><span className="muted">Total Level</span><strong>{TOTAL_LEVELS}</strong></div>
            <div className="between"><span className="muted">Total Item Reflektif</span><strong>{TOTAL_ITEMS}</strong></div>
            <div className="between"><span className="muted">Modul A — {MODULES[0].name}</span><strong>{MODULES[0].levels.length} level</strong></div>
            <div className="between"><span className="muted">Modul B — {MODULES[1].name}</span><strong>{MODULES[1].levels.length} level</strong></div>
            <div className="between"><span className="muted">Modul C — {MODULES[2].name}</span><strong>{MODULES[2].levels.length} level</strong></div>
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
