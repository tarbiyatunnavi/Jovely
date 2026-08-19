import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'

const OPTS = [
  { value: 1, label: 'Sangat Tidak Setuju', emoji: '😤' },
  { value: 2, label: 'Tidak Setuju', emoji: '🙅' },
  { value: 3, label: 'Netral', emoji: '😐' },
  { value: 4, label: 'Setuju', emoji: '🙆' },
  { value: 5, label: 'Sangat Setuju', emoji: '😍' }
]
const SEG = 72
const snapRot = (deg) => {
  let d = deg % 360
  if (d < 0) d += 360
  const idx = Math.round(d / SEG) % 5
  return { rot: idx * SEG, value: idx + 1 }
}

export default function LikertDial({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [rot, setRot] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)
  const dialRef = useRef(null)
  const center = useRef({ x: 0, y: 0 })
  const lastAngle = useRef(0)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const getAngle = (clientX, clientY) => {
    const dx = clientX - center.current.x
    const dy = clientY - center.current.y
    return Math.atan2(dy, dx) * 180 / Math.PI
  }
  const onDown = (e) => {
    if (submitted) return
    const p = e.touches ? e.touches[0] : e
    const rect = dialRef.current.getBoundingClientRect()
    center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    lastAngle.current = getAngle(p.clientX, p.clientY)
    setDragging(true)
  }
  const onMove = (e) => {
    if (!dragging || submitted) return
    const p = e.touches ? e.touches[0] : e
    const a = getAngle(p.clientX, p.clientY)
    let delta = a - lastAngle.current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    setRot(r => r + delta)
    lastAngle.current = a
  }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    const snap = snapRot(rot)
    setRot(snap.rot)
  }

  const curIdx = snapRot(rot).value - 1
  const cur = OPTS[curIdx]

  const submit = () => {
    if (submitted) return
    setSubmitted(true)
    setBurst(b => b + 1)
    const final = { ...answers, [item.id]: snapRot(rot).value }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setRot(0); setSubmitted(false) }
    }, 500)
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
      <div className="lk-dial-wrap">
        <div
          ref={dialRef}
          className={`lk-dial ${dragging ? 'dragging' : ''}`}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          onMouseDown={onDown} onMouseMove={dragging ? onMove : undefined} onMouseUp={onUp} onMouseLeave={dragging ? onUp : undefined}
          style={{ transform: `rotate(${rot}deg)`, transition: dragging ? 'none' : 'transform .35s cubic-bezier(.34,1.56,.64,1)' }}
        >
          <div className="lk-dial-pointer" />
          <div className="lk-dial-center">
            <div className="dc-emoji" style={{ transform: dragging ? 'scale(1.15)' : 'scale(1)', transition: 'transform .2s' }}>{cur.emoji}</div>
            <div className="dc-label">{cur.label}</div>
          </div>
        </div>
        <button className="btn lk-submit-dial" onClick={submit} disabled={submitted}>
          {submitted ? 'Tersimpan ✓' : 'Kirim Jawaban'}
        </button>
      </div>
      <ParticleBurst trigger={burst} emojis={[cur.emoji, '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
