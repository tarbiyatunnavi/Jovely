import { useState, useRef } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playShineSFX } from '../../hooks/useAmbientMusic'

// Mini story-telling: tampilkan skenario singkat, lalu pilih respons.
// Makna item tetap sama; kita bungkus dalam narasi pendek.
// Pilihan "Setuju" → agree, "Nggak Setuju" → disagree.
function buildScene(item, level) {
  const scenes = {
    A9: { scene: 'Sama temen', q: 'Temenmu ngeluh soal pasangan yang "nggak sempurna". Kamu mikir gimana?' },
    A11: { scene: 'Bayangin aja', q: 'Orang yang kamu sayang butuh banget bantuanmu, meski kamu harus ngelakuin hal susah. Apa kamu rela?' }
  }
  if (scenes[level.id]) {
    return { ...scenes[level.id], showItem: false }
  }
  return { scene: 'Refleksi sebentar', q: item.text, showItem: false }
}

export default function StoryGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const scene = buildScene(item, level)
  const opts = flavor?.options || ['Setuju', 'Nggak Setuju']

  const choose = (i) => {
    if (picked !== null) return
    setPicked(i)
    setBurst(b => b + 1)
    try { playShineSFX() } catch {}
    const final = { ...answers, [item.id]: i === 0 ? 'agree' : 'disagree' }
    setAnswers(final)
    setTimeout(() => {
      if (isLast) onFinal(final)
      else { setIdx(i2 => i2 + 1); setPicked(null) }
    }, 420)
  }

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div ref={cardRef} className="story-box item-enter">
        <div className="s-body">
          {scene.q}
        </div>
      </div>
      <div className="story-choices">
        <button className={`story-choice ${picked === 0 ? 'picked' : ''}`} onClick={() => choose(0)} disabled={picked !== null}>
          <span className="sc-emoji">{flavor?.emoji || '💜'}</span>
          <span>{opts[0]}</span>
        </button>
        <button className={`story-choice ${picked === 1 ? 'picked' : ''}`} onClick={() => choose(1)} disabled={picked !== null}>
          <span className="sc-emoji">🤍</span>
          <span>{opts[1]}</span>
        </button>
      </div>
      <ParticleBurst trigger={burst} emojis={['💫', '✨', '💜', flavor?.emoji]} />
    </div>
  )
}
