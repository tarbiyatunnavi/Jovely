import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playBreakingSFX } from '../../hooks/useAmbientMusic'

// Pilih 1 dari 2 kartu besar. agree=kartu "Setuju", disagree=kartu "Nggak"
// Level A9 (Kilat Tanpa Akar): kartu hexagon glass, retak & pecah saat ditekan
export default function Tap2Game({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const [popData, setPopData] = useState(null)
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const isHexagon = level.id === 'A9'

  const choose = (which, e) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)
    try { playBreakingSFX() } catch {}

    if (isHexagon && e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPopData({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }

    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setPopData(null) }
    }, 500)
  }

  // retakan kaca bercabang dari pusat
  const cracks = popData ? Array.from({ length: 6 }).map((_, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3
    const dist = 40 + Math.random() * 20
    const midx = Math.cos(angle) * dist * 0.4 + (Math.random() - 0.5) * 12
    const midy = Math.sin(angle) * dist * 0.4 + (Math.random() - 0.5) * 12
    const endx = Math.cos(angle) * dist
    const endy = Math.sin(angle) * dist
    // cabang
    const branchAngle = angle + (Math.random() - 0.5) * 1.2
    const branchLen = dist * 0.4
    const bx = midx + Math.cos(branchAngle) * branchLen
    const by = midy + Math.sin(branchAngle) * branchLen
    return { midx, midy, endx, endy, bx, by, delay: Math.random() * 0.05 }
  }) : []

  // pecahan kaca (shards) jatuh + rotate
  const shards = popData ? Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4
    const dist = 25 + Math.random() * 30
    const fallY = 30 + Math.random() * 40
    const rot = (Math.random() - 0.5) * 360
    const size = 4 + Math.random() * 6
    return {
      dx: Math.cos(angle) * dist,
      dy: -Math.sin(angle) * dist * 0.5,
      fallY,
      rot,
      size,
      delay: 0.1 + Math.random() * 0.1,
    }
  }) : []

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="card item-enter" style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, lineHeight: 1.5, padding: '24px 18px', marginBottom: 16, minHeight: 120 }}>
        "{item.text}"
      </div>
      <div className={`tap2-wrap ${isHexagon ? 'tap2-wrap-hex' : ''}`}>
        <div
          className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'yes' ? (isHexagon ? 'hex-cracking' : 'picked-yes') : ''} ${picked === 'no' ? 'dimmed' : ''}`}
          onClick={(e) => choose('yes', e)}
        >
          <span className="t2-emoji">💜</span>
          <span className="t2-label">Setuju</span>
          {isHexagon ? null : <span className="t2-text">Pernyataan ini ngebantu aku</span>}
        </div>
        <div
          className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'no' ? (isHexagon ? 'hex-cracking' : 'picked-no') : ''} ${picked === 'yes' ? 'dimmed' : ''}`}
          onClick={(e) => choose('no', e)}
        >
          <span className="t2-emoji">🤍</span>
          <span className="t2-label">Nggak</span>
          {isHexagon ? null : <span className="t2-text">Bukan gaya aku</span>}
        </div>
      </div>

      {/* Retakan kaca + pecahan dari hexagon yang ditekan */}
      {popData && isHexagon && (
        <div className="hex-pop-overlay">
          {/* Retakan kaca bercabang */}
          <svg className="hex-crack-svg" style={{ left: popData.x, top: popData.y }}>
            {cracks.map((c, i) => (
              <g key={i} className="hex-crack-group" style={{ animationDelay: c.delay + 's' }}>
                <path className="hex-crack-path" d={`M0,0 L${c.midx},${c.midy} L${c.endx},${c.endy}`} />
                <path className="hex-crack-path hex-crack-branch" d={`M${c.midx},${c.midy} L${c.bx},${c.by}`} />
              </g>
            ))}
          </svg>
          {/* Flash kilat */}
          <div className="hex-flash" style={{ left: popData.x, top: popData.y }} />
          {/* Pecahan kaca */}
          {shards.map((s, i) => (
            <div
              key={i}
              className="hex-shard"
              style={{
                left: popData.x,
                top: popData.y,
                width: s.size + 'px',
                height: s.size + 'px',
                '--dx': s.dx + 'px',
                '--dy': s.dy + 'px',
                '--fall': s.fallY + 'px',
                '--rot': s.rot + 'deg',
                animationDelay: s.delay + 's',
              }}
            />
          ))}
        </div>
      )}

      <ParticleBurst trigger={burst} emojis={['⚡', '✨', flavor?.emoji]} />
    </div>
  )
}
