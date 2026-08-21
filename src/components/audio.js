// Audio manager untuk halaman Peta — Web Audio API (tanpa file eksternal)
// Musik ambient: nuansa spa — singing bowl pad + chime lembut (TANPA noise/static)
// Sound effect: cling lembut saat tap level

let audioCtx = null
let ambientNodes = null
let ambientPlaying = false
let isMuted = false

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function isAudioMuted() {
  return isMuted
}

export function loadMutePref() {
  try {
    isMuted = localStorage.getItem('jovely_muted') === '1'
  } catch { isMuted = false }
  return isMuted
}

export function setMuted(muted) {
  isMuted = muted
  try { localStorage.setItem('jovely_muted', muted ? '1' : '0') } catch {}
  if (ambientNodes) {
    const vol = muted ? 0 : 0.15
    ambientNodes.master.gain.setTargetAtTime(vol, getCtx().currentTime, 0.3)
  }
}

// === Musik ambient: nuansa spa — singing bowl pad + chime ===
// Tidak ada noise/static. Hanya nada lembut berkelanjutan + chime sesekali.

// Chord nada rendah (singing bowl style): C3, E3, G3, C4
const PAD_FREQS = [130.81, 164.81, 196.00, 261.63]
// Nada chime: C5, E5, G5, A5
const CHIME_NOTES = [523.25, 659.25, 783.99, 880.00]

let ambientInterval = null
let padOscs = []

export function startAmbient() {
  if (ambientPlaying) return
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = isMuted ? 0 : 0.15
  master.connect(ctx.destination)

  // --- Pad: singing bowl chord, sangat lembut, "bernafas" ---
  // Lowpass filter dengan slow sweep untuk efek gelombang
  const padFilter = ctx.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 800
  padFilter.Q.value = 1.0
  padFilter.connect(master)

  // LFO untuk slow filter sweep (efek "gelombang" lembut)
  const filterLFO = ctx.createOscillator()
  filterLFO.frequency.value = 0.04 // sangat lambat (25 detik per cycle)
  const filterLFOGain = ctx.createGain()
  filterLFOGain.gain.value = 200 // sweep 600-1000 Hz
  filterLFO.connect(filterLFOGain)
  filterLFOGain.connect(padFilter.frequency)
  filterLFO.start()

  padOscs = PAD_FREQS.map((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    // detune halus untuk efek "bowl" (sedikit beating)
    osc.detune.value = (i - 1.5) * 3

    // LFO amplitude supaya tiap nada "bernafas" beda fase
    const ampLFO = ctx.createOscillator()
    ampLFO.frequency.value = 0.05 + i * 0.015 // beda tempo tiap nada
    const ampLFOGain = ctx.createGain()
    ampLFOGain.gain.value = 0.15
    ampLFO.connect(ampLFOGain)

    const gain = ctx.createGain()
    gain.gain.value = 0.12 // tiap nada pelan
    ampLFOGain.connect(gain.gain) // modulasi gain

    osc.connect(gain)
    gain.connect(padFilter)
    osc.start()
    ampLFO.start()
    return { osc, ampLFO }
  })

  // --- Chime: lonceng lembut sesekali (singing bowl hit) ---
  const playChime = () => {
    if (!ambientPlaying || !ambientNodes) return
    const ctx2 = getCtx()
    const now = ctx2.currentTime
    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)]

    // Nada utama + harmonik (1x, 2x, 3x freq) untuk efek lonceng
    const harmonics = [
      { ratio: 1, gain: 0.12, decay: 3.0 },
      { ratio: 2, gain: 0.05, decay: 2.0 },
      { ratio: 3, gain: 0.025, decay: 1.5 },
    ]
    harmonics.forEach(h => {
      const osc = ctx2.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq * h.ratio
      const gain = ctx2.createGain()
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(h.gain, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + h.decay)
      osc.connect(gain)
      gain.connect(ambientNodes.master)
      osc.start(now)
      osc.stop(now + h.decay + 0.1)
    })
  }

  // chime setiap 6-10 detik
  ambientInterval = setInterval(() => {
    if (Math.random() < 0.5) playChime()
  }, 6000)

  ambientNodes = { master, padOscs, filterLFO }
  ambientPlaying = true
}

export function stopAmbient() {
  ambientPlaying = false
  if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null }
  if (ambientNodes) {
    try {
      ambientNodes.master.gain.setTargetAtTime(0, getCtx().currentTime, 0.5)
    } catch {}
  }
  // stop semua setelah fade
  setTimeout(() => {
    if (padOscs) {
      padOscs.forEach(({ osc, ampLFO }) => { try { osc.stop(); ampLFO.stop() } catch {} })
      padOscs = []
    }
    if (ambientNodes?.filterLFO) { try { ambientNodes.filterLFO.stop() } catch {} }
    ambientNodes = null
  }, 800)
}

// === Sound effect: "cliing" lembut saat tap level (chime kristal/spa) ===
export function playPop() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  // Chime kristal: nada tinggi C6 (1046.5 Hz) dengan harmonik inharmonic
  // Frekuensi lonceng = fundamental + harmonik yang BUKAN kelipatan bulat
  // (ini yang membuat terdengar seperti lonceng/kristal, bukan sine biasa)
  const baseFreq = 1046.50 // C6 — tinggi lembut
  const partials = [
    { ratio: 1.0,  gain: 0.14, decay: 1.2 },   // fundamental
    { ratio: 2.76, gain: 0.06, decay: 0.9 },  // inharmonic partial (lonceng)
    { ratio: 5.40, gain: 0.03, decay: 0.7 },  // inharmonic partial tinggi
    { ratio: 8.93, gain: 0.015, decay: 0.5 }, // shimmer halus
  ]

  partials.forEach(p => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = baseFreq * p.ratio

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(p.gain, now + 0.005) // attack instan tapi lembut
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay) // decay halus menghilang

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + p.decay + 0.1)
  })

  // Sedikit vibrato di nada utama untuk efek "bergetar" kristal
  const vibOsc = ctx.createOscillator()
  vibOsc.type = 'sine'
  vibOsc.frequency.value = baseFreq
  const vibLFO = ctx.createOscillator()
  vibLFO.frequency.value = 5.5 // vibrato cepat halus
  const vibDepth = ctx.createGain()
  vibDepth.gain.value = 3 // 3 Hz wobble
  vibLFO.connect(vibDepth)
  vibDepth.connect(vibOsc.frequency)
  const vibGain = ctx.createGain()
  vibGain.gain.setValueAtTime(0, now)
  vibGain.gain.linearRampToValueAtTime(0.08, now + 0.005)
  vibGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)
  vibOsc.connect(vibGain)
  vibGain.connect(ctx.destination)
  vibOsc.start(now)
  vibLFO.start(now)
  vibOsc.stop(now + 1.1)
  vibLFO.stop(now + 1.1)
}
