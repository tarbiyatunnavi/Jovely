import { GAME_MECHANICS } from '../../data/levels'

// Header bersama: emoji level, tagline, greeting, hint, progress
export function LevelHeader({ level, idx, total, progress, flavor }) {
  const f = flavor || GAME_MECHANICS[level.id] || {}
  return (
    <>
      <div className="level-hero" style={{ background: `linear-gradient(135deg, ${f.accent || 'var(--lylac-400)'}18, #fff)` }}>
        <div className="emoji">{f.emoji || '💜'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tagline">{f.tagline || level.name}</div>
          <div className="greeting">{f.greeting || 'Yuk mulai'}</div>
          {f.hint && <div className="hint">{f.hint}</div>}
        </div>
      </div>
      <div className="lvl-progress">
        <div className="lp-bar progress-bar"><div style={{ width: `${progress}%` }} /></div>
        <span className="lp-count">{idx + 1}/{total}</span>
      </div>
    </>
  )
}
