import { useRef, useState, useEffect, useCallback } from 'react'
import { ParticleBurst } from '../Particles'

// === Tarik Tambang Cinta (Level 1: Consummate Love) ===
// Murni ekspresi diri — BUKAN game menang/kalah.
// Simpul di tengah, 3 tali (Intimasi biru, Passion pink, Komitmen ungu).
// Pemain drag simpul, angin per ronde menarik 1 tali.
// Skor: lean-in ke arah angin = tinggi, resist = rendah.

const COMPONENTS = [
  { id: 'intimasi', label: 'Intimasi', color: '#5b9bd5', angle: -90 }, // atas
  { id: 'passion', label: 'Passion', color: '#e87a9d', angle: 150 },   // kiri bawah
  { id: 'komitmen', label: 'Komitmen', color: '#9b82c4', angle: 30 }   // kanan bawah
]

const ROUNDS = [
  { comp: 'intimasi', scenario: 'Pasanganmu peka — dia tahu kamu sedih sebelum kamu ngomong.' },
  { comp: 'intimasi', scenario: 'Chat random jam 3 pagi, tanpa alasan penting, cuma buat ngobrol.' },
  { comp: 'passion', scenario: 'Jantung kamu berdebar tiap kali dia tersenyum.' },
  { comp: 'passion', scenario: 'Cara dia memandang kamu itu... beda. Bikin klepek-klepek.' },
  { comp: 'komitmen', scenario: 'Dia ngajak ngobrol soal masa depan bareng kamu.' },
  { comp: 'komitmen', scenario: 'Sejak ketemu dia, kamu udah nggak kepikiran orang lain.' }
]

// posisi anchor 3 tali (relatif ke pusat arena)
function anchorPos(angle, dist) {
  const rad = (angle * Math.PI) / 180
  return { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist }
}

// vektor unit dari simpul ke anchor (arah tarikan tali)
function unitToAnchor(knot, anchor) {
  const dx = anchor.x - knot.x
  const dy = anchor.y - knot.y
  const len = Math.hypot(dx, dy) || 1
  return { x: dx / len, y: dy / len }
}

export default function TugOfLoveGame({ level, flavor, onFinal }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const stateRef = useRef({
    knot: { x: 0, y: 0, vx: 0, vy: 0 },
    dragging: false,
    dragOffset: { x: 0, y: 0 },
    anchors: [],
    center: { x: 0, y: 0 },
    radius: 0,
    phase: 'tutorial',
    roundIdx: 0,
    windComp: null,
    windStrength: 0,
    roundStart: 0,
    roundSamples: [], // posisi knot per frame selama ronde
    roundScores: [], // skor 0-5 per ronde
    done: false
  })
  const rafRef = useRef(null)
  const [phaseUI, setPhaseUI] = useState('tutorial')
  const [roundUI, setRoundUI] = useState(0)
  const [scenarioUI, setScenarioUI] = useState('')
  const [showScenario, setShowScenario] = useState(false)
  const [result, setResult] = useState(null)
  const [burst, setBurst] = useState(0)

  // === Setup canvas size ===
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
    const radius = Math.min(rect.width, rect.height) * 0.38
    const st = stateRef.current
    st.center = { x: cx, y: cy }
    st.radius = radius
    st.anchors = COMPONENTS.map(c => {
      const p = anchorPos(c.angle, radius)
      return { ...c, x: cx + p.x, y: cy + p.y }
    })
    if (st.knot.x === 0 && st.knot.y === 0) {
      st.knot = { x: cx, y: cy, vx: 0, vy: 0 }
    }
  }, [])

  useEffect(() => {
    setupCanvas()
    const onResize = () => setupCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [setupCanvas])

  // === Physics loop ===
  const physics = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const st = stateRef.current
    const { knot, center, radius, anchors } = st

    // Gaya total: tarikan tali (spring) + angin + drag manual
    let fx = 0, fy = 0

    // Tarikan tali: setiap tali menarik simpul ke anchor-nya dengan spring lembut
    // (selalu aktif — ini base pull, mewakili bahwa ketiga komponen cinta selalu "menarik")
    anchors.forEach(a => {
      const dx = a.x - knot.x
      const dy = a.y - knot.y
      const dist = Math.hypot(dx, dy)
      // spring constant — lembut supaya natural, tidak kaku
      const k = 0.0008
      fx += dx * k
      fy += dy * k
    })

    // Angin: tali komponen aktif dapat kekuatan ekstra
    if (st.windComp && st.phase === 'play') {
      const a = anchors.find(x => x.id === st.windComp)
      if (a) {
        const u = unitToAnchor(knot, a)
        fx += u.x * st.windStrength
        fy += u.y * st.windStrength
      }
    }

    // Drag manual: kalau dragging, posisi langsung mengikuti pointer
    if (st.dragging) {
      // target = pointer - offset; gerakkan cepat ke target
      const tx = st.pointer.x - st.dragOffset.x
      const ty = st.pointer.y - st.dragOffset.y
      knot.vx = (tx - knot.x) * 0.4
      knot.vy = (ty - knot.y) * 0.4
      knot.x = tx
      knot.y = ty
    } else {
      // terapkan gaya + damping (inersia)
      knot.vx = (knot.vx + fx) * 0.88
      knot.vy = (knot.vy + fy) * 0.88
      knot.x += knot.vx
      knot.y += knot.vy
    }

    // Batasi simpul di dalam arena (lingkaran)
    const ddx = knot.x - center.x
    const ddy = knot.y - center.y
    const d = Math.hypot(ddx, ddy)
    const maxR = radius * 0.82
    if (d > maxR) {
      const nx = ddx / d
      const ny = ddy / d
      knot.x = center.x + nx * maxR
      knot.y = center.y + ny * maxR
      knot.vx *= -0.3
      knot.vy *= -0.3
    }

    // Sampling posisi selama ronde
    if (st.phase === 'play' && st.roundStart > 0) {
      st.roundSamples.push({ x: knot.x - center.x, y: knot.y - center.y })
    }

    // === Render ===
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // background arena (lingkaran soft)
    const grad = ctx.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, radius)
    grad.addColorStop(0, '#fbf8fd')
    grad.addColorStop(1, '#f3eef9')
    ctx.beginPath()
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
    ctx.strokeStyle = '#e8e0f0'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // ring guide (konsentris) — halus
    ctx.strokeStyle = 'rgba(184,164,217,0.12)'
    ctx.lineWidth = 1
    for (let r = radius * 0.4; r < radius; r += radius * 0.2) {
      ctx.beginPath()
      ctx.arc(center.x, center.y, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // tali (garis dari anchor ke simpul) — tebal & berwarna sesuai komponen
    anchors.forEach(a => {
      const isActive = st.windComp === a.id && st.phase === 'play'
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(knot.x, knot.y)
      ctx.strokeStyle = a.color
      ctx.lineWidth = isActive ? 4.5 : 3
      ctx.globalAlpha = isActive ? 1 : 0.55
      ctx.stroke()
      ctx.globalAlpha = 1

      // anchor node (lingkaran kecil di ujung)
      ctx.beginPath()
      ctx.arc(a.x, a.y, 14, 0, Math.PI * 2)
      ctx.fillStyle = a.color
      ctx.globalAlpha = isActive ? 0.95 : 0.5
      ctx.fill()
      ctx.globalAlpha = 1

      // label komponen
      ctx.fillStyle = a.color
      ctx.font = '600 11px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      const lp = anchorPos(a.angle, radius + 22)
      ctx.fillText(a.label, center.x + lp.x, center.y + lp.y)
    })

    // efek angin (garis putus-putus dari anchor aktif ke arah simpul)
    if (st.windComp && st.phase === 'play') {
      const a = anchors.find(x => x.id === st.windComp)
      if (a) {
        const u = unitToAnchor(knot, a)
        const t = Date.now() / 400
        for (let i = 0; i < 3; i++) {
          const offset = (t + i * 0.4) % 1
          const px = a.x + (knot.x - a.x) * (1 - offset) + (Math.random() - 0.5) * 4
          const py = a.y + (knot.y - a.y) * (1 - offset) + (Math.random() - 0.5) * 4
          ctx.beginPath()
          ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = a.color
          ctx.globalAlpha = 0.4 * (1 - offset)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
    }

    // simpul (knot) — lingkaran gradient dgn glow
    const kg = ctx.createRadialGradient(knot.x - 4, knot.y - 4, 2, knot.x, knot.y, 18)
    kg.addColorStop(0, '#ffffff')
    kg.addColorStop(1, '#c8a8d4')
    ctx.beginPath()
    ctx.arc(knot.x, knot.y, 18, 0, Math.PI * 2)
    ctx.fillStyle = kg
    ctx.shadowColor = 'rgba(149,122,196,0.4)'
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#9b82c4'
    ctx.lineWidth = 2
    ctx.stroke()
    // titik tengah simpul
    ctx.beginPath()
    ctx.arc(knot.x, knot.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#9b82c4'
    ctx.fill()

    rafRef.current = requestAnimationFrame(physics)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(physics)
    return () => cancelAnimationFrame(rafRef.current)
  }, [physics])

  // === Pointer handling (drag simpul) ===
  const getPointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - rect.left, y: p.clientY - rect.top }
  }
  const onPointerDown = (e) => {
    e.preventDefault()
    const p = getPointer(e)
    const st = stateRef.current
    const d = Math.hypot(p.x - st.knot.x, p.y - st.knot.y)
    if (d < 30) {
      st.dragging = true
      st.pointer = p
      st.dragOffset = { x: p.x - st.knot.x, y: p.y - st.knot.y }
    }
  }
  const onPointerMove = (e) => {
    const st = stateRef.current
    if (!st.dragging) return
    e.preventDefault()
    st.pointer = getPointer(e)
  }
  const onPointerUp = () => {
    stateRef.current.dragging = false
  }

  // === Fase 1: Tutorial (auto-advance setelah ~20s) ===
  useEffect(() => {
    const t = setTimeout(() => startRounds(), 20000)
    return () => clearTimeout(t)
  }, [])

  const startRounds = useCallback(() => {
    setPhaseUI('play')
    stateRef.current.phase = 'play'
    startRound(0)
  }, [])

  // === Fase 2: 6 ronde ===
  const startRound = useCallback((idx) => {
    const st = stateRef.current
    st.roundIdx = idx
    st.roundSamples = []
    st.windComp = ROUNDS[idx].comp
    st.windStrength = 0.18 + Math.random() * 0.06
    st.roundStart = Date.now()
    setRoundUI(idx)
    setScenarioUI(ROUNDS[idx].scenario)
    setShowScenario(true)

    // sembunyikan skenario setelah 2.5s, tetap main sampai ronde selesai
    setTimeout(() => setShowScenario(false), 2500)

    // ronde berakhir setelah 16 detik
    const dur = 16000
    setTimeout(() => endRound(idx), dur)
  }, [])

  const endRound = useCallback((idx) => {
    const st = stateRef.current
    // hitung skor condong 0-5 untuk ronde ini
    const comp = ROUNDS[idx].comp
    const anchor = st.anchors.find(a => a.id === comp)
    if (!anchor || st.roundSamples.length === 0) {
      st.roundScores.push(3)
    } else {
      // ukur: rata-rata proyeksi posisi knot ke arah anchor (unit vektor dari pusat ke anchor)
      const ax = anchor.x - st.center.x
      const ay = anchor.y - st.center.y
      const alen = Math.hypot(ax, ay) || 1
      const ux = ax / alen
      const uy = ay / alen
      // proyeksi tiap sample ke arah anchor, dinormalisasi ke 0-1 (radius max = 0.82*radius)
      const maxR = st.radius * 0.82
      const projections = st.roundSamples.map(s => {
        const proj = (s.x * ux + s.y * uy) / maxR // -1..1
        return Math.max(-1, Math.min(1, proj))
      })
      // rata-rata proyeksi (-1..1) → skor 0..5 (lean in = 5, resist = 0, tengah = 2.5)
      const avgProj = projections.reduce((s, v) => s + v, 0) / projections.length
      const score = Math.round(((avgProj + 1) / 2) * 5 * 10) / 10
      st.roundScores.push(score)
    }
    // hentikan angin
    st.windComp = null
    st.windStrength = 0

    // lanjut ke ronde berikutnya atau fase hasil
    if (idx + 1 < ROUNDS.length) {
      setTimeout(() => startRound(idx + 1), 600)
    } else {
      setTimeout(() => finishGame(), 600)
    }
  }, [startRound])

  // === Fase 3: Hasil ===
  const finishGame = useCallback(() => {
    const st = stateRef.current
    st.phase = 'result'
    st.done = true
    setPhaseUI('result')

    // hitung skor per dimensi & total
    const scores = { intimasi: [], passion: [], komitmen: [] }
    ROUNDS.forEach((r, i) => {
      scores[r.comp].push(st.roundScores[i])
    })
    const dimScores = {}
    Object.keys(scores).forEach(k => {
      const arr = scores[k]
      dimScores[k] = arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : 0
    })
    const total = Math.round(((dimScores.intimasi + dimScores.passion + dimScores.komitmen) / 3) * 10) / 10

    // posisi akhir simpul relatif pusat
    const finalPos = { x: st.knot.x - st.center.x, y: st.knot.y - st.center.y }
    const distFromCenter = Math.hypot(finalPos.x, finalPos.y)
    const maxR = st.radius * 0.82
    const distRatio = distFromCenter / maxR

    // cari komponen dominan
    let dominantComp = null
    let dominantVal = 0
    Object.entries(dimScores).forEach(([k, v]) => {
      if (v > dominantVal) { dominantVal = v; dominantComp = k }
    })

    // insight teks berdasarkan posisi akhir
    let insight
    if (distRatio < 0.25) {
      insight = {
        title: 'Cinta Seimbang 💞',
        text: 'Ketiga tali menarik kamu dengan rasa yang seimbang. Buat kamu, cinta itu perpaduan intimasi, passion, dan komitmen yang sama kuat — itulah consummate love.'
      }
    } else if (distRatio < 0.7) {
      const compLabel = COMPONENTS.find(c => c.id === dominantComp)?.label
      insight = {
        title: `${compLabel} Dominan ✨`,
        text: `Satu tali menarik lebih kuat: ${compLabel.toLowerCase()}. Buat kamu, ${compLabel.toLowerCase()} lebih menonjol dalam cinta. Nanti di level berikutnya kita bahas apa jadinya kalau satu komponen lebih kuat.`
      }
    } else {
      const compLabel = COMPONENTS.find(c => c.id === dominantComp)?.label
      insight = {
        title: `${compLabel} Sangat Dominant 🔥`,
        text: `Kamu condong banget ke ${compLabel.toLowerCase()}. Ini mengarah ke tipe cinta lain — yang bakal kita bahas di level berikutnya.`
      }
    }

    setResult({ dimScores, total, insight })
    setBurst(b => b + 1)

    // skor consummate love (0-5) → map ke format Modul A (agree/disagree) untuk kompatibilitas sistem skoring
    // threshold: total ≥ 3 = agree (cinta seimbang/positif), < 3 = disagree
    const consummateAnswer = total >= 3 ? 'agree' : 'disagree'
    const finalAnswers = { 'A1.1': consummateAnswer }

    // auto-advance via onFinal (LevelPlay akan handle celebration + auto-advance)
    setTimeout(() => onFinal(finalAnswers), 4000)
  }, [onFinal])

  // === Render UI ===
  return (
    <div className="fade-in">
      <div ref={wrapRef} className="tol-arena-wrap">
        <canvas
          ref={canvasRef}
          className="tol-canvas"
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
        />

        {/* HUD fase tutorial */}
        {phaseUI === 'tutorial' && (
          <div className="tol-hud tol-tutorial fade-in">
            <div className="tol-hud-emoji">💞</div>
            <div className="tol-hud-title">Tarik Tambang Cinta</div>
            <p className="tol-hud-text">
              Tiga tali menarik simpul di tengah: <strong style={{color:'#5b9bd5'}}>Intimasi</strong>,{' '}
              <strong style={{color:'#e87a9d'}}>Passion</strong>, dan{' '}
              <strong style={{color:'#9b82c4'}}>Komitmen</strong>.
            </p>
            <p className="tol-hud-text muted" style={{marginTop:6, fontSize:13}}>
              Pegang & gerakkan simpulnya. Rasakan tarikan tiap tali.
              Nggak ada target — bebas ke mana pun hatimu condong. 🤍
            </p>
            <button className="btn tol-skip" onClick={startRounds}>Lanjut →</button>
          </div>
        )}

        {/* HUD fase play (ronde) */}
        {phaseUI === 'play' && (
          <div className="tol-hud tol-play">
            <div className="tol-round-pill">Ronde {roundUI + 1} / 6</div>
            {showScenario && (
              <div className="tol-scenario fade-in">{scenarioUI}</div>
            )}
            {!showScenario && (
              <p className="tol-hint">Rasakan tarikannya, biarkan simpul bergerak sesuai hatimu…</p>
            )}
          </div>
        )}

        {/* HUD fase hasil */}
        {phaseUI === 'result' && result && (
          <div className="tol-hud tol-result fade-in">
            <div className="tol-result-emoji">{result.insight.title.match(/(\S+)/)?.[0] === '💞' ? '💞' : '✨'}</div>
            <div className="tol-hud-title">{result.insight.title}</div>
            <p className="tol-hud-text" style={{marginTop:6}}>{result.insight.text}</p>
            <p className="muted" style={{marginTop:10, fontSize:12}}>+25 XP</p>
            <p className="muted" style={{marginTop:4, fontSize:12}}>Lanjut ke level berikutnya…</p>
          </div>
        )}
      </div>
      <ParticleBurst trigger={burst} emojis={['💞','💜','🤍','✨']} />
    </div>
  )
}
