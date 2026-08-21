import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

// Quick-tap Benar/Salah. Tidak ada timer — "Cepat jawab!" cuma vibe teks.
// Tombol berbentuk bubble, pecah saat ditekan.
export default function QuickTapGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const [popData, setPopData] = useState(null) // { x, y, color }
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = (which, e) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)

    // dapat posisi bubble yang ditekan untuk partikel pecah
    const rect = e.currentTarget.getBoundingClientRect()
    setPopData({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      color: which === 'yes' ? '#1e7a3e' : '#b3261e',
      bgColor: which === 'yes' ? '#c8eccc' : '#f9d8de',
    })

    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setPopData(null) }
    }, 450)
  }

  // generate partikel pecah (acak arah & ukuran)
  const particles = popData ? Array.from({ length: 10 }).map((_, i) => {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4
    const dist = 35 + Math.random() * 45
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 5 + Math.random() * 7,
      delay: Math.random() * 0.08,
    }
  }) : []

  return (
    <div className="fade-in">
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="qt-card item-enter">"{item.text}"</div>
      <div className="qt-options">
        <button
          className={`qt-bubble qt-bubble-wrong ${picked === 'no' ? 'popping' : ''} ${picked === 'yes' ? 'dimmed' : ''}`}
          onClick={(e) => choose('no', e)}
          disabled={picked}
        >
          <span className="qt-bubble-icon">✗</span>
          <span>Salah</span>
        </button>
        <button
          className={`qt-bubble qt-bubble-right ${picked === 'yes' ? 'popping' : ''} ${picked === 'no' ? 'dimmed' : ''}`}
          onClick={(e) => choose('yes', e)}
          disabled={picked}
        >
          <span className="qt-bubble-icon">✓</span>
          <span>Benar</span>
        </button>
      </div>
      {/* Partikel pecah bubble — muncul dari posisi bubble yang ditekan */}
      {popData && (
        <div className="bubble-pop-overlay">
          {particles.map((p, i) => (
            <span
              key={i}
              className="bubble-pop-shard"
              style={{
                left: popData.x,
                top: popData.y,
                width: p.size + 'px',
                height: p.size + 'px',
                background: i % 3 === 0 ? popData.color : popData.bgColor,
                '--dx': p.dx + 'px',
                '--dy': p.dy + 'px',
                animationDelay: p.delay + 's',
              }}
            />
          ))}
        </div>
      )}
      <ParticleBurst trigger={burst} emojis={['⚡', '✨', flavor?.emoji]} />
    </div>
  )
}
