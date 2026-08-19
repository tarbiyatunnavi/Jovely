import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

// Drag kartu ke 2 zona. agree=kanan ("Aku Banget"), disagree=kiri ("Bukan Aku")
export default function DragDropGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hover, setHover] = useState(null)
  const [exit, setExit] = useState(null)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)
  const start = useRef({ x: 0, y: 0 })

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const onDown = (e) => {
    if (exit) return
    const p = e.touches ? e.touches[0] : e
    start.current = { x: p.clientX, y: p.clientY }
    setDragging(true)
  }
  const onMove = (e) => {
    if (!dragging || exit) return
    const p = e.touches ? e.touches[0] : e
    const dx = p.clientX - start.current.x
    const dy = p.clientY - start.current.y
    setPos({ x: dx, y: dy })
    setHover(dx < -50 ? 'left' : dx > 50 ? 'right' : null)
  }
  const finish = (dir) => {
    if (exit) return
    setExit(dir)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: dir === 'right' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPos({ x: 0, y: 0 }); setHover(null); setExit(null) }
    }, 300)
  }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    setHover(null)
    if (pos.x < -50) finish('left')
    else if (pos.x > 50) finish('right')
    else setPos({ x: 0, y: 0 })
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="dd-zones">
        <div className={`dd-zone ${hover === 'left' ? 'hover-left' : ''}`}>
          <span className="z-emoji">🤍</span>
          {flavor?.leftLabel || 'Bukan Aku'}
        </div>
        <div className={`dd-zone ${hover === 'right' ? 'hover-right' : ''}`}>
          <span className="z-emoji">💜</span>
          {flavor?.rightLabel || 'Aku Banget'}
        </div>
      </div>
      <div
        ref={cardRef}
        className={`dd-card ${dragging ? 'dragging' : ''} ${exit === 'left' ? 'exit-left' : exit === 'right' ? 'exit-right' : ''}`}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        onMouseDown={onDown} onMouseMove={dragging ? onMove : undefined} onMouseUp={onUp} onMouseLeave={dragging ? onUp : undefined}
        style={{
          transform: exit ? undefined : `translate(${pos.x}px, ${pos.y}px)`,
          transition: dragging ? 'none' : 'transform .3s cubic-bezier(.2,.7,.3,1)'
        }}
      >
        <div style={{ fontSize: 26, marginBottom: 8 }}>{flavor?.emoji}</div>
        “{item.text}”
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 14, fontSize: 12 }}>Drag kartu ke zona kiri atau kanan 👉</p>
      <ParticleBurst trigger={burst} emojis={['💜', '✨', '🤍', flavor?.emoji]} />
    </div>
  )
}
