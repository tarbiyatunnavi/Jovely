import { useEffect, useState } from 'react'

// Burst partikel emoji kecil saat jawaban (ringan, lama 800ms)
export function ParticleBurst({ trigger, emojis = ['✨', '💜', '🤍', '💫'], origin }) {
  const [bits, setBits] = useState([])
  useEffect(() => {
    if (!trigger) return
    const n = 8
    const arr = Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 + Math.random() * .5
      const dist = 60 + Math.random() * 70
      return {
        id: `${trigger}-${i}`,
        emoji: emojis[i % emojis.length],
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 20,
        rot: (Math.random() - .5) * 360
      }
    })
    setBits(arr)
    const t = setTimeout(() => setBits([]), 850)
    return () => clearTimeout(t)
  }, [trigger, emojis.join(',')])

  if (!bits.length) return null
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? window.innerHeight / 2
  return (
    <div className="particle-layer">
      {bits.map(b => (
        <span key={b.id} className="particle" style={{
          left: x, top: y,
          '--dx': `${b.dx}px`, '--dy': `${b.dy}px`, '--rot': `${b.rot}deg`
        }}>{b.emoji}</span>
      ))}
    </div>
  )
}

// Celebration: confetti overlay (fixed, pointer-events:none) — teks dirender inline
// oleh pemanggil supaya tidak tumpang tindih dgn konten page.
const CONFETTI_COLORS = ['#b8a4d9', '#d0b9e7', '#9b82c4', '#e0d1ef', '#7f5fa8', '#ffffff']
export function Celebration({ show, moduleDone = false }) {
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    if (!show) { setPieces([]); return }
    const n = moduleDone ? 36 : 18
    const arr = Array.from({ length: n }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * .3,
      dur: 1.4 + Math.random() * .8,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      cx: (Math.random() - .5) * 240
    }))
    setPieces(arr)
  }, [show, moduleDone])

  if (!show) return null
  return (
    <div className="confetti-layer">
      {pieces.map(p => (
        <span key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: '-20px',
          background: p.color,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          '--cx': `${p.cx}px`
        }} />
      ))}
    </div>
  )
}
