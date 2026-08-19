import { useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { getLevel, getNextLevel, getModuleOf, GAME_MECHANICS, getLevelXP } from '../data/levels'
import { Topbar } from '../components/Layout'
import GameEngine from '../components/GameEngine'

export default function LevelPlay() {
  const { id } = useParams()
  const nav = useNavigate()
  const { getLevelProgress, saveLevel, isLevelUnlocked } = useProgress()
  const level = getLevel(id)
  const mod = getModuleOf(id)
  const mechanic = GAME_MECHANICS[id]?.type
  const existing = getLevelProgress(id)
  const [done, setDone] = useState(false)

  if (!level) {
    return (
      <div className="app-wrap">
        <Topbar title="Level" onBack={() => nav('/map')} />
        <div className="page"><p>Level tidak ditemukan.</p></div>
      </div>
    )
  }
  if (!isLevelUnlocked(id)) {
    return (
      <div className="app-wrap">
        <Topbar title={level.name} onBack={() => nav('/map')} />
        <div className="page">
          <div className="card center" style={{ padding: 40, gap: 12 }}>
            <p>Level ini belum terbuka. Selesaikan level sebelumnya dulu yuk!</p>
            <button className="btn" onClick={() => nav('/map')}>Kembali ke Peta</button>
          </div>
        </div>
      </div>
    )
  }

  const onComplete = async (finalAnswers) => {
    await saveLevel(id, finalAnswers, 'completed')
    setDone(true)
  }

  if (done) {
    const next = getNextLevel(id)
    const isLastOfModulA = mod.id === 'A' && id === 'A12'
    return (
      <div className="app-wrap">
        <Topbar title="Level Selesai" onBack={() => nav('/map')} />
        <div className="page fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 20 }}>
          <div style={{ fontSize: 56 }}>🎉</div>
          <h2 className="h-title" style={{ fontSize: 24 }}>Level Selesai!</h2>
          <p className="muted">{level.name} · +{getLevelXP(id)} XP</p>
          <div className="card" style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--lylac-600)' }}>+{getLevelXP(id)}</div>
            <div className="muted">XP didapat</div>
          </div>
          {isLastOfModulA ? (
            <>
              <div className="card" style={{ width: '100%', background: 'var(--lylac-50)' }}>
                <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Modul Cinta Romantis selesai! 💜</div>
                <p className="muted" style={{ marginTop: 6 }}>
                  Lanjut ke Modul Kesiapan Menikah. Hasil refleksi cinta kamu akan muncul di akhir Modul B.
                </p>
              </div>
              <button className="btn" onClick={() => nav('/map')}>Lanjut ke Modul B</button>
            </>
          ) : next ? (
            <button className="btn" onClick={() => nav(`/level/${next.id}`)}>Level Selanjutnya →</button>
          ) : (
            <button className="btn" onClick={() => nav('/result')}>Lihat Hasil Akhir →</button>
          )}
          <button className="btn btn-ghost" onClick={() => nav('/map')}>Kembali ke Peta</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-wrap">
      <Topbar title={level.name} onBack={() => nav('/map')} />
      <div className="page">
        <GameEngine
          key={id}
          level={level}
          mechanic={mechanic}
          onComplete={onComplete}
          initialAnswers={existing?.answers || {}}
        />
      </div>
    </div>
  )
}
