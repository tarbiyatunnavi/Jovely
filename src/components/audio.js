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
    const vol = muted ? 0 : 0.14
    ambientNodes.master.gain.setTargetAtTime(vol, getCtx().currentTime, 0.3)
  }
}

// === Musik ambient: nuansa cinematic wonderous (orkestra lembut) ===
// String pad chord progression + arpeggio berputar + reverb halus
// Mood: megah tapi lembut, penuh keajaiban (seperti film score)

// Chord progression: Am - F - C - G (classic cinematic, 4 chord @ 4 detik each)
const CHORDS = [
  [220.00, 261.63, 329.63],  // Am: A3, C4, E4
  [174.61, 220.00, 261.63],  // F:  F3, A3, C4
  [130.81, 164.81, 196.00],  // C:  C3, E3, G3
  [196.00, 246.94, 293.66],  // G:  G3, B3, D4
]
// Arpeggio notes (higher octave, lembut)
const ARP_NOTES = [659.25, 783.99, 987.77, 1318.51] // E5, G5, B5, E6

let chordIdx = 0
let padOscs = []

export function startAmbient() {
  if (ambientPlaying) return
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = isMuted ? 0 : 0.14
  master.connect(ctx.destination)

  // Reverb sederhana: convolver dengan generated impulse
  const reverb = ctx.createConvolver()
  const impulseLen = ctx.sampleRate * 2.5
  const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < impulseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.5)
    }
  }
  reverb.buffer = impulse
  const reverbGain = ctx.createGain()
  reverbGain.gain.value = 0.35
  reverb.connect(reverbGain)
  reverbGain.connect(master)

  // --- String pad: chord progression (sawtooth + lowpass = string ensemble) ---
  const padFilter = ctx.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 1200
  padFilter.Q.value = 0.5
  padFilter.connect(master)
  padFilter.connect(reverb) // kirim ke reverb juga

  const playChord = () => {
    if (!ambientPlaying || !ambientNodes) return
    const chord = CHORDS[chordIdx % CHORDS.length]
    chordIdx++
    const now = ctx.currentTime

    // stop pad sebelumnya (fade out cepat)
    padOscs.forEach(({ osc, gain }) => {
      gain.gain.setTargetAtTime(0, now, 0.3)
      setTimeout(() => { try { osc.stop() } catch {} }, 600)
    })
    padOscs = []

    // mainkan chord baru (3 nada, sawtooth = string sound)
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.detune.value = (i - 1) * 4 // slight detune = ensemble

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 1.5) // fade in lambat
      gain.gain.setValueAtTime(0.06, now + 3.0) // hold
      gain.gain.linearRampToValueAtTime(0, now + 4.2) // fade out

      osc.connect(gain)
      gain.connect(padFilter)
      osc.start(now)
      osc.stop(now + 4.5)
      padOscs.push({ osc, gain })
    })
  }

  // --- Arpeggio: nada tinggi berputar lembut (kesan "wonderous") ---
  let arpIdx = 0
  const playArp = () => {
    if (!ambientPlaying || !ambientNodes) return
    const ctx2 = getCtx()
    const now = ctx2.currentTime
    const freq = ARP_NOTES[arpIdx % ARP_NOTES.length]
    arpIdx++

    const osc = ctx2.createOscillator()
    osc.type = 'triangle' // triangle = lembut, bell-like
    osc.frequency.value = freq

    const gain = ctx2.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05) // attack cepat
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5) // decay panjang

    osc.connect(gain)
    gain.connect(ambientNodes.reverb) // arpeggio lewat reverb = gema menghanyutkan
    osc.start(now)
    osc.stop(now + 1.6)
  }

  // mulai chord pertama
  playChord()
  // chord progression setiap 4 detik
  ambientInterval = setInterval(playChord, 4000)
  // arpeggio setiap 1 detik (nada bergantian)
  arpInterval = setInterval(playArp, 1000)

  ambientNodes = { master, padFilter, reverb, padOscs }
  ambientPlaying = true
}

let arpInterval = null

export function stopAmbient() {
  ambientPlaying = false
  if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null }
  if (arpInterval) { clearInterval(arpInterval); arpInterval = null }
  if (ambientNodes) {
    try {
      ambientNodes.master.gain.setTargetAtTime(0, getCtx().currentTime, 0.5)
    } catch {}
  }
  // stop semua setelah fade
  setTimeout(() => {
    if (padOscs) {
      padOscs.forEach(({ osc }) => { try { osc.stop() } catch {} })
      padOscs = []
    }
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
