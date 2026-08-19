import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { getLevel, getNextLevel, getModuleOf, GAME_MECHANICS, getLevelXP } from '../data/levels'
import { Topbar } from '../components/Layout'
import GameEngine from '../components/GameEngine'
import { Celebration } from '../components/Particles'

export default function LevelPlay() {
  const { id } = useParams()
  const nav = useNavigate()
  const { getLevelProgress, saveLevel, isLevelUnlocked } = useProgress()
  const level = getLevel(id)
  const mod = getModuleOf(id)
  const flavor = GAME_MECHANICS[id]
  const existing = getLevelProgress(id)
  const [phase, setPhase] = useState('play') // 'play' | 'celebrate'

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

  const next = getNextLevel(id)
  const isLastOfModulA = mod.id === 'A' && id === 'A12'
  const isLastOfModulB = mod.id === 'B' && id === 'B8'
  const moduleDone = isLastOfModulA || isLastOfModulB

  const onComplete = async (finalAnswers) => {
    await saveLevel(id, finalAnswers, 'completed')
    setPhase('celebrate')
    // Jeda perayaan lalu auto-advance
    const delay = moduleDone ? 2600 : 1800
    setTimeout(() => {
      if (next) nav(`/level/${next.id}`, { replace: true })
      else nav('/result', { replace: true })
    }, delay)
  }

  if (phase === 'celebrate') {
    return (
      <div className="app-wrap">
        <Topbar title="Level Selesai" onBack={() => nav('/map')} />
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Celebration
            show
            emoji={moduleDone ? (isLastOfModulA ? '💜' : '🎉') : flavor?.emoji || '🎉'}
            title={moduleDone ? (isLastOfModulA ? 'Modul Cinta Romantis Selesai!' : 'Modul Kesiapan Selesai!') : 'Level Selesai!'}
            subtitle={level.name}
            xp={getLevelXP(id)}
            moduleDone={moduleDone}
          />
          {moduleDone && isLastOfModulA && (
            <div className="card fade-in" style={{ marginTop: 20, background: 'var(--lylac-50)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Lanjut ke Modul Kesiapan Menikah 💫</div>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Hasil refleksi cinta kamu akan muncul di akhir Modul B.
              </p>
            </div>
          )}
          {moduleDone && isLastOfModulB && (
            <div className="card fade-in" style={{ marginTop: 20, background: 'var(--lylac-50)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Semua modul selesai! 🎊</div>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Mengarahkan ke halaman hasil akhir…
              </p>
            </div>
          )}
          <a href="/map" className="muted" style={{ marginTop: 16, fontSize: 13, textDecoration: 'underline' }}>
            Kembali ke Peta
          </a>
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
          flavor={flavor}
          initialAnswers={existing?.answers || {}}
          onComplete={onComplete}
        />
      </div>
    </div>
  )
}
