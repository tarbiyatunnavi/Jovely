import { useState, useRef, useCallback } from 'react'
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
  const [dragState, setDragState] = useState({ side: null, offset: { x: 0, y: 0 } })

  const dragSide = useRef(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const sfxStarted = useRef(false)
  const movedRef = useRef(false)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = useCallback((which) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: which === 'healthy' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setDragState({ side: null, offset: { x: 0, y: 0 } }) }
    }, 450)
  }, [picked, answers, item, isLast, onFinal])

  const onDown = (e, side) => {
    if (picked) return
    if (e.cancelable) e.preventDefault()
    const p = e.touches ? e.touches[0] : e
    dragStart.current = { x: p.clientX, y: p.clientY }
    dragSide.current = side
    dragging.current = true
    movedRef.current = false
    dragOffsetRef.current = { x: 0, y: 0 }
    setDragState({ side, offset: { x: 0, y: 0 } })
    if (!sfxStarted.current) {
      try { playSwipeSFX() } catch {}
      sfxStarted.current = true
    }
  }

  const onMove = (e) => {
    if (!dragging.current || picked) return
    if (e.cancelable) e.preventDefault()
    const p = e.touches ? e.touches[0] : e
    const dx = p.clientX - dragStart.current.x
    const dy = p.clientY - dragStart.current.y
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) movedRef.current = true
    dragOffsetRef.current = { x: dx, y: dy }
    setDragState(prev => ({ side: prev.side, offset: { x: dx, y: dy } }))
  }

  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    if (sfxStarted.current) sfxStarted.current = false
    const side = dragSide.current
    const offset = dragOffsetRef.current
    dragSide.current = null
    setDragState({ side: null, offset: { x: 0, y: 0 } })
    if (side && (Math.abs(offset.x) > 50 || Math.abs(offset.y) > 50)) {
      choose(side)
    }
  }

  const getCardStyle = (side) => {
    if (dragState.side === side) {
      const rotate = Math.max(-12, Math.min(12, dragState.offset.x / 12))
      return {
        transform: `translate(${dragState.offset.x}px, ${dragState.offset.y}px) rotate(${rotate}deg) scale(1.05)`,
        transition: 'none',
        zIndex: 10,
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
    const dragClass = dragState.side === side ? 'dragging' : ''
    return `${base} ${pickedClass} ${dragClass}`.trim()
  }

  // Shared handlers attached to EACH card (not wrapper) — same as SwipeGame
  const cardHandlers = (side) => ({
    onTouchStart: (e) => onDown(e, side),
    onTouchMove: (e) => onMove(e),
    onTouchEnd: () => onUp(),
    onMouseDown: (e) => onDown(e, side),
    onMouseMove: (e) => onMove(e),
    onMouseUp: () => onUp(),
    onMouseLeave: () => { if (dragging.current) onUp() },
    onClick: () => { if (!movedRef.current && !picked) choose(side) },
  })

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="card item-enter" style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, lineHeight: 1.5, padding: '20px 16px', marginBottom: 16, minHeight: 100 }}>
        "{item.scenario}"
      </div>
      <div className="tap2-wrap tap2-wrap-hex" style={{ touchAction: 'none' }}>
        <div className={getCardClass('unhealthy')} style={getCardStyle('unhealthy')} {...cardHandlers('unhealthy')}>
          <span className="parenting-card-icon">🤍</span>
          <span className="parenting-card-text">{item.unhealthy}</span>
        </div>
        <div className={getCardClass('healthy')} style={getCardStyle('healthy')} {...cardHandlers('healthy')}>
          <span className="parenting-card-icon">💜</span>
          <span className="parenting-card-text">{item.healthy}</span>
        </div>
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>Drag/swipe kartu pilihanmu 👉</p>
      <ParticleBurst trigger={burst} emojis={['🌊', '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
