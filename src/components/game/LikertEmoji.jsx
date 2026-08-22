import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playShineSFX } from '../../hooks/useAmbientMusic'

const OPTS = [
  { value: 1, label: 'Sangat Tidak Setuju', emoji: '😤' },
  { value: 2, label: 'Tidak Setuju', emoji: '🙅' },
  { value: 3, label: 'Netral', emoji: '😐' },
  { value: 4, label: 'Setuju', emoji: '🙆' },
  { value: 5, label: 'Sangat Setuju', emoji: '😍' }
]

export default function LikertEmoji({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = (v) => {
    if (picked) return
    setPicked(v)
    setBurst(b => b + 1)
    try { playShineSFX() } catch {}
    const final = { ...answers, [item.id]: v }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null) }
    }, 420)
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="lk-card item-enter">
        <div>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{flavor?.emoji}</div>
          “{item.text}”
        </div>
      </div>
      <p className="muted" style={{ textAlign: 'center', marginBottom: 10, fontSize: 13 }}>Tap emoji yang paling ngewakiliin perasaan kamu</p>
      <div className="lk-emoji-grid">
        {OPTS.map(o => (
          <button
            key={o.value}
            className={`lk-emoji-btn ${picked === o.value ? 'picked' : ''} ${picked !== null && picked !== o.value ? 'dimmed' : ''}`}
            onClick={() => choose(o.value)}
            disabled={picked !== null}
          >
            <span className="e-icon">{o.emoji}</span>
            <span className="e-label">{o.label}</span>
          </button>
        ))}
      </div>
      <ParticleBurst trigger={burst} emojis={[OPTS[picked - 1]?.emoji || '✨', '💜', '✨', flavor?.emoji]} />
    </div>
  )
}
