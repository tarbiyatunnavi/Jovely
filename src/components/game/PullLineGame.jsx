import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { LevelHeader } from './LevelHeader'
import { ParticleBurst } from '../Particles'
import { playSwipeSFX, playShineSFX } from '../../hooks/useAmbientMusic'

// "Tarik Garis" — drag dari ikon tengah ke 1 dari 4 titik di penjuru.
// Garis SVG real-time mengikuti jari. Sampai titik → menyala + glow gradient.
// Lepas di tengah jalan → retract (fade) & bisa coba lagi.
// Multi-ronde: tiap ronde punya skenario sendiri; posisi A/B/C/D diacak per ronde.
const HIT_RADIUS = 64 // toleransi jari ke titik tujuan (px)
// 4 posisi penjuru: 1=kiri-atas, 2=kanan-atas, 3=kiri-bawah, 4=kanan-bawah
const POSITIONS = ['tl', 'tr', 'bl', 'br']

export default function PullLineGame({ level, flavor, total, initialAnswers, onFinal }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...initialAnswers })
  const [picked, setPicked] = useState(null)      // id pilihan terpilih (A/B/C/D)
  const [burst, setBurst] = useState(0)
  const [origin, setOrigin] = useState(null)
  const [dragPos, setDragPos] = useState(null)    // {x,y} posisi jari relatif arena (saat drag)
  const [dragging, setDragging] = useState(false)
  const [retracting, setRetracting] = useState(false) // garis sedang membatalkan
  const [showHint, setShowHint] = useState(true) // tutorial hint jari
  const [hitId, setHitId] = useState(null)       // titik yang sedang ter-"hover" saat drag

  const arenaRef = useRef(null)
  const centerRef = useRef(null)
  const nodeRefs = useRef({})                       // {A: el, B: el, ...}
  const startPos = useRef({ x: 0, y: 0 })

  const item = level.items[idx]
  const isLast = idx === total - 1
  const progress = (idx / total) * 100
  const choices = item.choices || []

  // Acak pemetaan choiceId → posisi penjuru, stabil per ronde (useMemo di idx).
  // Tidak ada 2 ronde berurutan dengan susunan identik dijamin oleh Fisher-Yates.
  const posMap = useMemo(() => {
    const ids = choices.map(c => c.id)
    // Fisher-Yates shuffle
    const shuffled = [...ids]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const map = {}
    shuffled.forEach((id, i) => { map[id] = POSITIONS[i] })
    return map
  }, [idx, choices.length])

  // Sembunyikan tutorial hint setelah beberapa detik atau saat mulai drag
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4200)
    return () => clearTimeout(t)
  }, [idx])
  useEffect(() => { if (dragging) setShowHint(false) }, [dragging])

  // Posisi tengah arena (relatif terhadap arena)
  const getCenterPos = useCallback(() => {
    const arena = arenaRef.current
    const center = centerRef.current
    if (!arena || !center) return { x: 0, y: 0 }
    const ar = arena.getBoundingClientRect()
    const cr = center.getBoundingClientRect()
    return { x: cr.left - ar.left + cr.width / 2, y: cr.top - ar.top + cr.height / 2 }
  }, [])

  // Posisi sebuah node pilihan (relatif arena)
  const getNodePos = useCallback((id) => {
    const arena = arenaRef.current
    const el = nodeRefs.current[id]
    if (!arena || !el) return null
    const ar = arena.getBoundingClientRect()
    const nr = el.getBoundingClientRect()
    return { x: nr.left - ar.left + nr.width / 2, y: nr.top - ar.top + nr.height / 2 }
  }, [])

  // Pointer posisi relatif arena
  const getPointerInArena = useCallback((e) => {
    const arena = arenaRef.current
    if (!arena) return null
    const ar = arena.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - ar.left, y: p.clientY - ar.top }
  }, [])

  const onDown = useCallback((e) => {
    if (picked) return
    e.preventDefault()
    const p = getPointerInArena(e)
    if (!p) return
    startPos.current = p
    setDragging(true)
    setRetracting(false)
    setDragPos(p)
    try { playSwipeSFX() } catch {}
  }, [picked, getPointerInArena])

  const onMove = useCallback((e) => {
    if (!dragging || picked) return
    e.preventDefault()
    const p = getPointerInArena(e)
    if (!p) return
    setDragPos(p)
    // cek hit titik tujuan
    let hit = null
    for (const c of choices) {
      const np = getNodePos(c.id)
      if (!np) continue
      const d = Math.hypot(p.x - np.x, p.y - np.y)
      if (d <= HIT_RADIUS) { hit = c.id; break }
    }
    setHitId(hit)
  }, [dragging, picked, choices, getNodePos])

  const onUp = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    if (hitId && !picked) {
      // berhasil sampai titik → pilih
      const choice = choices.find(c => c.id === hitId)
      if (choice) {
        const np = getNodePos(choice.id)
        const cp = getCenterPos()
        setOrigin({ x: np ? np.x : cp.x, y: np ? np.y : cp.y })
        setPicked(choice.id)
        setDragPos(np)
        setBurst(b => b + 1)
        try { playShineSFX() } catch {}
        const final = { ...answers, [item.id]: choice.id }
        setAnswers(final)
        setTimeout(() => {
          if (isLast) onFinal(final)
          else { setIdx(i => i + 1); setPicked(null); setDragPos(null); setOrigin(null); setHitId(null) }
        }, 560)
        return
      }
    }
    // lepas di tengah jalan → retract
    setRetracting(true)
    setDragPos(null)
    setHitId(null)
    setTimeout(() => setRetracting(false), 380)
  }, [dragging, hitId, picked, choices, getNodePos, getCenterPos, answers, item, isLast, onFinal])

  // Garis: dari tengah ke posisi jari (saat drag) atau ke titik terpilih (saat picked)
  const lineEnd = (() => {
    if (picked) {
      const np = getNodePos(picked)
      return np || getCenterPos()
    }
    return dragPos || getCenterPos()
  })()
  const center = getCenterPos()
  const showLine = dragging || picked || retracting

  return (
    <div className="fade-in" key={idx}>
      <LevelHeader level={level} idx={idx} total={total} progress={progress} flavor={flavor} />
      <div className="pl-round-pill" style={{ marginBottom: 8 }}>Ronde {idx + 1} / {total}</div>
      <div className="card item-enter pull-scenario" key={`scn-${idx}`}>
        {item.scenario}
      </div>
      <p className="pull-instruction">
        Tarik garis dari hati di tengah ke pilihan yang paling nggambarkin kamu 👆
      </p>
      <div
        ref={arenaRef}
        className={`pull-arena ${picked ? 'pull-picked' : ''}`}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        onMouseDown={onDown} onMouseMove={dragging ? onMove : undefined}
        onMouseUp={onUp} onMouseLeave={dragging ? onUp : undefined}
      >
        {/* SVG garis real-time */}
        <svg className="pull-svg" aria-hidden="true">
          <defs>
            <linearGradient id="pullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--lylac-400)" />
              <stop offset="60%" stopColor="var(--lylac-500)" />
              <stop offset="100%" stopColor="#f5c842" />
            </linearGradient>
            <linearGradient id="pullGradWin" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5c842" />
              <stop offset="50%" stopColor="#ffe9a8" />
              <stop offset="100%" stopColor="var(--lylac-500)" />
            </linearGradient>
          </defs>
          {showLine && (
            <line
              x1={center.x} y1={center.y}
              x2={lineEnd.x} y2={lineEnd.y}
              stroke={picked ? 'url(#pullGradWin)' : 'url(#pullGrad)'}
              strokeWidth={picked ? 6 : 4}
              strokeLinecap="round"
              className={`pull-line ${retracting ? 'pull-line-retract' : ''} ${picked ? 'pull-line-win' : ''}`}
            />
          )}
        </svg>

        {/* Ikon tengah (titik mulai) */}
        <div
          ref={centerRef}
          className={`pull-center ${dragging ? 'dragging' : ''} ${picked ? 'done' : ''}`}
        >
          <span className="pull-heart">💜</span>
          {showHint && !dragging && !picked && (
            <span className="pull-hint-finger">👆</span>
          )}
        </div>

        {/* 4 titik tujuan di penjuru (posisi diacak per ronde) */}
        {choices.map(c => {
          const isPicked = picked === c.id
          const isHit = hitId === c.id
          const isDim = picked && picked !== c.id
          const pos = posMap[c.id] || 'tl'
          return (
            <div
              key={c.id}
              ref={el => { nodeRefs.current[c.id] = el }}
              className={`pull-node pull-pos-${pos} ${isPicked ? 'picked' : ''} ${isHit ? 'hit' : ''} ${isDim ? 'dim' : ''}`}
            >
              <span className="pull-node-text">{c.text}</span>
            </div>
          )
        })}
      </div>
      <ParticleBurst trigger={burst} origin={origin} emojis={['👑', '✨', '💜', '🤍', '💫']} />
    </div>
  )
}
