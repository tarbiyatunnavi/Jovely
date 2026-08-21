import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

// Pilih 1 dari 2 kartu besar. agree=kartu "Setuju", disagree=kartu "Nggak"
// Level A9 (Kilat Tanpa Akar): kartu berbentuk hexagon, pecah jadi kilat saat ditekan
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

    // posisi hexagon yang ditekan untuk partikel kilat
    if (isHexagon && e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPopData({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }

    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setPopData(null) }
    }, 450)
  }

  // generate retakan kilat (zigzag SVG path menjalar ke luar)
  const bolts = popData ? Array.from({ length: 7 }).map((_, i) => {
    const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.35
    const dist = 45 + Math.random() * 35
    const endX = Math.cos(angle) * dist
    const endY = Math.sin(angle) * dist
    // zigzag midpoints
    const mid1x = Math.cos(angle) * dist * 0.3 + (Math.random() - 0.5) * 20
    const mid1y = Math.sin(angle) * dist * 0.3 + (Math.random() - 0.5) * 20
    const mid2x = Math.cos(angle) * dist * 0.65 + (Math.random() - 0.5) * 18
    const mid2y = Math.sin(angle) * dist * 0.65 + (Math.random() - 0.5) * 18
    return { endX, endY, mid1x, mid1y, mid2x, mid2y, delay: Math.random() * 0.06, angle }
  }) : []

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="card item-enter" style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, lineHeight: 1.5, padding: '24px 18px', marginBottom: 16, minHeight: 120 }}>
        "{item.text}"
      </div>
      <div className={`tap2-wrap ${isHexagon ? 'tap2-wrap-hex' : ''}`}>
        <div
          className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'yes' ? (isHexagon ? 'hex-popping' : 'picked-yes') : ''} ${picked === 'no' ? 'dimmed' : ''}`}
          onClick={(e) => choose('yes', e)}
        >
          <span className="t2-emoji">💜</span>
          <span className="t2-label">Setuju</span>
          {isHexagon ? null : <span className="t2-text">Pernyataan ini ngebantu aku</span>}
        </div>
        <div
          className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'no' ? (isHexagon ? 'hex-popping' : 'picked-no') : ''} ${picked === 'yes' ? 'dimmed' : ''}`}
          onClick={(e) => choose('no', e)}
        >
          <span className="t2-emoji">🤍</span>
          <span className="t2-label">Nggak</span>
          {isHexagon ? null : <span className="t2-text">Bukan gaya aku</span>}
        </div>
      </div>

      {/* Retakan kilat dari hexagon yang ditekan */}
      {popData && isHexagon && (
        <div className="hex-pop-overlay">
          <svg className="hex-crack-svg" style={{ left: popData.x, top: popData.y }}>
            {bolts.map((b, i) => (
              <path
                key={i}
                className="hex-crack-path"
                d={`M0,0 L${b.mid1x},${b.mid1y} L${b.mid2x},${b.mid2y} L${b.endX},${b.endY}`}
                style={{ animationDelay: b.delay + 's' }}
              />
            ))}
          </svg>
          <div className="hex-flash" style={{ left: popData.x, top: popData.y }} />
        </div>
      )}

      <ParticleBurst trigger={burst} emojis={['⚡', '✨', flavor?.emoji]} />
    </div>
  )
}
