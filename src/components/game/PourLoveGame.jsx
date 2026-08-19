import { useRef, useState, useEffect, useCallback } from 'react'
import { ParticleBurst } from '../Particles'

// === Tuang Cat Cinta (Level 1: Consummate Love) — versi 2 zona ===
// Murni ekspresi diri — BUKAN game menang/kalah.
// Pemain drag teko cat ke kiri ("Bukan Aku") atau kanan ("Aku Banget").
// Tahan untuk tuang (makin lama = makin yakin), lepas = berhenti → langsung lanjut.
// Skip (tidak tuang) = netral. Tidak ada timer, pemain kontrol pace sendiri.

const COMPONENTS = [
  { id: 'intimasi', color: '#4A90D9', label: 'Intimasi', colorName: 'biru' },
  { id: 'passion', color: '#D95A8A', label: 'Passion', colorName: 'pink' },
  { id: 'komitmen', color: '#9E7BB5', label: 'Komitmen', colorName: 'ungu' }
]

const MOMENTS = [
  { comp: 'intimasi', text: 'Dia tahu kamu sedih sebelum kamu bilang.' },
  { comp: 'intimasi', text: 'Chat jam 3 pagi hal random.' },
  { comp: 'passion', text: 'Jantungmu bedet tiap dia senyum.' },
  { comp: 'passion', text: 'Ada yang beda dari cara dia lihat kamu.' },
  { comp: 'komitmen', text: 'Dia bilang bicara masa depan.' },
  { comp: 'komitmen', text: 'Kamu udah gak bayang orang lain.' }
]

const MAX_VOLUME = 100
const POUR_RATE = 2.2
const TUTORIAL_DURATION = 15000

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

// skor 1-5 berdasarkan arah + magnitude volume
function volumeToScore(direction, volume) {
  // direction: -1 (kiri/Bukan Aku), 0 (netral/skip), 1 (kanan/Aku Banget)
  if (direction === 0 || volume === 0) return 3 // netral
  // magnitude 0..1
  const mag = clamp(volume / MAX_VOLUME, 0, 1)
  if (direction < 0) {
    // kiri: penuh=1, sedang=2
    return mag > 0.6 ? 1 : 2
  } else {
    // kanan: sedang=4, penuh=5
    return mag > 0.6 ? 5 : 4
  }
}

export default function PourLoveGame({ level, flavor, onFinal }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const stateRef = useRef({
    phase: 'intro',
    roundIdx: 0,
    // per ronde: direction (-1/0/1), volume (0-100)
    roundDirection: 0,
    roundVolume: 0,
    roundDone: false,
    // kumulatif skor per komponen (0-5, 2 ronde per komponen)
    compScores: { intimasi: [], passion: [], komitmen: [] },
    pouring: false,
    activeZone: null, // 'left' | 'right' | null
    potX: 0, potY: 0,
    potDragging: false,
    potDragOffset: { x: 0, y: 0 },
    potReleased: false, // flag: teko baru saja dilepas → trigger advance
    zones: { left: { x: 0, y: 0, w: 0, h: 0, glow: 0 }, right: { x: 0, y: 0, w: 0, h: 0, glow: 0 } },
    leftFill: 0,  // tinggi cairan di zona kiri (visual)
    rightFill: 0, // tinggi cairan di zona kanan (visual)
    activeColor: '#c8a8d4', // warna cat aktif (per komponen ronde)
    bowl: { x: 0, y: 0, r: 0, fill: 0, mixColor: '#ffffff' },
    center: { x: 0, y: 0 },
    introTapped: { left: false, right: false },
    done: false
  })
  const rafRef = useRef(null)
  const [phaseUI, setPhaseUI] = useState('intro')
  const [roundUI, setRoundUI] = useState(0)
  const [result, setResult] = useState(null)
  const [burst, setBurst] = useState(0)
  const [, forceTick] = useState(0)

  // warna cat per ronde (sesuai komponen momen)
  const roundColor = COMPONENTS.find(c => c.id === MOMENTS[roundUI]?.comp)?.color || '#c8a8d4'

  // === Setup canvas ===
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const st = stateRef.current
    st.center = { x: cx, y: cy }
    st.canvasH = rect.height
    // 2 zona: kiri & kanan, masing-masing panel besar
    const zoneW = rect.width * 0.36
    const zoneH = rect.height * 0.42
    const zoneY = cy - zoneH / 2 + 10
    st.zones.left = { x: cx - zoneW - 12, y: zoneY, w: zoneW, h: zoneH, glow: 0 }
    st.zones.right = { x: cx + 12, y: zoneY, w: zoneW, h: zoneH, glow: 0 }
    // teko di bawah tengah
    if (st.potX === 0 && st.potY === 0) {
      st.potX = cx
      st.potY = rect.height - 50
    }
    // mangkok (fase hasil)
    st.bowl.x = cx
    st.bowl.y = cy
    st.bowl.r = Math.min(rect.width, rect.height) * 0.32
  }, [])

  useEffect(() => {
    setupCanvas()
    const onResize = () => setupCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [setupCanvas])

  // === Render loop ===
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const st = stateRef.current
    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)

    const { potX, potY, phase } = st

    if (phase === 'intro' || phase === 'play') {
      ctx.fillStyle = '#fbf8fd'
      ctx.fillRect(0, 0, rect.width, rect.height)

      // 2 zona
      const zones = [
        { ...st.zones.left, label: 'Bukan\nAku', side: 'left', fill: st.leftFill, tapped: st.introTapped.left },
        { ...st.zones.right, label: 'Aku\nBanget', side: 'right', fill: st.rightFill, tapped: st.introTapped.right }
      ]

      zones.forEach((z, i) => {
        const isActive = st.activeZone === z.side && st.pouring
        const isGlowing = (phase === 'intro' && z.tapped) || isActive

        // glow
        if (isGlowing) {
          ctx.shadowColor = z.side === 'left' ? '#d95a8a' : '#4A90D9'
          ctx.shadowBlur = 20
        }

        // badan zona (rounded rect)
        ctx.beginPath()
        ctx.roundRect(z.x, z.y, z.w, z.h, 16)
        ctx.fillStyle = isGlowing ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = isGlowing ? (z.side === 'left' ? '#d95a8a' : '#4A90D9') : '#d8cee8'
        ctx.lineWidth = isGlowing ? 2.5 : 1.5
        ctx.stroke()

        // label zona (di atas)
        ctx.fillStyle = z.side === 'left' ? '#d95a8a' : '#4A90D9'
        ctx.font = '700 14px -apple-system, sans-serif'
        ctx.textAlign = 'center'
        const labelText = z.side === 'left' ? 'Bukan Aku' : 'Aku Banget'
        ctx.fillText(labelText, z.x + z.w / 2, z.y - 10)

        // cairan di zona (jika ada)
        if (z.fill > 0 && phase === 'play') {
          const fillH = (z.fill / MAX_VOLUME) * (z.h - 16)
          const liquidTop = z.y + z.h - fillH - 8
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(z.x + 4, liquidTop, z.w - 8, fillH, [6, 6, 12, 12])
          ctx.clip()
          ctx.fillStyle = st.activeColor
          ctx.globalAlpha = 0.75
          ctx.fillRect(z.x, liquidTop, z.w, fillH)
          // ripple
          ctx.globalAlpha = 0.3
          ctx.fillStyle = '#fff'
          const ripple = Math.sin(Date.now() / 300 + i) * 2
          ctx.fillRect(z.x, liquidTop + ripple, z.w, 2)
          ctx.restore()
        }
      })

      // teko
      drawPot(ctx, potX, potY, phase === 'play' ? st.activeColor : '#b8a4d9')

      // aliran cat dari teko ke zona aktif
      if (st.pouring && st.activeZone) {
        const z = st.activeZone === 'left' ? st.zones.left : st.zones.right
        ctx.strokeStyle = st.activeColor
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.moveTo(potX, potY - 18)
        const targetX = z.x + z.w / 2
        const targetY = z.y + z.h * 0.3
        ctx.quadraticCurveTo((potX + targetX) / 2, (potY + targetY) / 2 - 30, targetX, targetY)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    // === Fase hasil: mangkok + campuran warna ===
    if (phase === 'result') {
      const { bowl } = st
      ctx.fillStyle = '#fbf8fd'
      ctx.fillRect(0, 0, rect.width, rect.height)

      // mangkok
      ctx.beginPath()
      ctx.arc(bowl.x, bowl.y, bowl.r, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = '#d8cee8'
      ctx.lineWidth = 3
      ctx.stroke()

      // cairan campuran
      if (bowl.fill > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(bowl.x, bowl.y, bowl.r - 6, 0, Math.PI * 2)
        ctx.clip()
        const fillH = bowl.fill * (bowl.r * 2)
        const liquidTop = bowl.y + bowl.r - fillH
        ctx.fillStyle = bowl.mixColor
        ctx.globalAlpha = 0.85
        ctx.fillRect(bowl.x - bowl.r, liquidTop, bowl.r * 2, fillH)
        ctx.globalAlpha = 0.25
        ctx.fillStyle = '#fff'
        const ripple = Math.sin(Date.now() / 400) * 3
        ctx.fillRect(bowl.x - bowl.r, liquidTop + ripple, bowl.r * 2, 2)
        ctx.restore()
      }

      // 3 label komponen di sisi
      COMPONENTS.forEach((c, i) => {
        const sx = bowl.x + (i - 1) * 60
        const sy = bowl.y - bowl.r - 28
        ctx.fillStyle = c.color
        ctx.beginPath()
        ctx.arc(sx, sy, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#8b8599'
        ctx.font = '600 10px -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(c.colorName, sx, sy + 22)
      })
    }

    rafRef.current = requestAnimationFrame(render)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafRef.current)
  }, [render])

  // === Pointer handling ===
  const getPointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - rect.left, y: p.clientY - rect.top }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const p = getPointer(e)
    const st = stateRef.current

    if (st.phase === 'intro') {
      // tap zona untuk lihat menyala
      const zl = st.zones.left, zr = st.zones.right
      if (p.x >= zl.x && p.x <= zl.x + zl.w && p.y >= zl.y && p.y <= zl.y + zl.h) {
        st.introTapped.left = true; forceTick(t => t + 1)
      } else if (p.x >= zr.x && p.x <= zr.x + zr.w && p.y >= zr.y && p.y <= zr.y + zr.h) {
        st.introTapped.right = true; forceTick(t => t + 1)
      }
      return
    }

    if (st.phase === 'play') {
      // cek apakah megang teko
      const d = Math.hypot(p.x - st.potX, p.y - st.potY)
      if (d < 36) {
        st.potDragging = true
        st.potReleased = false
        st.potDragOffset = { x: p.x - st.potX, y: p.y - st.potY }
      }
    }
  }

  const onPointerMove = (e) => {
    const st = stateRef.current
    if (st.phase !== 'play' || !st.potDragging) return
    e.preventDefault()
    const p = getPointer(e)
    const rect = canvasRef.current.getBoundingClientRect()
    st.potX = clamp(p.x - st.potDragOffset.x, 30, rect.width - 30)
    st.potY = clamp(p.y - st.potDragOffset.y, 30, rect.height - 30)

    // cek zona aktif
    const zl = st.zones.left, zr = st.zones.right
    let active = null
    if (st.potX >= zl.x && st.potX <= zl.x + zl.w && st.potY >= zl.y && st.potY <= zl.y + zl.h) {
      active = 'left'
    } else if (st.potX >= zr.x && st.potX <= zr.x + zr.w && st.potY >= zr.y && st.potY <= zr.y + zr.h) {
      active = 'right'
    }
    st.activeZone = active
    st.pouring = active !== null
  }

  const onPointerUp = () => {
    const st = stateRef.current
    if (st.phase !== 'play') return
    if (st.potDragging) {
      st.potDragging = false
      st.pouring = false
      st.activeZone = null
      st.potReleased = true
    }
  }

  // === Pouring logic (per frame) ===
  useEffect(() => {
    const interval = setInterval(() => {
      const st = stateRef.current
      if (st.phase === 'play' && st.pouring && st.activeZone) {
        const dir = st.activeZone === 'left' ? -1 : 1
        st.roundDirection = dir
        if (st.roundVolume < MAX_VOLUME) {
          st.roundVolume = Math.min(MAX_VOLUME, st.roundVolume + POUR_RATE)
        }
        // visual fill
        if (dir < 0) st.leftFill = st.roundVolume
        else st.rightFill = st.roundVolume
      }
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // === Auto-advance: saat teko dilepas (atau skip), lanjut ronde ===
  useEffect(() => {
    const interval = setInterval(() => {
      const st = stateRef.current
      if (st.phase === 'play' && st.potReleased && !st.roundDone) {
        st.roundDone = true
        st.potReleased = false
        // hitung skor ronde ini
        const score = volumeToScore(st.roundDirection, st.roundVolume)
        const comp = MOMENTS[st.roundIdx].comp
        st.compScores[comp].push(score)
        // tunggu sebentar lalu lanjut
        setTimeout(() => advanceRound(), 600)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // === Fase 1: Intro ===
  useEffect(() => {
    const t = setTimeout(() => startRounds(), TUTORIAL_DURATION)
    return () => clearTimeout(t)
  }, [])

  const startRounds = useCallback(() => {
    const st = stateRef.current
    if (st.phase !== 'intro') return
    st.phase = 'play'
    setPhaseUI('play')
    startRound(0)
  }, [])

  const startRound = useCallback((idx) => {
    const st = stateRef.current
    st.roundIdx = idx
    st.roundDirection = 0
    st.roundVolume = 0
    st.roundDone = false
    st.leftFill = 0
    st.rightFill = 0
    st.activeColor = COMPONENTS.find(c => c.id === MOMENTS[idx].comp)?.color || '#c8a4d9'
    st.potReleased = false
    st.potDragging = false
    st.pouring = false
    st.activeZone = null
    // reset posisi teko ke bawah tengah
    st.potX = st.center.x
    st.potY = (st.canvasH || st.center.y * 2) - 50
    setRoundUI(idx)
  }, [])

  const advanceRound = useCallback(() => {
    const st = stateRef.current
    const idx = st.roundIdx
    if (idx + 1 < MOMENTS.length) {
      startRound(idx + 1)
    } else {
      finishGame()
    }
  }, [startRound])

  // === Fase 3: Hasil ===
  const finishGame = useCallback(() => {
    const st = stateRef.current
    st.phase = 'result'
    st.done = true
    setPhaseUI('result')

    // skor per komponen (mean 2 ronde)
    const dimScores = {}
    COMPONENTS.forEach(c => {
      const arr = st.compScores[c.id]
      dimScores[c.id] = arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : 3
    })
    const total = Math.round(((dimScores.intimasi + dimScores.passion + dimScores.komitmen) / 3) * 10) / 10

    // campuran warna: weighted RGB berdasarkan skor komponen (skor tinggi = warna kuat)
    const weights = COMPONENTS.map(c => dimScores[c.id])
    const totalW = weights.reduce((s, w) => s + w, 0)
    let mixColor = '#ffffff'
    if (totalW > 0) {
      let r = 0, g = 0, b = 0
      COMPONENTS.forEach((c, i) => {
        const hex = c.color
        const cr = parseInt(hex.slice(1, 3), 16)
        const cg = parseInt(hex.slice(3, 5), 16)
        const cb = parseInt(hex.slice(5, 7), 16)
        const w = weights[i]
        r += cr * w
        g += cg * w
        b += cb * w
      })
      r = Math.round(r / totalW)
      g = Math.round(g / totalW)
      b = Math.round(b / totalW)
      mixColor = `rgb(${r},${g},${b})`
    }
    st.bowl.mixColor = mixColor

    // animasi mangkok terisi
    const fillTarget = 0.85
    let fill = 0
    const fillAnim = setInterval(() => {
      fill += 0.02
      if (fill >= fillTarget) { fill = fillTarget; clearInterval(fillAnim) }
      st.bowl.fill = fill
    }, 16)

    // insight berdasarkan distribusi skor komponen
    const entries = COMPONENTS.map(c => ({ ...c, score: dimScores[c.id] }))
    const sorted = [...entries].sort((a, b) => b.score - a.score)
    const max = sorted[0]
    const min = sorted[2]
    const diff = max.score - min.score

    let insight
    if (diff <= 1 && min.score >= 4) {
      insight = {
        title: 'Consummate Love! 💞',
        text: 'Tiga warna jadi putih cerah. Cinta yang lengkap menurutmu — intimasi, passion, dan komitmen sama kuat.'
      }
    } else if (min.score <= 2) {
      insight = {
        title: `Warna ${min.colorName} Hampir Hilang 🤍`,
        text: `${min.label} belum muncul di pengalamanmu. Itu oke — di level berikutnya kita bedah apa jadinya tanpa ${min.label.toLowerCase()}.`
      }
    } else {
      insight = {
        title: `Warna ${max.colorName} Paling Pekat ✨`,
        text: `${max.label} paling kuat buatmu. Consummate love butuh ketiganya — di level berikutnya kita bedah.`
      }
    }

    setResult({ dimScores, total, insight, mixColor })
    setBurst(b => b + 1)
    forceTick(t => t + 1)

    // skor consummate → map ke agree/disagree
    const consummateAnswer = total >= 3 ? 'agree' : 'disagree'
    const finalAnswers = { 'A1.1': consummateAnswer }

    // tampilkan hasil ~13s sebelum onFinal
    setTimeout(() => onFinal(finalAnswers), 13000)
  }, [onFinal])

  // === Render UI ===
  return (
    <div className="fade-in">
      <div ref={wrapRef} className="pl-arena-wrap">
        <canvas
          ref={canvasRef}
          className="pl-canvas"
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
        />

        {/* HUD fase intro */}
        {phaseUI === 'intro' && (
          <div className="pl-hud pl-intro fade-in">
            <div className="pl-hud-emoji">🫖</div>
            <div className="pl-hud-title">Tuang Cat Cinta</div>
            <p className="pl-hud-text">
              Tuang ke <strong style={{color:'#4A90D9'}}>kanan</strong> kalau setuju.
              Tuang ke <strong style={{color:'#d95a8a'}}>kiri</strong> kalau nggak.
            </p>
            <p className="pl-hud-text muted" style={{ marginTop: 6, fontSize: 13 }}>
              Banyak cat = makin yakin. Tap kedua area buat lihat warna menyala. 🤍
            </p>
            <button className="btn pl-skip" onClick={startRounds}>Lanjut →</button>
          </div>
        )}

        {/* HUD fase play */}
        {phaseUI === 'play' && (
          <div className="pl-hud pl-play">
            <div className="pl-round-pill">Momen {roundUI + 1} / 6</div>
            <div className="pl-statement fade-in" key={roundUI}>{MOMENTS[roundUI].text}</div>
            <p className="pl-hint">Drag teko, tahan di kiri/kanan buat tuang. Lepas = lanjut.</p>
          </div>
        )}

        {/* HUD fase hasil */}
        {phaseUI === 'result' && result && (
          <div className="pl-hud pl-result fade-in">
            <div className="pl-hud-emoji">🎨</div>
            <div className="pl-hud-title">{result.insight.title}</div>
            <p className="pl-hud-text" style={{ marginTop: 6 }}>{result.insight.text}</p>
            <p className="pl-hook">Tapi nggak semua cinta tiga warna. Kadang cuma dua. Kadang satu. Di level berikutnya, kita bedah.</p>
            <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>+25 XP</p>
          </div>
        )}
      </div>
      <ParticleBurst trigger={burst} emojis={['🎨','💜','🤍','✨']} />
    </div>
  )
}

// === Draw teko (pitcher) ===
function drawPot(ctx, x, y, color) {
  ctx.save()
  ctx.translate(x, y)
  // body (trapesium)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(-18, -18)
  ctx.lineTo(18, -18)
  ctx.lineTo(22, 18)
  ctx.lineTo(-22, 18)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,.5)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  // mulut teko (corong) miring ke kiri
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(-18, -18)
  ctx.lineTo(-26, -22)
  ctx.lineTo(-22, -14)
  ctx.lineTo(-18, -12)
  ctx.closePath()
  ctx.fill()
  // pegangan
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(22, 0, 10, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()
  // highlight
  ctx.fillStyle = 'rgba(255,255,255,.25)'
  ctx.fillRect(-14, -14, 4, 28)
  ctx.restore()
}
