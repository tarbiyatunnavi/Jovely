import { useState, useRef, useCallback } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playSwipeSFX } from '../../hooks/useAmbientMusic'

// Modul B (Arus Bawah Laut): kartu skenario + 2 kartu pilihan
// Drag/swipe — pakai ref untuk drag tracking (sync, tidak lag)
export default function ParentingChoiceGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const [dragStyle, setDragStyle] = useState(null) // { side, x, y }

  const startRef = useRef({ x: 0, y: 0 })
  const activeRef = useRef(null) // 'healthy' | 'unhealthy' | null
  const movedRef = useRef(false)
  const sfxRef = useRef(false)
  const rafRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })

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
      else { setIdx(i => i + 1); setPicked(null); setDragStyle(null) }
    }, 450)
  }, [picked, answers, item, isLast, onFinal])

  const onDown = (e, side) => {
    if (picked) return
    const p = e.touches ? e.touches[0] : e
    startRef.current = { x: p.clientX, y: p.clientY }
    activeRef.current = side
    movedRef.current = false
    posRef.current = { x: 0, y: 0 }
    setDragStyle({ side, x: 0, y: 0 })
    if (!sfxRef.current) { try { playSwipeSFX() } catch {}; sfxRef.current = true }
  }

  const onMove = (e) => {
    if (!activeRef.current || picked) return
    const p = e.touches ? e.touches[0] : e
    const dx = p.clientX - startRef.current.x
    const dy = p.clientY - startRef.current.y
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) movedRef.current = true
    posRef.current = { x: dx, y: dy }
    // throttle via rAF — hanya update state sekali per frame
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setDragStyle({ side: activeRef.current, x: posRef.current.x, y: posRef.current.y })
      })
    }
  }

  const onUp = () => {
    if (!activeRef.current) return
    const side = activeRef.current
    const { x, y } = posRef.current
    activeRef.current = null
    if (sfxRef.current) sfxRef.current = false
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (movedRef.current && (Math.abs(x) > 50 || Math.abs(y) > 50)) {
      setDragStyle(null)
      choose(side)
    } else {
      setDragStyle(null)
    }
  }

  const cardStyle = (side) => {
    if (dragStyle && dragStyle.side === side) {
      const rot = Math.max(-10, Math.min(10, dragStyle.x / 14))
      return {
        transform: `translate(${dragStyle.x}px, ${dragStyle.y}px) rotate(${rot}deg) scale(1.05)`,
        transition: 'none',
        zIndex: 10,
        boxShadow: '0 12px 32px rgba(149,122,196,.25), 0 4px 12px rgba(149,122,196,.15)',
      }
    }
    if (picked && picked !== side) return { opacity: .4, transform: 'scale(.95)', transition: 'all .3s' }
    return {}
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="card item-enter" style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, lineHeight: 1.5, padding: '20px 16px', marginBottom: 16, minHeight: 100 }}>
        "{item.scenario}"
      </div>
      <div className="tap2-wrap tap2-wrap-hex">
        <div
          className={`parenting-card parenting-unhealthy ${picked === 'unhealthy' ? 'parenting-picked' : ''} ${dragStyle?.side === 'unhealthy' ? 'dragging' : ''}`}
          onTouchStart={(e) => onDown(e, 'unhealthy')}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onMouseDown={(e) => onDown(e, 'unhealthy')}
          onMouseMove={dragStyle?.side === 'unhealthy' ? onMove : undefined}
          onMouseUp={onUp}
          onMouseLeave={dragStyle?.side === 'unhealthy' ? onUp : undefined}
          onClick={() => { if (!movedRef.current && !picked) choose('unhealthy') }}
          style={cardStyle('unhealthy')}
        >
          <span className="parenting-card-icon">🤍</span>
          <span className="parenting-card-text">{item.unhealthy}</span>
        </div>
        <div
          className={`parenting-card parenting-healthy ${picked === 'healthy' ? 'parenting-picked' : ''} ${dragStyle?.side === 'healthy' ? 'dragging' : ''}`}
          onTouchStart={(e) => onDown(e, 'healthy')}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onMouseDown={(e) => onDown(e, 'healthy')}
          onMouseMove={dragStyle?.side === 'healthy' ? onMove : undefined}
          onMouseUp={onUp}
          onMouseLeave={dragStyle?.side === 'healthy' ? onUp : undefined}
          onClick={() => { if (!movedRef.current && !picked) choose('healthy') }}
          style={cardStyle('healthy')}
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
