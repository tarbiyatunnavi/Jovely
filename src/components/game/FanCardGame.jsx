import { useState, useCallback } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playShineSFX } from '../../hooks/useAmbientMusic'

// "Kartu Kipas" — 4 kartu pilihan tersusun seperti kipas/rim tumpang tindih.
// Tap untuk pilih → kartu terpilih membesar+glow, kartu lain fade/bergeser menjauh.
// Auto-lanjut ke "Level Selesai" tanpa tombol manual.
export default function FanCardGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const [origin, setOrigin] = useState(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const choices = item.choices || []

  const choose = useCallback((choice, e) => {
    if (picked) return
    const rect = e?.currentTarget?.getBoundingClientRect()
    setOrigin({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    })
    setPicked(choice.id)
    setBurst(b => b + 1)
    try { playShineSFX() } catch {}
    const final = { ...answers, [item.id]: choice.id }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null); setOrigin(null) }
    }, 550)
  }, [picked, answers, item, isLast, onFinal])

  // Susunan kipas: 4 kartu condong, tumpang tindih, index tengah paling depan
  const fanLayout = choices.map((c, i) => {
    const n = choices.length
    const spread = 22 // derajat max rotasi
    const rot = n > 1 ? (i - (n - 1) / 2) * (spread / ((n - 1) / 2)) : 0
    const offset = Math.abs(i - (n - 1) / 2) * 10 // semakin pinggir, semakin turun
    return { rot: Math.round(rot), offset, z: n - Math.abs(i - (n - 1) / 2) }
  })

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="card item-enter fan-scenario">
        {item.scenario}
      </div>
      <div className={`fan-stage ${picked ? 'fan-picked' : ''}`}>
        {choices.map((c, i) => {
          const lay = fanLayout[i]
          const isPicked = picked === c.id
          const isDimmed = picked && picked !== c.id
          return (
            <button
              key={c.id}
              onClick={(e) => choose(c, e)}
              disabled={!!picked}
              className={`fan-card ${isPicked ? 'fan-card-picked' : ''} ${isDimmed ? 'fan-card-dim' : ''}`}
              style={{
                '--fan-rot': `${lay.rot}deg`,
                '--fan-offset': `${lay.offset}px`,
                '--fan-z': lay.z,
                ...(picked ? {} : {
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: `${2.4 + (i % 2) * 0.4}s`
                })
              }}
              aria-label={`Pilihan ${c.id}`}
            >
              <span className="fan-card-letter">{c.id}</span>
              <span className="fan-card-text">{c.text}</span>
            </button>
          )
        })}
      </div>
      <p className="muted" style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
        Tap kartu yang paling sesuai denganmu 👆
      </p>
      <ParticleBurst trigger={burst} origin={origin} emojis={['👑', '✨', '💜', '🤍']} />
    </div>
  )
}
