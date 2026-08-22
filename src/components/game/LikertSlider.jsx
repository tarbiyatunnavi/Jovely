import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { startMouseSFX, stopMouseSFX, playShineSFX } from '../../hooks/useAmbientMusic'

const OPTS = [
  { value: 1, label: 'Sangat Tidak Setuju', emoji: '😤' },
  { value: 2, label: 'Tidak Setuju', emoji: '🙅' },
  { value: 3, label: 'Netral', emoji: '😐' },
  { value: 4, label: 'Setuju', emoji: '🙆' },
  { value: 5, label: 'Sangat Setuju', emoji: '😍' }
]

export default function LikertSlider({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [val, setVal] = useState(3)
  const [submitted, setSubmitted] = useState(false)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)
  const draggingRef = useRef(false)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const cur = OPTS.find(o => o.value === val)

  const submit = () => {
    if (submitted) return
    setSubmitted(true)
    setBurst(b => b + 1)
    try { stopMouseSFX() } catch {}
    try { playShineSFX() } catch {}
    const final = { ...answers, [item.id]: val }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setVal(3); setSubmitted(false) }
    }, 500)
  }

  const onPointerDown = () => {
    if (submitted) return
    draggingRef.current = true
    try { startMouseSFX() } catch {}
  }

  const onInput = (e) => {
    setVal(Number(e.target.value))
  }

  const onPointerUp = () => {
    if (draggingRef.current) {
      draggingRef.current = false
      try { stopMouseSFX() } catch {}
    }
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="lk-card item-enter">
        <div>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{flavor?.emoji}</div>
          "{item.text}"
        </div>
      </div>
      <div className="lk-slider-wrap">
        <div className="lk-slider-labels">
          <span>😤 Nggak banget</span>
          <span>😐 Netral</span>
          <span>😍 Banget</span>
        </div>
        <input
          className="lk-slider"
          type="range" min="1" max="5" step="1" value={val}
          disabled={submitted}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onChange={onInput}
        />
        <div className="lk-current">{cur.emoji} {cur.label}</div>
        <button className="btn lk-submit" onClick={submit} disabled={submitted}>
          {submitted ? 'Tersimpan ✓' : 'Kirim Jawaban'}
        </button>
      </div>
      <ParticleBurst trigger={burst} emojis={[cur.emoji, '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
