import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { getLevel, getNextLevel, getModuleOf, GAME_MECHANICS, getLevelXP } from '../data/levels'
import { Topbar } from '../components/Layout'
import { Icon } from '../components/Icon'
import GameEngine from '../components/GameEngine'
import { Celebration } from '../components/Particles'
import { playTapSFX, playLevelMusic, playMapMusic, pauseAllMusic } from '../hooks/useAmbientMusic'

const CELEBRATE_DELAY = 1800
const MODULE_DONE_DELAY = 2600
const FALLBACK_AFTER = 3500

export default function LevelPlay() {
  const { id } = useParams()
  const nav = useNavigate()
  const { getLevelProgress, saveLevel, isLevelUnlocked } = useProgress()
  const level = getLevel(id)
  const mod = getModuleOf(id)
  const flavor = GAME_MECHANICS[id]
  const existing = getLevelProgress(id)

  const [phase, setPhase] = useState('play')
  const [showFallback, setShowFallback] = useState(false)
  const advanceTimer = useRef(null)
  const fallbackTimer = useRef(null)
  const currentLevelId = useRef(id)

  const next = getNextLevel(id)
  const isLastOfModulA = mod?.id === 'A' && id === 'A11'
  const isLastOfModulB = mod?.id === 'B' && id === 'B7'
  const isLastOfModulC = mod?.id === 'C' && id === 'C7'
  const moduleDone = isLastOfModulA || isLastOfModulB || isLastOfModulC

  // Reset phase saat id berubah
  useEffect(() => {
    currentLevelId.current = id
    setPhase('play')
    setShowFallback(false)
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
    if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    return () => {
      if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
      if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    }
  }, [id])

  const advance = useCallback(() => {
    if (currentLevelId.current !== id) return
    if (next) nav(`/level/${next.id}`, { replace: true })
    else nav('/result', { replace: true })
  }, [id, next, nav])

  const onComplete = useCallback((finalAnswers) => {
    saveLevel(id, finalAnswers, 'completed').catch(() => {})
    setPhase('celebrate')
    const delay = moduleDone ? MODULE_DONE_DELAY : CELEBRATE_DELAY
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => advance(), delay)
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
    fallbackTimer.current = setTimeout(() => setShowFallback(true), FALLBACK_AFTER)
  }, [id, moduleDone, saveLevel, advance])

  const goNext = useCallback(() => {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
    if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    advance()
  }, [advance])

  // Musik level saat play, musik peta saat keluar
  useEffect(() => {
    if (phase === 'play') { try { playLevelMusic() } catch {} }
    return () => { try { playMapMusic() } catch {} }
  }, [phase, id])

  // SFX saat celebrate
  useEffect(() => {
    if (phase === 'celebrate') { try { playTapSFX() } catch {} }
  }, [phase])

  // Early returns (setelah semua hooks)
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

  if (phase === 'celebrate') {
    const celebEmoji = moduleDone ? (isLastOfModulA ? '💜' : isLastOfModulB ? '🌊' : '🎉') : flavor?.emoji || '🎉'
    const celebTitle = moduleDone ? (isLastOfModulA ? 'Modul Peta Samudra Rasa Selesai!' : isLastOfModulB ? 'Modul Tipe Pola Asuh Selesai!' : 'Modul Ekspedisi Pondasi Bahtera Selesai!') : 'Level Selesai!'
    return (
      <div className="app-wrap">
        <Topbar title="Level Selesai" onBack={() => nav('/map')} />
        <div className="page" style={{ justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center', paddingTop: 40, gap: 20 }}>
          <Celebration show moduleDone={moduleDone} />
          <div className={`celebrate-text ${moduleDone ? 'module-done' : ''}`}>
            <div className="c-emoji">{celebEmoji}</div>
            <div className="c-title">{celebTitle}</div>
            <div className="c-sub">{level.name}</div>
            <div className="c-xp">+<strong>{getLevelXP(id)}</strong> XP</div>
          </div>
          {moduleDone && isLastOfModulA && (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Lanjut ke Modul Tipe Pola Asuh 💫</div>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Hasil refleksi cinta kamu akan muncul di akhir.
              </p>
            </div>
          )}
          {moduleDone && isLastOfModulB && (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Lanjut ke Modul Ekspedisi Pondasi Bahtera 💫</div>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Semua hasil akan muncul di halaman hasil akhir.
              </p>
            </div>
          )}
          {moduleDone && isLastOfModulC && (
            <div className="card fade-in" style={{ background: 'var(--lylac-50)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--lylac-700)' }}>Semua modul selesai! 🎊</div>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Mengarahkan ke halaman hasil akhir…
              </p>
            </div>
          )}
          {!moduleDone && (
            <p className="muted fade-in" style={{ fontSize: 13 }}>
              Lanjut ke level berikutnya otomatis…
            </p>
          )}
          {showFallback && (
            <div className="col fade-in" style={{ gap: 10, width: '100%' }}>
              <button className="btn" onClick={goNext}>
                {next ? `Lanjut: ${next.name} →` : 'Lihat Hasil →'}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => nav('/map')}
          className="celebrate-back-btn"
          aria-label="Kembali ke Peta"
        >
          <Icon name="back" size={18} />
          <span>Peta</span>
        </button>
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
