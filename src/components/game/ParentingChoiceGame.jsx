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
  const [dragData, setDragData] = useState({ side: null, x: 0, y: 0 })

  const start = useRef({ x: 0, y: 0 })
  const active = useRef(null)
  const moved = useRef(false)
  const sfx = useRef(false)

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
      else { setIdx(i => i + 1); setPicked(null); setDragData({ side: null, x: 0, y: 0 }) }
    }, 450)
  }, [picked, answers, item, isLast, onFinal])

  const handleStart = (e, side) => {
    if (picked) return
    const p = e.touches ? e.touches[0] : e
    start.current = { x: p.clientX, y: p.clientY }
    active.current = side
    moved.current = false
    setDragData({ side, x: 0, y: 0 })
    if (!sfx.current) { try { playSwipeSFX() } catch {}; sfx.current = true }
  }

  const handleMove = (e) => {
    if (!active.current || picked) return
    const p = e.touches ? e.touches[0] : e
    const dx = p.clientX - start.current.x
    const dy = p.clientY - start.current.y
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved.current = true
    setDragData({ side: active.current, x: dx, y: dy })
  }

  const handleEnd = () => {
    if (!active.current) return
    const side = active.current
    const { x, y } = dragData
    active.current = null
    sfx.current = false
    if (moved.current && (Math.abs(x) > 50 || Math.abs(y) > 50)) {
      choose(side)
    } else {
      setDragData({ side: null, x: 0, y: 0 })
    }
  }

  const styleFor = (side) => {
    if (dragData.side === side) {
      const rot = Math.max(-12, Math.min(12, dragData.x / 12))
      return {
        transform: `translate(${dragData.x}px, ${dragData.y}px) rotate(${rot}deg) scale(1.05)`,
        transition: 'none',
        zIndex: 10,
        boxShadow: '0 12px 32px rgba(149,122,196,.25), 0 4px 12px rgba(149,122,196,.15)',
      }
    }
    if (picked && picked !== side) return { opacity: .4, transform: 'scale(.95)', transition: 'all .3s' }
    if (picked && picked === side) return {}
    return { transition: 'transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .3s ease' }
  }

  const classFor = (side) => {
    const base = 'tap2-card parenting-card'
    const sideClass = side === 'healthy' ? 'parenting-healthy' : 'parenting-unhealthy'
    const pickClass = picked === side ? 'parenting-picked' : ''
    const dragClass = dragData.side === side ? 'dragging' : ''
    return `${base} ${sideClass} ${pickClass} ${dragClass}`.trim()
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="card item-enter" style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, lineHeight: 1.5, padding: '20px 16px', marginBottom: 16, minHeight: 100 }}>
        "{item.scenario}"
      </div>
      <div className="tap2-wrap tap2-wrap-hex">
        <div
          className={classFor('unhealthy')}
          style={{ ...styleFor('unhealthy'), touchAction: 'none' }}
          onTouchStart={(e) => handleStart(e, 'unhealthy')}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e, 'unhealthy')}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={() => { if (active.current) handleEnd() }}
          onClick={() => { if (!moved.current && !picked) choose('unhealthy') }}
        >
          <span className="parenting-card-icon">🤍</span>
          <span className="parenting-card-text">{item.unhealthy}</span>
        </div>
        <div
          className={classFor('healthy')}
          style={{ ...styleFor('healthy'), touchAction: 'none' }}
          onTouchStart={(e) => handleStart(e, 'healthy')}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e, 'healthy')}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={() => { if (active.current) handleEnd() }}
          onClick={() => { if (!moved.current && !picked) choose('healthy') }}
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
