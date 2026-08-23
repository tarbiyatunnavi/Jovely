import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playSwipeSFX } from '../../hooks/useAmbientMusic'

// Modul B (Arus Bawah Laut): kartu skenario + 2 kartu pilihan (sehat/tidak sehat)
// Pemain drag/swipe kartu pilihan. agree = sehat, disagree = tidak sehat.
export default function ParentingChoiceGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  // drag state per card: null or { side: 'healthy'|'unhealthy', offset: {x,y}, dragging: bool }
  const [dragSide, setDragSide] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const cardRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const sfxStarted = useRef(false)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = (which) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: which === 'healthy' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setDragSide(null); setDragOffset({ x: 0, y: 0 }) }
    }, 450)
  }

  // === Drag/swipe handlers ===
  const onDown = (e, side) => {
    if (picked) return
    const p = e.touches ? e.touches[0] : e
    dragStart.current = { x: p.clientX, y: p.clientY }
    setDragSide(side)
    setDragging(true)
    if (!sfxStarted.current) {
      try { playSwipeSFX() } catch {}
      sfxStarted.current = true
    }
  }

  const onMove = (e) => {
    if (!dragging || !dragSide || picked) return
    const p = e.touches ? e.touches[0] : e
    const dx = p.clientX - dragStart.current.x
    const dy = p.clientY - dragStart.current.y
    setDragOffset({ x: dx, y: dy })
  }

  const onUp = () => {
    if (!dragging || !dragSide) return
    setDragging(false)
    if (sfxStarted.current) sfxStarted.current = false
    const threshold = 60
    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      choose(dragSide)
    }
    setDragSide(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const getCardStyle = (side) => {
    if (dragSide === side && dragging) {
      const rotate = Math.max(-12, Math.min(12, dragOffset.x / 12))
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotate}deg) scale(1.05)`,
        transition: 'none',
        zIndex: 10,
        opacity: 1,
        boxShadow: '0 12px 32px rgba(149,122,196,.25), 0 4px 12px rgba(149,122,196,.15)',
      }
    }
    if (picked && picked !== side) {
      return { opacity: 0.4, transform: 'scale(.95)', transition: 'all .3s' }
    }
    if (picked && picked === side) {
      return {}
    }
    return { transition: 'transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .3s ease' }
  }

  const getCardClass = (side) => {
    const base = `tap2-card parenting-card ${side === 'healthy' ? 'parenting-healthy' : 'parenting-unhealthy'}`
    const pickedClass = picked === side ? 'parenting-picked' : ''
    const dragClass = dragSide === side && dragging ? 'dragging' : ''
    return `${base} ${pickedClass} ${dragClass}`.trim()
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="card item-enter" style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, lineHeight: 1.5, padding: '20px 16px', marginBottom: 16, minHeight: 100 }}>
        "{item.scenario}"
      </div>
      <div
        className="tap2-wrap tap2-wrap-hex"
        onTouchMove={onMove}
        onMouseMove={dragging ? onMove : undefined}
        onTouchEnd={onUp}
        onMouseUp={onUp}
        onMouseLeave={dragging ? onUp : undefined}
      >
        <div
          className={getCardClass('unhealthy')}
          style={getCardStyle('unhealthy')}
          onTouchStart={(e) => onDown(e, 'unhealthy')}
          onMouseDown={(e) => onDown(e, 'unhealthy')}
          onClick={() => !dragging && !picked && choose('unhealthy')}
        >
          <span className="parenting-card-icon">🤍</span>
          <span className="parenting-card-text">{item.unhealthy}</span>
        </div>
        <div
          className={getCardClass('healthy')}
          style={getCardStyle('healthy')}
          onTouchStart={(e) => onDown(e, 'healthy')}
          onMouseDown={(e) => onDown(e, 'healthy')}
          onClick={() => !dragging && !picked && choose('healthy')}
        >
          <span className="parenting-card-icon">💜</span>
          <span className="parenting-card-text">{item.healthy}</span>
        </div>
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>Drag/swipe kartu pilihanmu 👉</p>
      <ParticleBurst trigger={burst} emojis={['🌊', '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
