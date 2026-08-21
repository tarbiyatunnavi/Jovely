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

  // generate partikel kilat (zigzag menjalar ke luar)
  const bolts = popData ? Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3
    const dist = 30 + Math.random() * 40
    // zigzag offset untuk efek kilat
    const midDx = Math.cos(angle) * dist * 0.5 + (Math.random() - 0.5) * 15
    const midDy = Math.sin(angle) * dist * 0.5 + (Math.random() - 0.5) * 15
    const endDx = Math.cos(angle) * dist
    const endDy = Math.sin(angle) * dist
    return { midDx, midDy, endDx, endDy, delay: Math.random() * 0.08 }
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

      {/* Partikel kilat pecah hexagon */}
      {popData && isHexagon && (
        <div className="hex-pop-overlay">
          {bolts.map((b, i) => (
            <div
              key={i}
              className="hex-bolt"
              style={{
                left: popData.x,
                top: popData.y,
                '--mid-x': b.midDx + 'px',
                '--mid-y': b.midDy + 'px',
                '--end-x': b.endDx + 'px',
                '--end-y': b.endDy + 'px',
                animationDelay: b.delay + 's',
              }}
            />
          ))}
          {/* flash kilat pusat */}
          <div className="hex-flash" style={{ left: popData.x, top: popData.y }} />
        </div>
      )}

      <ParticleBurst trigger={burst} emojis={['⚡', '✨', flavor?.emoji]} />
    </div>
  )
}
