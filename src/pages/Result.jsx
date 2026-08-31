import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { scoreLoveStyles, scoreParentingStyles, scoreMarriageReadiness, interpret, ALL_LEVELS, MODULES, LEVEL_EMOJI, LEVEL_GRADIENT, TOTAL_LEVELS } from '../data/levels'
import { Topbar, Spinner, Alert } from '../components/Layout'
import { Icon } from '../components/Icon'
import { useAmbientMusic, playMapMusic } from '../hooks/useAmbientMusic'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function Result() {
  const nav = useNavigate()
  const { progress, loaded, getLevelProgress, authedFetch, loadFromServer } = useProgress()
  const [saved, setSaved] = useState(false)
  const [serverResult, setServerResult] = useState(null)
  const { muted, toggleMute } = useAmbientMusic()

  // Mulai musik peta + reload progress dari server saat masuk halaman Hasil
  useEffect(() => {
    try { playMapMusic() } catch {}
    loadFromServer()
  }, [])

  // Kumpulkan jawaban dari semua level
  const levelAnswers = {}
  ALL_LEVELS.forEach(l => {
    const p = getLevelProgress(l.id)
    if (p?.answers) levelAnswers[l.id] = p.answers
  })

  const allCompleted = ALL_LEVELS.every(l => getLevelProgress(l.id)?.status === 'completed')
  const loveStyles = scoreLoveStyles(levelAnswers)
  const parentingStyles = scoreParentingStyles(levelAnswers)
  const readiness = scoreMarriageReadiness(levelAnswers)

  // Serialisasi jawaban untuk deteksi perubahan (supaya hasil re-save saat jawaban berubah)
  const answersHash = JSON.stringify(levelAnswers)

  // Simpan hasil ke server saat semua selesai atau saat jawaban berubah
  useEffect(() => {
    if (!allCompleted) return
    const snapshot = { loveStyles, parentingStyles, readiness, totalPercent: readiness.totalPercent, answersHash }
    if (saved === answersHash) return // sudah tersimpan untuk jawaban ini
    let cancelled = false
    ;(async () => {
      try {
        await authedFetch('/result', {
          method: 'POST',
          body: JSON.stringify({
            loveStyles: loveStyles,
            parentingStyles: parentingStyles,
            readiness: readiness,
            totalPercent: readiness.totalPercent
          })
        })
        if (!cancelled) setSaved(answersHash)
      } catch (e) {
        console.warn('Gagal simpan hasil:', e)
      }
    })()
    return () => { cancelled = true }
  }, [allCompleted, answersHash])

  if (!loaded) return <div className="app-wrap"><Topbar title="Hasil" showBack={false} /><Spinner label="Memuat..." /></div>

  if (!allCompleted) {
    return (
      <div className="app-wrap">
        <Topbar title="Hasil" showBack={false} />
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ fontSize: 56 }}>🔒</div>
          <h2 className="h-title">Hasil Belum Tersedia</h2>
          <p className="muted" style={{ maxWidth: 280 }}>
            Halaman hasil baru muncul setelah kamu selesai seluruh {TOTAL_LEVELS} level (Modul A & B).
          </p>
          <button className="btn" onClick={() => nav('/map')}>Lanjut Kerjakan</button>
        </div>
      </div>
    )
  }

  // Label radar: wrap ke 2 baris kalau lebih dari 2 kata (biar tidak terpotong)
  const wrapLabel = (name) => {
    const words = name.split(' ')
    if (words.length <= 1) return [name]
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
  }

  const RadarTick = ({ payload, x, y, textAnchor }) => {
    const lines = wrapLabel(payload.value || '')
    return (
      <text
        x={x} y={y}
        textAnchor={textAnchor}
        fill="var(--ink-soft)"
        fontSize={9.5}
        fontWeight={600}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? (lines.length > 1 ? -3 : 4) : 11}>
            {line}
          </tspan>
        ))}
      </text>
    )
  }

  const radarData = Object.values(readiness.dims).map(d => ({
    name: d.name,
    percent: d.percent,
    fullMark: 100
  }))

  const topLove = loveStyles.top.slice(0, 5)
  const topParenting = parentingStyles.top.slice(0, 3)

  return (
    <div className="app-wrap">
      <Topbar
        title="Hasil Akhir"
        showBack={false}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={toggleMute} className="audio-toggle-btn" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        }
      />
      <div className="page fade-in" style={{ paddingBottom: 120, gap: 20 }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--lylac-100), #fff)' }}>
          <div className="muted" style={{ fontSize: 12 }}>Skor Ekspedisi Pondasi Bahtera</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--lylac-600)', lineHeight: 1.1, margin: '8px 0' }}>
            {readiness.totalPercent}%
          </div>
          <div className="muted">dari {readiness.totalMax} poin maksimal</div>
          <div className="pill" style={{ marginTop: 12 }}>
            {interpret(readiness.totalPercent).label}
          </div>
        </div>

        {/* Judul profil (di bawah skor) */}
        {(() => {
          const p = readiness.totalPercent
          const title = p >= 80 ? '✨ Profil Kesiapan Matang & Berdaya'
            : p >= 60 ? '💪 Profil Kesiapan Berkembang & Cukup Stabil'
            : p >= 40 ? '🌱 Profil Proses Transisi & Penyembuhan Diri'
            : '🤍 Profil Masa Pemulihan & Penemuan Diri'
          return <div className="card fade-in" style={{ background: 'var(--lylac-50)', textAlign: 'center' }}><h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3></div>
        })()}

        {/* Breakdown per Dimensi + Kesiapan Menikah — di bawah profil */}
        <div>
          <h3 className="h-title" style={{ fontSize: 18, marginBottom: 4 }}>📊 Breakdown per Dimensi</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Skor kesiapan kamu di tiap aspek.</p>
          <div className="card" style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData} margin={{ top: 28, right: 48, bottom: 28, left: 48 }}>
                <PolarGrid stroke="var(--line)" />
                <PolarAngleAxis dataKey="name" tick={<RadarTick />} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 9 }} />
                <Radar dataKey="percent" stroke="var(--lylac-500)" fill="var(--lylac-400)" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col">
          {Object.values(readiness.dims).map(d => {
            const interp = interpret(d.percent, d.levelId)
            const emoji = LEVEL_EMOJI[d.levelId] || '💜'
            const gradient = LEVEL_GRADIENT[d.levelId] || 'var(--lylac-400)'
            return (
              <div key={d.levelId} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, color: '#fff'
                }}>{emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="between" style={{ marginBottom: 6 }}>
                    <div style={{ fontWeight: 700 }}>{d.name}</div>
                    <span className="pill">{d.percent}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 8 }}><div style={{ width: `${d.percent}%` }} /></div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    <strong style={{ color: 'var(--lylac-700)' }}>{interp.label}.</strong> {interp.note}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {(() => {
          const p = readiness.totalPercent
          const text = p >= 80 ? 'Berada pada tahap matang untuk memasuki pendewasaan usia pernikahan dengan stabilitas emosional dan pemahaman peran yang jernih.'
            : p >= 60 ? 'Memiliki fondasi kesiapan yang baik, namun ada beberapa dimensi spesifik (seperti komunikasi konflik atau finansial) yang masih butuh penyelarasan lebih lanjut.'
            : p >= 40 ? 'Sedang berada pada fase pemrosesan trauma. Komitmen pernikahan dipandang sebagai langkah besar yang membutuhkan kehati-hatian ekstra agar tidak mengulang pola intergenerasi orang tua.'
            : 'Memerlukan fokus penuh pada proses self-recovery, penyembuhan inner child, dan penataan kesehatan emosional diri sebelum melangkah ke komitmen pernikahan.'
          return (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>💍 Kesiapan Menikah</h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{text}</p>
            </div>
          )
        })()}

        {topLove.length > 0 && (
          <div>
            <h3 className="h-title" style={{ fontSize: 18, marginBottom: 4 }}>💜 Gaya Cinta yang Menonjol</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Dari Modul Peta Samudra Rasa — refleksi pandangan cinta kamu (3 tertinggi).
            </p>
            <div className="col">
              {topLove.slice(0, 3).map((s, i) => {
                const emoji = LEVEL_EMOJI[s.levelId] || '💜'
                const gradient = LEVEL_GRADIENT[s.levelId] || 'var(--lylac-400)'
                const interp = interpret(s.percent, s.levelId)
                return (
                  <div key={s.levelId} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, color: '#fff'
                    }}>{emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div className="progress-bar" style={{ margin: '4px 0 6px' }}><div style={{ width: `${s.percent}%` }} /></div>
                      <div className="muted" style={{ fontSize: 12 }}><strong style={{ color: 'var(--lylac-700)' }}>{interp.label}.</strong> {interp.note}</div>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: i === 0 ? 'var(--lylac-400)' : 'var(--lylac-100)',
                      color: i === 0 ? '#fff' : 'var(--lylac-600)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13
                    }}>{i + 1}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pandangan Cinta Romantis — di bawah gaya cinta yang menonjol */}
        {(() => {
          const p = readiness.totalPercent
          const text = p >= 80 ? 'Memandang cinta sebagai bentuk komitmen yang aman (secure attachment), realistis, serta saling menghargai batas diri (boundaries). Cinta tidak dilihat sebagai tuntutan, melainkan kerja sama dua arah.'
            : p >= 60 ? 'Menginginkan hubungan yang stabil dan sehat, tetapi terkadang masih muncul sedikit rasa cemas, takut akan konflik berkepanjangan, atau keraguan spontan mengenai masa depan.'
            : p >= 40 ? 'Menatap cinta dengan sikap waspada (anxious/avoidant). Ada kerinduan besar untuk dicintai dan diterima, tetapi dibayangi ketakutan bahwa apa yang dilakukan "tidak akan pernah cukup".'
            : 'Memandang hubungan romantis atau pernikahan sebagai hal yang menakutkan, membebankan, atau berisiko mengulang rasa sakit yang pernah disaksikan/dialami di rumah masa kecil.'
          return (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>💜 Pandangan Cinta Romantis</h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{text}</p>
            </div>
          )
        })()}

        {topLove.length > 0 && (
          <div>
            <h3 className="h-title" style={{ fontSize: 18, marginBottom: 4 }}>👨‍👩‍👧 Pola Asuh yang Menonjol</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Dari Modul Arus Bawah Laut — pola asuh yang paling menonjol (3 tertinggi).
            </p>
            <div className="col">
              {topParenting.map((s, i) => {
                const emoji = LEVEL_EMOJI[s.levelId] || '🌊'
                const gradient = LEVEL_GRADIENT[s.levelId] || 'var(--lylac-400)'
                const interp = interpret(s.percent, s.levelId)
                return (
                  <div key={s.levelId} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, color: '#fff'
                    }}>{emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div className="progress-bar" style={{ margin: '4px 0 6px' }}><div style={{ width: `${s.percent}%` }} /></div>
                      <div className="muted" style={{ fontSize: 12 }}><strong style={{ color: 'var(--lylac-700)' }}>{interp.label}.</strong> {interp.note}</div>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: i === 0 ? 'var(--lylac-400)' : 'var(--lylac-100)',
                      color: i === 0 ? '#fff' : 'var(--lylac-600)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13
                    }}>{i + 1}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Implikasi Pola Asuh — di bawah pola asuh yang menonjol */}
        {(() => {
          const p = readiness.totalPercent
          const text = p >= 80 ? 'Pengalaman masa kecil didominasi oleh tipe Otoritatif yang penuh kehangatan, komunikasi dua arah, dan dukungan kebebasan. Jika pernah mengalami pola otoriter, kamu telah berhasil melalui proses reparenting dan penyembuhan luka masa lalu secara mandiri.'
            : p >= 60 ? 'Pernah menerima pola asuh Campuran (Otoritatif dengan sedikit pengaruh Otoriter/Permisif). Kehangatan keluarga dirasakan, namun sesekali masih ada ingatan akan komunikasi yang kurang konsisten atau tuntutan berlebih.'
            : p >= 40 ? 'Cenderung dibesarkan dengan pola asuh Otoriter atau Permisif. Pernah mengalami kekerasan verbal/fisik, dibatasi, atau kurang diapresiasi, sehingga memicu kebiasaan overthinking dan meragukan nilai diri.'
            : 'Sangat dominan menerima pola asuh Otoriter di masa kecil. Lingkungan tumbuh yang minim afeksi dan sarat tekanan membuat respons bertahan diri (fight/flight/freeze) atau rasa bersalah berlebih masih mendominasi keseharian.'
          return (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>👨‍👩‍👧 Implikasi Pola Asuh</h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{text}</p>
            </div>
          )
        })()}

        {/* Rekomendasi Reflektif — di atas disclaimer */}
        {(() => {
          const p = readiness.totalPercent
          const text = p >= 80 ? 'Tetap rawat komunikasi terbuka. Gunakan pemahaman diri yang kamu miliki untuk menjadi pilar pendukung dan ruang aman bagi pasangan kelak.'
            : p >= 60 ? 'Fokus pada aspek yang belum mantap. Latih ekspresi emosi secara jujur tanpa takut dihakimi, serta perjelas ekspektasi hubungan bersama pasangan.'
            : p >= 40 ? 'Beri jeda pada dirimu. Mengakui luka masa lalu adalah awal pemulihan. Ingatlah bahwa kamu layak dicintai tanpa harus menjadi sempurna terlebih dahulu.'
            : 'Jangan terburu-buru. Fokus utamamu saat ini adalah membangun hubungan yang aman dengan diri sendiri. Pendewasaan pernikahan dimulai dari diri yang pulih.'
          return (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>✨ Rekomendasi Reflektif</h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{text}</p>
            </div>
          )
        })()}

        <div className="card" style={{ background: 'var(--lylac-50)', textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>🤍</div>
          <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            Hasil ini bersifat <strong>reflektif & edukatif</strong>, bukan vonis klinis atau diagnosis.
            Setiap orang punya ritmenya sendiri — yang penting kamu makin kenal diri.
          </p>
        </div>

        <div className="row">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => nav('/map')}>Peta Level</button>
          <button className="btn" style={{ flex: 1 }} onClick={() => nav('/profile')}>Profil</button>
        </div>
      </div>
    </div>
  )
}
