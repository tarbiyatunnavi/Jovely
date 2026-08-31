import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playSwipeSFX } from '../../hooks/useAmbientMusic'

// Swipe kartu kiri/kanan. agree=kanan, disagree=kiri
export default function SwipeGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exit, setExit] = useState(null)
  const [burst, setBurst] = useState(0)
  const [origin, setOrigin] = useState(null)
  const start = useRef({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const onDown = (e) => {
    if (exit) return
    const p = e.touches ? e.touches[0] : e
    start.current = { x: p.clientX, y: p.clientY }
    setDragging(true)
    try { playSwipeSFX() } catch {}
  }
  const onMove = (e) => {
    if (!dragging || exit) return
    const p = e.touches ? e.touches[0] : e
    setOffset(p.clientX - start.current.x)
  }
  const finish = (dir) => {
    if (exit) return
    const agree = dir === 'right'
    setExit(agree ? 'right' : 'left')
    const rect = cardRef.current?.getBoundingClientRect()
    setOrigin({ x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2, y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2 })
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: agree ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setOffset(0); setExit(null) }
    }, 300)
  }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(offset) > 80) finish(offset > 0 ? 'right' : 'left')
    else setOffset(0)
  }

  const rotate = Math.max(-14, Math.min(14, offset / 14))
  const yesBadge = offset > 40
  const noBadge = offset < -40
  const leftLabel = flavor?.leftLabel || 'Nggak Setuju'
  const rightLabel = flavor?.rightLabel || 'Setuju'

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="swipe-stage">
        <div
          ref={cardRef}
          className={`swipe-card ${dragging ? 'dragging' : ''} ${exit === 'left' ? 'exit-left' : exit === 'right' ? 'exit-right' : ''}`}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          onMouseDown={onDown} onMouseMove={dragging ? onMove : undefined} onMouseUp={onUp} onMouseLeave={dragging ? onUp : undefined}
          style={{
            transform: exit ? undefined : `translateX(${offset}px) rotate(${rotate}deg)`,
            transition: dragging ? 'none' : 'transform .3s cubic-bezier(.2,.7,.3,1)',
            borderColor: yesBadge ? 'var(--lylac-400)' : noBadge ? '#f0c0c8' : 'transparent'
          }}
        >
          <span className={`swipe-badges yes ${yesBadge ? 'show' : ''}`}>{rightLabel} ✓</span>
          <span className={`swipe-badges no ${noBadge ? 'show' : ''}`}>{leftLabel} ✗</span>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{flavor?.emoji}</div>
          “{item.text}”
          <div className="muted" style={{ fontSize: 12, marginTop: 18 }}>← {flavor?.hint || `geser kiri: ${leftLabel.toLowerCase()} · kanan: ${rightLabel.toLowerCase()}`} →</div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 16, gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => finish('left')}>✗ {leftLabel}</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => finish('right')}>✓ {rightLabel}</button>
      </div>
      <ParticleBurst trigger={burst} origin={origin} emojis={['💜', '✨', '🤍', flavor?.emoji]} />
    </div>
  )
}
