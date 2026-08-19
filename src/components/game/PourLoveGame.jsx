import { useRef, useState, useEffect, useCallback } from 'react'
import { ParticleBurst } from '../Particles'

// === Tuang Cat Cinta (Level 1: Consummate Love) ===
// Murni ekspresi diri — BUKAN game menang/kalah.
// Pemain drag teko cat ke gelas, tahan untuk tuang (makin lama = makin banyak).
// 3 gelas tersembunyi komponennya: Intimasi (biru), Passion (pink), Komitmen (ungu).
// Cat bercampur di mangkok = profil cinta pemain.

const GLASSES = [
  { id: 'intimasi', color: '#4A90D9', angle: -90 },  // atas
  { id: 'passion', color: '#D95A8A', angle: 150 },    // kiri bawah
  { id: 'komitmen', color: '#9E7BB5', angle: 30 }     // kanan bawah
]
const GLASS_LABEL = { intimasi: 'biru', passion: 'pink', komitmen: 'ungu' }

const MOMENTS = [
  { comp: 'intimasi', text: 'Dia tahu kamu sedih sebelum kamu bilang.' },
  { comp: 'intimasi', text: 'Chat jam 3 pagi hal random.' },
  { comp: 'passion', text: 'Jantungmu bedet tiap dia senyum.' },
  { comp: 'passion', text: 'Ada yang beda dari cara dia lihat kamu.' },
  { comp: 'komitmen', text: 'Dia bilang bicara masa depan.' },
  { comp: 'komitmen', text: 'Kamu udah gak bayang orang lain.' }
]

const MAX_VOLUME = 100 // volume maks per gelas (0-100)
const POUR_RATE = 1.8   // volume per frame saat tuang
const ROUND_DURATION = 20000 // 20s per ronde
const TUTORIAL_DURATION = 15000 // 15s

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

export default function PourLoveGame({ level, flavor, onFinal }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const stateRef = useRef({
    phase: 'intro',
    roundIdx: 0,
    volumes: [0, 0, 0],        // volume kumulatif per gelas (untuk hasil akhir)
    roundVolumes: [0, 0, 0],   // volume per ronde (reset tiap ronde)
    pouring: false,
    activeGlass: -1,
    potX: 0, potY: 0,
    potDragging: false,
    potDragOffset: { x: 0, y: 0 },
    glasses: [],
    bowl: { x: 0, y: 0, r: 0, fill: 0, mixColor: '#ffffff' },
    center: { x: 0, y: 0 },
    introTapped: [false, false, false],
    roundStart: 0,
    showMoment: false,
    momentText: '',
    done: false
  })
  const rafRef = useRef(null)
  const [, forceTick] = useState(0)

  const [phaseUI, setPhaseUI] = useState('intro')
  const [roundUI, setRoundUI] = useState(0)
  const [momentUI, setMomentUI] = useState('')
  const [showMomentUI, setShowMomentUI] = useState(false)
  const [result, setResult] = useState(null)
  const [burst, setBurst] = useState(0)

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
    const radius = Math.min(rect.width, rect.height) * 0.34
    const st = stateRef.current
    st.center = { x: cx, y: cy }
    // 3 gelas di posisi melingkar
    st.glasses = GLASSES.map(g => {
      const rad = (g.angle * Math.PI) / 180
      return {
        ...g,
        x: cx + Math.cos(rad) * radius,
        y: cy + Math.sin(rad) * radius,
        w: 64, h: 90,
        glow: 0
      }
    })
    // teko di bawah tengah
    if (st.potX === 0 && st.potY === 0) {
      st.potX = cx
      st.potY = rect.height - 60
    }
    // mangkok (fase hasil) di tengah
    st.bowl.x = cx
    st.bowl.y = cy
    st.bowl.r = radius * 0.85
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

    const { glasses, potX, potY, phase } = st

    // === Fase intro/play: gambar gelas + teko ===
    if (phase === 'intro' || phase === 'play') {
      // latar arena lembut
      ctx.fillStyle = '#fbf8fd'
      ctx.fillRect(0, 0, rect.width, rect.height)

      // gelas
      glasses.forEach((g, i) => {
        const vol = phase === 'play' ? st.roundVolumes[i] : (st.introTapped[i] ? 30 : 0)
        const fillH = (vol / MAX_VOLUME) * (g.h - 10)
        const glassTop = g.y - g.h / 2
        const glassBottom = g.y + g.h / 2

        // glow kalau intro tapped atau kalau gelas aktif saat pouring
        const isGlowing = (phase === 'intro' && st.introTapped[i]) || (st.activeGlass === i && st.pouring)
        if (isGlowing) {
          ctx.shadowColor = g.color
          ctx.shadowBlur = 16
        }

        // badan gelas (outline)
        ctx.strokeStyle = '#d8cee8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(g.x - g.w / 2, glassTop, g.w, g.h, 8)
        ctx.stroke()
        ctx.shadowBlur = 0

        // cairan
        if (fillH > 0) {
          const liquidTop = glassBottom - fillH
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(g.x - g.w / 2 + 2, liquidTop, g.w - 4, fillH, [4, 4, 6, 6])
          ctx.clip()
          ctx.fillStyle = g.color
          ctx.globalAlpha = 0.82
          ctx.fillRect(g.x - g.w / 2, liquidTop, g.w, fillH)
          // permukaan cairan (ripple halus)
          ctx.globalAlpha = 0.3
          ctx.fillStyle = '#fff'
          const ripple = Math.sin(Date.now() / 300 + i) * 2
          ctx.fillRect(g.x - g.w / 2, liquidTop + ripple, g.w, 2)
          ctx.restore()
        }

        // teko di atas gelas kalau pouring di gelas ini
        if (st.activeGlass === i && st.pouring) {
          // aliran cat dari teko ke gelas
          ctx.strokeStyle = g.color
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.moveTo(potX, potY)
          // bezier ke atas gelas
          const tx = g.x
          const ty = glassTop
          ctx.quadraticCurveTo((potX + tx) / 2, (potY + ty) / 2 - 20, tx, ty)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      // teko (pitcher)
      drawPot(ctx, potX, potY, phase === 'play' ? '#c8a8d4' : '#b8a4d9')
    }

    // === Fase hasil: mangkok + campuran warna ===
    if (phase === 'result') {
      const { bowl } = st
      ctx.fillStyle = '#fbf8fd'
      ctx.fillRect(0, 0, rect.width, rect.height)

      // mangkok (lingkaran besar)
      ctx.beginPath()
      ctx.arc(bowl.x, bowl.y, bowl.r, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = '#d8cee8'
      ctx.lineWidth = 3
      ctx.stroke()

      // cairan campuran (naik bertahap)
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
        // ripple
        ctx.globalAlpha = 0.25
        ctx.fillStyle = '#fff'
        const ripple = Math.sin(Date.now() / 400) * 3
        ctx.fillRect(bowl.x - bowl.r, liquidTop + ripple, bowl.r * 2, 2)
        ctx.restore()
      }

      // 3 gelas kecil di sisi (menunjukkan asal)
      glasses.forEach((g, i) => {
        const smallX = bowl.x + (i - 1) * 50
        const smallY = bowl.y - bowl.r - 30
        const vol = st.volumes[i]
        const fillH = (vol / MAX_VOLUME) * 24
        // glass mini
        ctx.strokeStyle = '#d8cee8'
        ctx.lineWidth = 1.5
        ctx.strokeRect(smallX - 12, smallY - 14, 24, 28)
        if (fillH > 0) {
          ctx.fillStyle = g.color
          ctx.globalAlpha = 0.8
          ctx.fillRect(smallX - 11, smallY + 13 - fillH, 22, fillH)
          ctx.globalAlpha = 1
        }
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
      // tap gelas untuk lihat warna menyala
      st.glasses.forEach((g, i) => {
        if (Math.abs(p.x - g.x) < g.w / 2 + 8 && Math.abs(p.y - g.y) < g.h / 2 + 8) {
          st.introTapped[i] = true
          forceTick(t => t + 1)
        }
      })
      return
    }

    if (st.phase === 'play') {
      // cek apakah megang teko
      const d = Math.hypot(p.x - st.potX, p.y - st.potY)
      if (d < 32) {
        st.potDragging = true
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

    // cek apakah teko di atas gelas → mulai tuang
    let overGlass = -1
    st.glasses.forEach((g, i) => {
      const dx = Math.abs(st.potX - g.x)
      const dy = Math.abs(st.potY - g.y)
      if (dx < g.w / 2 + 14 && dy < g.h / 2 + 44) {
        overGlass = i
      }
    })
    st.activeGlass = overGlass
    st.pouring = overGlass >= 0
    if (st.pouring) {
    }
  }

  const onPointerUp = () => {
    const st = stateRef.current
    st.potDragging = false
    st.pouring = false
    st.activeGlass = -1
  }

  // === Pouring logic (per frame) ===
  useEffect(() => {
    const interval = setInterval(() => {
      const st = stateRef.current
      if (st.phase === 'play' && st.pouring && st.activeGlass >= 0) {
        const i = st.activeGlass
        if (st.roundVolumes[i] < MAX_VOLUME) {
          st.roundVolumes[i] = Math.min(MAX_VOLUME, st.roundVolumes[i] + POUR_RATE)
        }
      }
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // === Fase 1: Intro (auto-advance 15s) ===
  useEffect(() => {
    const t = setTimeout(() => startRounds(), TUTORIAL_DURATION)
    return () => clearTimeout(t)
  }, [])

  // === Fase 3: Hasil (mangkok + campuran warna) — declare FIRST supaya endRound bisa refer ===
  const finishGame = useCallback(() => {
    const st = stateRef.current
    st.phase = 'result'
    st.done = true
    setPhaseUI('result')

    // hitung skor per komponen (0-5) dari volume kumulatif
    const scores = st.volumes.map(v => clamp((v / (MAX_VOLUME * 2)) * 5, 0, 5)) // 2 ronde per komponen, max volume = 2*MAX
    const dimScores = {
      intimasi: Math.round(scores[0] * 10) / 10,
      passion: Math.round(scores[1] * 10) / 10,
      komitmen: Math.round(scores[2] * 10) / 10
    }
    const total = Math.round(((dimScores.intimasi + dimScores.passion + dimScores.komitmen) / 3) * 10) / 10

    // campuran warna (weighted average RGB)
    const weights = st.volumes.map(v => v)
    const totalW = weights.reduce((s, w) => s + w, 0)
    let mixColor = '#ffffff'
    if (totalW > 0) {
      let r = 0, g = 0, b = 0
      GLASSES.forEach((gl, i) => {
        const hex = gl.color
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
    const fillTarget = totalW > 0 ? 0.85 : 0.1
    let fill = 0
    const fillAnim = setInterval(() => {
      fill += 0.02
      if (fill >= fillTarget) { fill = fillTarget; clearInterval(fillAnim) }
      st.bowl.fill = fill
    }, 16)

    // insight berdasarkan distribusi
    const sorted = st.volumes.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)
    const max = sorted[0].v
    const min = sorted[2].v
    const diff = max - min
    const dominant = sorted[0]
    const empty = sorted.find(s => s.v === 0)

    let insight
    if (totalW === 0) {
      insight = {
        title: 'Cat Kosong 🤍',
        text: 'Kamu nggak menuang cat ke gelas mana pun — itu juga jawaban. Nanti di level berikutnya kita bedah apa jadinya tanpa komponen apapun.'
      }
    } else if (diff <= MAX_VOLUME * 0.3 && min > MAX_VOLUME * 0.2) {
      insight = {
        title: 'Consummate Love! 💞',
        text: 'Tiga warna jadi putih cerah. Cinta yang lengkap menurutmu — intimasi, passion, dan komitmen sama kuat.'
      }
    } else if (empty && empty.v === 0) {
      const compName = ['Intimasi', 'Passion', 'Komitmen'][empty.i]
      const compColor = GLASS_LABEL[GLASSES[empty.i].id]
      insight = {
        title: `Gelas ${compColor} Kosong 🤍`,
        text: `${compName} belum muncul di pengalamanmu. Itu oke — di level berikutnya kita bedah apa jadinya tanpa ${compName.toLowerCase()}.`
      }
    } else {
      const compName = ['Intimasi', 'Passion', 'Komitmen'][dominant.i]
      const compColor = GLASS_LABEL[GLASSES[dominant.i].id]
      insight = {
        title: `Warna ${compColor} Paling Pekat ✨`,
        text: `${compName} paling kuat buatmu. Consummate love butuh ketiganya — di level berikutnya kita bedah.`
      }
    }

    setResult({ dimScores, total, insight, mixColor })
    setBurst(b => b + 1)
    forceTick(t => t + 1) // paksa re-render
    // re-trigger render setelah 100ms untuk memastikan
    setTimeout(() => { setPhaseUI('result'); forceTick(t => t + 1) }, 100)

    // skor consummate → map ke agree/disagree (kompatibilitas sistem skoring Modul A)
    const consummateAnswer = total >= 3 ? 'agree' : 'disagree'
    const finalAnswers = { 'A1.1': consummateAnswer }

    // auto-advance via onFinal (LevelPlay handle celebration + auto-advance)
    // tampilkan hasil ~13s sebelum onFinal (Fase 3 spec: ~15 detik)
    setTimeout(() => onFinal(finalAnswers), 13000)
  }, [onFinal])

  const endRound = useCallback((idx) => {
    const st = stateRef.current
    // simpan volume ronde ini ke kumulatif + catat skor (0-5)
    st.volumes = st.volumes.map((v, i) => v + st.roundVolumes[i])
    st.pouring = false
    st.activeGlass = -1
    st.potDragging = false

    if (idx + 1 < MOMENTS.length) {
      setTimeout(() => startRoundRef.current(idx + 1), 400)
    } else {
      setTimeout(() => finishGame(), 400)
    }
  }, [finishGame])

  // ref to startRound (avoid TDZ — startRound refs endRound)
  const startRoundRef = useRef(null)

  const startRound = useCallback((idx) => {
    const st = stateRef.current
    st.roundIdx = idx
    st.roundVolumes = [0, 0, 0]
    st.roundStart = Date.now()
    st.momentText = MOMENTS[idx].text
    st.showMoment = true
    setRoundUI(idx)
    setMomentUI(MOMENTS[idx].text)
    setShowMomentUI(true)

    // sembunyikan momen setelah 3s, ronde lanjut
    setTimeout(() => {
      st.showMoment = false
      setShowMomentUI(false)
    }, 3000)

    // ronde berakhir setelah ROUND_DURATION
    setTimeout(() => endRoundRef.current(idx), ROUND_DURATION)
  }, [])

  // refs to break circular deps
  const endRoundRef = useRef(null)
  startRoundRef.current = startRound
  endRoundRef.current = endRound

  // === Fase 2: 6 ronde ===
  const startRounds = useCallback(() => {
    const st = stateRef.current
    if (st.phase === 'play') return // cegah panggilan ganda
    st.phase = 'play'
    st.roundIdx = 0
    st.roundVolumes = [0, 0, 0]
    setPhaseUI('play')
    startRound(0)
  }, [startRound])

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
              Tiga gelas cinta. Nanti kamu tuang cat ke gelas yang rasanya pas.
            </p>
            <p className="pl-hud-text muted" style={{ marginTop: 6, fontSize: 13 }}>
              Tap tiap gelas buat lihat warnanya. 🤍
            </p>
            <button className="btn pl-skip" onClick={startRounds}>Lanjut →</button>
          </div>
        )}

        {/* HUD fase play */}
        {phaseUI === 'play' && (
          <div className="pl-hud pl-play">
            <div className="pl-round-pill">Momen {roundUI + 1} / 6</div>
            {showMomentUI ? (
              <div className="pl-moment fade-in">{momentUI}</div>
            ) : (
              <p className="pl-hint">Drag teko ke gelas, tahan buat tuang. Bebas ke gelas mana aja — atau skip.</p>
            )}
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
  // badan teko
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
