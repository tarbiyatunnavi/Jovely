import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { getLevel, getNextLevel, getModuleOf, GAME_MECHANICS, getLevelXP } from '../data/levels'
import { Topbar } from '../components/Layout'
import { Icon } from '../components/Icon'
import GameEngine from '../components/GameEngine'
import { Celebration } from '../components/Particles'

const CELEBRATE_DELAY = 1800
const MODULE_DONE_DELAY = 2600
const FALLBACK_AFTER = 3500 // tampilkan tombol manual kalau auto belum jalan

export default function LevelPlay() {
  const { id } = useParams()
  const nav = useNavigate()
  const { getLevelProgress, saveLevel, isLevelUnlocked } = useProgress()
  const level = getLevel(id)
  const mod = getModuleOf(id)
  const flavor = GAME_MECHANICS[id]
  const existing = getLevelProgress(id)

  const [phase, setPhase] = useState('play') // 'play' | 'celebrate'
  const [showFallback, setShowFallback] = useState(false)
  const advanceTimer = useRef(null)
  const fallbackTimer = useRef(null)
  const currentLevelId = useRef(id)

  // Reset phase ke 'play' setiap kali id (level) berubah — INI KUNCINYA
  // supaya navigate dari /level/A1 → /level/A2 benar-benar render game baru.
  useEffect(() => {
    currentLevelId.current = id
    setPhase('play')
    setShowFallback(false)
    // bersihkan timer lama kalau ada
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
    if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    return () => {
      if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
      if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    }
  }, [id])

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

  const advance = useCallback(() => {
    // pastikan level id yang dirayakan masih sama dgn level aktif (hindari race condition)
    if (currentLevelId.current !== id) return
    if (next) nav(`/level/${next.id}`, { replace: true })
    else nav('/result', { replace: true })
  }, [id, next, nav])

  const onComplete = useCallback((finalAnswers) => {
    // Mulai simpan progress di background (jangan tunggu)
    saveLevel(id, finalAnswers, 'completed').catch(() => {})

    // Tampilkan layar perayaan
    setPhase('celebrate')

    // Jadwalkan auto-advance
    const delay = moduleDone ? MODULE_DONE_DELAY : CELEBRATE_DELAY
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => advance(), delay)

    // Fallback: kalau setelah FALLBACK_AFTER ms belum pindah, tampilkan tombol manual
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
    fallbackTimer.current = setTimeout(() => setShowFallback(true), FALLBACK_AFTER)
  }, [id, moduleDone, saveLevel, advance])

  const goNext = useCallback(() => {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
    if (fallbackTimer.current) { clearTimeout(fallbackTimer.current); fallbackTimer.current = null }
    advance()
  }, [advance])

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
          {!moduleDone && (
            <p className="muted fade-in" style={{ marginTop: 16, fontSize: 13 }}>
              Lanjut ke level berikutnya otomatis…
            </p>
          )}
          {/* Fallback: tombol manual muncul kalau auto-advance belum jalan */}
          {showFallback && (
            <div className="col fade-in" style={{ marginTop: 20, gap: 10, width: '100%' }}>
              <button className="btn" onClick={goNext}>
                {next ? `Lanjut: ${next.name} →` : 'Lihat Hasil →'}
              </button>
            </div>
          )}
        </div>
        {/* Tombol "Kembali ke Peta" — fixed di bawah, terpisah dari konten perayaan,
            area tap besar, tidak akan ketimpa confetti (pointer-events:none) */}
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
