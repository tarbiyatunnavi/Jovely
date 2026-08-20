import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { scoreLoveStyles, scoreMarriageReadiness, interpret, ALL_LEVELS, MODULES, LEVEL_EMOJI, LEVEL_GRADIENT } from '../data/levels'
import { Topbar, Spinner, Alert } from '../components/Layout'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function Result() {
  const nav = useNavigate()
  const { progress, loaded, getLevelProgress, authedFetch } = useProgress()
  const [saved, setSaved] = useState(false)
  const [serverResult, setServerResult] = useState(null)

  // Kumpulkan jawaban dari semua level
  const levelAnswers = {}
  ALL_LEVELS.forEach(l => {
    const p = getLevelProgress(l.id)
    if (p?.answers) levelAnswers[l.id] = p.answers
  })

  const allCompleted = ALL_LEVELS.every(l => getLevelProgress(l.id)?.status === 'completed')
  const loveStyles = scoreLoveStyles(levelAnswers)
  const readiness = scoreMarriageReadiness(levelAnswers)

  // Simpan hasil ke server (sekali) saat semua selesai
  useEffect(() => {
    if (!allCompleted || saved) return
    (async () => {
      try {
        await authedFetch('/result', {
          method: 'POST',
          body: JSON.stringify({
            loveStyles: loveStyles,
            readiness: readiness,
            totalPercent: readiness.totalPercent
          })
        })
        setSaved(true)
      } catch (e) {
        console.warn('Gagal simpan hasil:', e)
      }
    })()
  }, [allCompleted, saved])

  if (!loaded) return <div className="app-wrap"><Topbar title="Hasil" showBack={false} /><Spinner label="Memuat..." /></div>

  if (!allCompleted) {
    return (
      <div className="app-wrap">
        <Topbar title="Hasil" showBack={false} />
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ fontSize: 56 }}>🔒</div>
          <h2 className="h-title">Hasil Belum Tersedia</h2>
          <p className="muted" style={{ maxWidth: 280 }}>
            Halaman hasil baru muncul setelah kamu selesai seluruh 19 level (Modul A & B).
          </p>
          <button className="btn" onClick={() => nav('/map')}>Lanjut Kerjakan</button>
        </div>
      </div>
    )
  }

  const radarData = Object.values(readiness.dims).map(d => ({
    name: d.name,
    percent: d.percent,
    fullMark: 100
  }))

  const topLove = loveStyles.top.slice(0, 5)

  return (
    <div className="app-wrap">
      <Topbar title="Hasil Akhir" showBack={false} />
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

        <div>
          <h3 className="h-title" style={{ fontSize: 18, marginBottom: 4 }}>📊 Breakdown per Dimensi</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Skor kesiapan kamu di tiap aspek.</p>
          <div className="card" style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="var(--line)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--ink-soft)', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 9 }} />
                <Radar dataKey="percent" stroke="var(--lylac-500)" fill="var(--lylac-400)" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col">
          {Object.values(readiness.dims).map(d => {
            const interp = interpret(d.percent)
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
                      <div className="muted" style={{ fontSize: 12 }}>{s.percent}% setuju</div>
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
