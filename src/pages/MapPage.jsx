import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { MODULES, TOTAL_LEVELS, getLevelXP, GAME_MECHANICS } from '../data/levels'
import { Topbar } from '../components/Layout'
import { Icon } from '../components/Icon'

// Emoji representatif per dimensi (ambil dari flavor, B8 ganti 🫂 untuk acceptance)
const LEVEL_EMOJI = {
  A1: '💞', A2: '🏠', A3: '✨', A4: '🧲', A5: '⚡', A6: '🌱', A7: '🧩', A8: '🤍',
  A9: '🤝', A10: '🙈', A11: '🚩', A12: '🔥',
  B1: '💧', B2: '👥', B3: '⚖️', B4: '💰', B5: '🕌', B6: '🌐', B7: '🧠', B8: '🫂'
}

// Gradasi warna per dimensi (soft lylac + aksen senada per tema)
const LEVEL_GRADIENT = {
  A1: 'linear-gradient(135deg,#f9c5d1,#b8a4d9)', A2: 'linear-gradient(135deg,#c8a8d4,#9b82c4)',
  A3: 'linear-gradient(135deg,#d0b9e7,#b8a4d9)', A4: 'linear-gradient(135deg,#b8a4d9,#7f5fa8)',
  A5: 'linear-gradient(135deg,#f0d1ef,#b8a4d9)', A6: 'linear-gradient(135deg,#c4e8c4,#9b82c4)',
  A7: 'linear-gradient(135deg,#d0b9e7,#c8a8d4)', A8: 'linear-gradient(135deg,#f0f0f5,#b8a4d9)',
  A9: 'linear-gradient(135deg,#b8a4d9,#d0b9e7)', A10: 'linear-gradient(135deg,#e8c8d4,#b8a4d9)',
  A11: 'linear-gradient(135deg,#d8b8c0,#9b82c4)', A12: 'linear-gradient(135deg,#f0a0a0,#c45050)',
  B1: 'linear-gradient(135deg,#a8d0e8,#9b82c4)', B2: 'linear-gradient(135deg,#c8e8d4,#9b82c4)',
  B3: 'linear-gradient(135deg,#e8e0a8,#9b82c4)', B4: 'linear-gradient(135deg,#f0d8a0,#9b82c4)',
  B5: 'linear-gradient(135deg,#d0d8c4,#9b82c4)', B6: 'linear-gradient(135deg,#c8d0e8,#9b82c4)',
  B7: 'linear-gradient(135deg,#e8c8d0,#9b82c4)', B8: 'linear-gradient(135deg,#d0b9e7,#c8a8d4)'
}

// 4 jenis animasi idle di-cycle supaya tiap level beda gerakan
const IDLE_ANIMS = ['idle-bounce', 'idle-float', 'idle-pulse', 'idle-wiggle']

export default function MapPage() {
  const { isLevelUnlocked, getLevelProgress, completedCount, totalXP } = useProgress()
  const nav = useNavigate()

  return (
    <div className="app-wrap">
      <Topbar
        title="Jovely"
        showBack={false}
        right={
          <div className="pill" style={{ background: 'var(--lylac-100)' }}>
            <Icon name="star" size={14} /> {totalXP()} XP
          </div>
        }
      />
      <div className="page" style={{ paddingTop: 20, paddingBottom: 120 }}>
        <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>Progress Keseluruhan</div>
            <div className="progress-bar"><div style={{ width: `${(completedCount() / TOTAL_LEVELS) * 100}%` }} /></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--lylac-600)' }}>{completedCount()}/{TOTAL_LEVELS}</div>
            <div className="muted" style={{ fontSize: 11 }}>level</div>
          </div>
        </div>

        {MODULES.map((mod, mi) => {
          const moduleCompletedCount = mod.levels.filter(l => getLevelProgress(l.id)?.status === 'completed').length
          const moduleUnlocked = mi === 0 || MODULES[mi - 1].levels.every(l => getLevelProgress(l.id)?.status === 'completed')
          return (
            <div key={mod.id} className="fade-in">
              <div className="between" style={{ margin: '12px 4px 8px' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lylac-500)', letterSpacing: '.08em' }}>
                    MODUL {mod.id}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{mod.name}</div>
                </div>
                <div className={`pill ${moduleUnlocked ? '' : 'locked'}`}>
                  {moduleCompletedCount}/{mod.levels.length}
                </div>
              </div>
              <p className="muted" style={{ margin: '-4px 4px 12px', fontSize: 13 }}>{mod.subtitle}</p>

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {mod.levels.map((level, i) => {
                  const unlocked = moduleUnlocked && isLevelUnlocked(level.id)
                  const prog = getLevelProgress(level.id)
                  const done = prog?.status === 'completed'
                  const zig = i % 2 === 0 ? 'translateX(-40px)' : i % 3 === 1 ? 'translateX(40px)' : 'translateX(0)'
                  const emoji = LEVEL_EMOJI[level.id] || '💜'
                  const gradient = LEVEL_GRADIENT[level.id] || 'linear-gradient(135deg,var(--lylac-300),var(--lylac-500))'
                  const animClass = unlocked ? IDLE_ANIMS[i % IDLE_ANIMS.length] : ''
                  return (
                    <div key={level.id} style={{ transform: zig, transition: 'transform .3s' }}>
                      <button
                        onClick={() => unlocked && nav(`/level/${level.id}`)}
                        disabled={!unlocked}
                        className={`map-node ${animClass}`}
                        style={{
                          width: 72, height: 72, borderRadius: '50%',
                          background: done
                            ? 'linear-gradient(135deg,var(--lylac-400),var(--lylac-600))'
                            : unlocked
                            ? gradient
                            : 'var(--lylac-50)',
                          border: unlocked ? '2px solid rgba(255,255,255,.7)' : '2px solid var(--line)',
                          color: done ? '#fff' : unlocked ? '#fff' : 'var(--muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: unlocked ? '0 8px 22px rgba(149,122,196,.28)' : 'none',
                          position: 'relative',
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                          opacity: unlocked ? 1 : 0.5,
                          fontSize: 32, lineHeight: 1
                        }}
                      >
                        {done ? <Icon name="check" size={28} /> : <span>{emoji}</span>}
                        {!unlocked && (
                          <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#fff', borderRadius: '50%', padding: 2, display:'flex' }}>
                            <Icon name="lock" size={14} />
                          </span>
                        )}
                      </button>
                      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 11, fontWeight: 600, maxWidth: 100, margin: '4px auto 0' }}>
                        {level.name}
                      </div>
                      <div className="muted" style={{ textAlign: 'center', fontSize: 10 }}>{getLevelXP(level.id)} XP</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
