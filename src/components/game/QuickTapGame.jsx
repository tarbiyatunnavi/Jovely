import { useState, useRef, useEffect } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

// Quick-tap true/false dengan timer ringan. agree=Benar, disagree=Salah
const TIMER_MS = 6000
export default function QuickTapGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [time, setTime] = useState(TIMER_MS)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)
  const raf = useRef(null)
  const startT = useRef(0)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  useEffect(() => {
    startT.current = Date.now()
    setTime(TIMER_MS)
    const tick = () => {
      const elapsed = Date.now() - startT.current
      const left = Math.max(0, TIMER_MS - elapsed)
      setTime(left)
      if (left <= 0) { choose('no'); return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [idx])

  const choose = (which) => {
    if (picked) return
    cancelAnimationFrame(raf.current)
    setPicked(which)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: which === 'yes' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null) }
    }, 380)
  }

  const pct = (time / TIMER_MS) * 100
  const warn = time < TIMER_MS * 0.33

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="qt-timer"><div className={warn ? 'warn' : ''} style={{ width: `${pct}%` }} /></div>
      <div ref={cardRef} className="qt-card item-enter">“{item.text}”</div>
      <div className="qt-options">
        <button className={`qt-btn wrong ${picked === 'no' ? 'picked' : ''}`} onClick={() => choose('no')} disabled={picked}>
          ✗ Salah
        </button>
        <button className={`qt-btn right ${picked === 'yes' ? 'picked' : ''}`} onClick={() => choose('yes')} disabled={picked}>
          ✓ Benar
        </button>
      </div>
      <ParticleBurst trigger={burst} emojis={['⚡', '🔥', '✨', flavor?.emoji]} />
    </div>
  )
}
