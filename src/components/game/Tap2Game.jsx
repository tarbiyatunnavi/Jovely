import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

// Pilih 1 dari 2 kartu besar. agree=kartu "Setuju", disagree=kartu "Nggak"
// Level A9 (Kilat Tanpa Akar): kartu berbentuk hexagon
export default function Tap2Game({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const isHexagon = level.id === 'A9'

  const choose = (which) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null) }
    }, 420)
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="card item-enter" style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, lineHeight: 1.5, padding: '24px 18px', marginBottom: 16, minHeight: 120 }}>
        "{item.text}"
      </div>
      <div className="tap2-wrap">
        <div className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'yes' ? 'picked-yes' : ''} ${picked === 'no' ? 'dimmed' : ''}`} onClick={() => choose('yes')}>
          <span className="t2-emoji">💜</span>
          <span className="t2-label">Setuju</span>
          <span className="t2-text">Pernyataan ini ngebantu aku</span>
        </div>
        <div className={`tap2-card ${isHexagon ? 'hexagon' : ''} ${picked === 'no' ? 'picked-no' : ''} ${picked === 'yes' ? 'dimmed' : ''}`} onClick={() => choose('no')}>
          <span className="t2-emoji">🤍</span>
          <span className="t2-label">Nggak</span>
          <span className="t2-text">Bukan gaya aku</span>
        </div>
      </div>
      <ParticleBurst trigger={burst} emojis={['💜', '✨', '🤍', flavor?.emoji]} />
    </div>
  )
}
