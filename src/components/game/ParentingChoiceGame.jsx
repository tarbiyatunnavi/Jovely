import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playSwipeSFX } from '../../hooks/useAmbientMusic'

// Modul B (Arus Bawah Laut): kartu skenario + 2 kartu pilihan (sehat/tidak sehat)
// Pemain tap salah satu kartu pilihan. agree = sehat, disagree = tidak sehat.
export default function ParentingChoiceGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100

  const choose = (which) => {
    if (picked) return
    setPicked(which)
    setBurst(b => b + 1)
    try { playSwipeSFX() } catch {}
    const final = { ...answers, [item.id]: which === 'healthy' ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i => i + 1); setPicked(null) }
    }, 450)
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="card item-enter" style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, lineHeight: 1.5, padding: '20px 16px', marginBottom: 16, minHeight: 100 }}>
        "{item.scenario}"
      </div>
      <div className="tap2-wrap tap2-wrap-hex">
        <div
          className={`tap2-card parenting-card parenting-unhealthy ${picked === 'unhealthy' ? 'parenting-picked' : ''} ${picked === 'healthy' ? 'dimmed' : ''}`}
          onClick={() => choose('unhealthy')}
        >
          <span className="parenting-card-icon">🤍</span>
          <span className="parenting-card-label">Tidak Sehat</span>
          <span className="parenting-card-text">{item.unhealthy}</span>
        </div>
        <div
          className={`tap2-card parenting-card parenting-healthy ${picked === 'healthy' ? 'parenting-picked' : ''} ${picked === 'unhealthy' ? 'dimmed' : ''}`}
          onClick={() => choose('healthy')}
        >
          <span className="parenting-card-icon">💜</span>
          <span className="parenting-card-label">Sehat</span>
          <span className="parenting-card-text">{item.healthy}</span>
        </div>
      </div>
      <ParticleBurst trigger={burst} emojis={['🌊', '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
