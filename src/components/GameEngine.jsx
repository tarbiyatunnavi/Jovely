// Komponen gameplay untuk sebuah level
// Mendukung mekanik: swipe (kiri=tidak setuju, kanan=setuju), tap-card (2 tombol), quick-tap (benar/salah), likert (5 poin)
import { useState, useRef } from 'react'

export default function GameEngine({ level, mechanic, onComplete, initialAnswers = {} }) {
  // state jawaban: { [itemId]: 'agree'|'disagree' } atau { [itemId]: 1-5 } untuk likert
  const [answers, setAnswers] = useState(initialAnswers)
  const [idx, setIdx] = useState(0)
  const [anim, setAnim] = useState('')

  const total = level.items.length
  const item = level.items[idx]
  const isLast = idx === total - 1

  const answer = (val) => {
    setAnswers(prev => ({ ...prev, [item.id]: val }))
    setAnim('pop')
    setTimeout(() => setAnim(''), 300)
    if (isLast) {
      const final = { ...answers, [item.id]: val }
      setTimeout(() => onComplete(final), 200)
    } else {
      setTimeout(() => setIdx(i => i + 1), 250)
    }
  }

  // progress dalam level
  const progress = ((idx + 1) / total) * 100

  if (mechanic === 'likert') {
    return <LikertLevel level={level} answers={answers} onAnswer={answer} idx={idx} progress={progress} anim={anim} />
  }
  if (mechanic === 'swipe') {
    return <SwipeLevel level={level} answers={answers} onAnswer={answer} idx={idx} progress={progress} />
  }
  return <TapCardLevel level={level} answers={answers} onAnswer={answer} idx={idx} progress={progress} anim={anim} />
}

function Header({ level, idx, progress }) {
  return (
    <>
      <div className="between" style={{ marginBottom: 8 }}>
        <span className="pill">{level.name}</span>
        <span className="muted">{idx + 1} / {level.items.length}</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div style={{ width: `${progress}%` }} />
      </div>
    </>
  )
}

function TapCardLevel({ level, idx, progress, onAnswer, anim }) {
  const item = level.items[idx]
  return (
    <div className="fade-in">
      <Header level={level} idx={idx} progress={progress} />
      <div className={`card ${anim}`} style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18, fontWeight: 600, lineHeight: 1.5, padding: '28px 20px' }}>
        “{item.text}”
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '12px 0' }}>Kamu setuju?</p>
      <div className="row">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onAnswer('disagree')}>
          ✗ Tidak Setuju
        </button>
        <button className="btn" style={{ flex: 1 }} onClick={() => onAnswer('agree')}>
          ✓ Setuju
        </button>
      </div>
    </div>
  )
}

function SwipeLevel({ level, idx, progress, onAnswer }) {
  const item = level.items[idx]
  const [drag, setDrag] = useState(null) // null|'left'|'right'
  const [offset, setOffset] = useState(0)
  const startX = useRef(null)

  const onDown = (e) => { startX.current = e.touches ? e.touches[0].clientX : e.clientX }
  const onMove = (e) => {
    if (startX.current === null) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    setOffset(x - startX.current)
  }
  const onUp = () => {
    if (Math.abs(offset) > 80) {
      onAnswer(offset > 0 ? 'agree' : 'disagree')
    }
    setOffset(0); setDrag(null); startX.current = null
  }

  const rotate = Math.max(-12, Math.min(12, offset / 12))
  const opacity = Math.max(0.4, 1 - Math.abs(offset) / 300)

  return (
    <div className="fade-in" onTouchEnd={onUp} onMouseUp={onUp} onMouseLeave={onUp}>
      <Header level={level} idx={idx} progress={progress} />
      <div style={{ position: 'relative', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="card"
          onTouchStart={onDown} onTouchMove={onMove}
          onMouseDown={onDown} onMouseMove={(e) => startX.current !== null && onMove(e)}
          style={{
            minHeight: 220, textAlign: 'center', fontSize: 18, fontWeight: 600, lineHeight: 1.5,
            padding: '28px 20px', transform: `translateX(${offset}px) rotate(${rotate}deg)`,
            opacity, transition: offset === 0 ? 'transform .3s' : 'none',
            border: offset > 20 ? '2px solid var(--lylac-400)' : offset < -20 ? '2px solid #f0c0c8' : '1.5px solid var(--line)',
            userSelect: 'none', cursor: 'grab'
          }}
        >
          “{item.text}”
          <div className="muted" style={{ fontSize: 12, marginTop: 16 }}>← geser kiri: nggak · kanan: setuju →</div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onAnswer('disagree')}>✗ Nggak</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => onAnswer('agree')}>✓ Setuju</button>
      </div>
    </div>
  )
}

function LikertLevel({ level, idx, progress, onAnswer, anim }) {
  const item = level.items[idx]
  const opts = [
    { value: 1, label: 'Sangat Tidak Setuju', emoji: '😤' },
    { value: 2, label: 'Tidak Setuju', emoji: '🙅' },
    { value: 3, label: 'Netral', emoji: '😐' },
    { value: 4, label: 'Setuju', emoji: '🙆' },
    { value: 5, label: 'Sangat Setuju', emoji: '😍' }
  ]
  return (
    <div className={`fade-in ${anim}`}>
      <Header level={level} idx={idx} progress={progress} />
      <div className="card" style={{ minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 17, fontWeight: 600, lineHeight: 1.5, padding: '24px 18px' }}>
        “{item.text}”
      </div>
      {item.polarity && (
        <div className="muted" style={{ textAlign: 'center', marginTop: 8, fontSize: 12 }}>
          {item.polarity === 'UF' ? '↔ Item unfavorable (reverse-scored)' : '↔ Item favorable'}
        </div>
      )}
      <div className="col" style={{ marginTop: 16, gap: 8 }}>
        {opts.map(o => (
          <button
            key={o.value}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '14px 18px', fontWeight: 500 }}
            onClick={() => onAnswer(o.value)}
          >
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
