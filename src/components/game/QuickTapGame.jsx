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
  const [bubblePop, setBubblePop] = useState(null) // 'yes' | 'no' | null
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = (which) => {
    if (picked) return
    setPicked(which)
    setBubblePop(which)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    // setelah animasi pecah (~450ms), lanjut
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setBubblePop(null) }
    }, 450)
  }

  return (
    <div className="fade-in">
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="qt-card item-enter">"{item.text}"</div>
      <div className="qt-options">
        <button
          className={`qt-bubble qt-bubble-wrong ${picked === 'no' ? 'popping' : ''} ${picked === 'yes' ? 'dimmed' : ''}`}
          onClick={() => choose('no')}
          disabled={picked}
        >
          <span className="qt-bubble-icon">✗</span>
          <span>Salah</span>
        </button>
        <button
          className={`qt-bubble qt-bubble-right ${picked === 'yes' ? 'popping' : ''} ${picked === 'no' ? 'dimmed' : ''}`}
          onClick={() => choose('yes')}
          disabled={picked}
        >
          <span className="qt-bubble-icon">✓</span>
          <span>Benar</span>
        </button>
      </div>
      {/* Partikel pecah bubble */}
      {bubblePop && (
        <div className="bubble-pop-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="bubble-pop-particle"
              style={{
                '--dx': `${Math.cos((i / 8) * Math.PI * 2) * (40 + Math.random() * 30)}px`,
                '--dy': `${Math.sin((i / 8) * Math.PI * 2) * (40 + Math.random() * 30)}px`,
                animationDelay: `${Math.random() * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
      <ParticleBurst trigger={burst} emojis={['⚡', '✨', flavor?.emoji]} />
    </div>
  )
}
