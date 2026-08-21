// Audio manager untuk halaman Peta — Web Audio API (tanpa file eksternal)
// Musik ambient: nuansa spa — drone rendah + air mengalir + chime lembut
// Sound effect: pop/chime pendek saat tap level

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
    const vol = muted ? 0 : 0.06
    ambientNodes.master.gain.setTargetAtTime(vol, getCtx().currentTime, 0.3)
  }
}

// === Musik ambient: nuansa spa ===
// 3 lapisan: drone rendah (continuous) + air mengalir (noise filtered) + chime pelan (random)

const DRONE_FREQS = [130.81, 196.00, 164.81] // C3, G3, E3 — chord lembut rendah
const CHIME_NOTES = [523.25, 659.25, 783.99] // C5, E5, G5 — chime sangat pelan & jarang

let ambientInterval = null
let droneOscs = []

export function startAmbient() {
  if (ambientPlaying) return
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = isMuted ? 0 : 0.06 // sangat pelan, subtle
  master.connect(ctx.destination)

  // --- Lapisan 1: Drone rendah (chord continuous, sangat lembut) ---
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.4
  const droneFilter = ctx.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = 400 // cuma nada rendah yang lewat
  droneFilter.Q.value = 0.3
  droneGain.connect(droneFilter)
  droneFilter.connect(master)

  droneOscs = DRONE_FREQS.map((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    // LFO untuk volume supaya drone "bernafas" pelan
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.06 + i * 0.02 // sangat lambat
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.15
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    const gain = ctx.createGain()
    gain.gain.value = 0.3 / DRONE_FREQS.length
    osc.connect(gain)
    gain.connect(droneGain)
    osc.start()
    lfo.start()
    return { osc, lfo }
  })

  // --- Lapisan 2: Suara air mengalir (filtered noise, sangat lembut) ---
  // Buat noise buffer pendek, loop dengan bandpass filter = suara air
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5
  }
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuf
  noiseSrc.loop = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 600 // frekuensi air mengalir
  noiseFilter.Q.value = 0.5
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.08 // sangat lembut
  noiseSrc.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)
  noiseSrc.start()

  // --- Lapisan 3: Chime pelan (random, sangat jarang) ---
  const playChime = () => {
    if (!ambientPlaying || !ambientNodes) return
    const ctx2 = getCtx()
    const now = ctx2.currentTime
    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)]

    const osc = ctx2.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const gain = ctx2.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.15, now + 2.0) // fade in sangat lambat
    gain.gain.linearRampToValueAtTime(0, now + 6.0) // fade out lambat
    osc.connect(gain)
    gain.connect(ambientNodes.master)
    osc.start(now)
    osc.stop(now + 6.5)
  }

  // chime setiap 8-12 detik (sangat jarang, tidak mengganggu)
  ambientInterval = setInterval(() => {
    if (Math.random() < 0.4) playChime()
  }, 8000)

  ambientNodes = { master, droneOscs, noiseSrc }
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
  // stop drone & noise setelah fade
  setTimeout(() => {
    if (droneOscs) {
      droneOscs.forEach(({ osc, lfo }) => { try { osc.stop(); lfo.stop() } catch {} })
      droneOscs = []
    }
    if (ambientNodes?.noiseSrc) { try { ambientNodes.noiseSrc.stop() } catch {} }
    ambientNodes = null
  }, 800)
}

// === Sound effect: pop/chime pendek saat tap level ===
export function playPop() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  // nada 1: tinggi lembut (chime)
  const osc1 = ctx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(880, now)
  osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08)

  const gain1 = ctx.createGain()
  gain1.gain.setValueAtTime(0, now)
  gain1.gain.linearRampToValueAtTime(0.25, now + 0.01)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

  osc1.connect(gain1)
  gain1.connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 0.2)

  // nada 2: rendah lembut (body)
  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(440, now)

  const gain2 = ctx.createGain()
  gain2.gain.setValueAtTime(0, now)
  gain2.gain.linearRampToValueAtTime(0.15, now + 0.01)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.start(now)
  osc2.stop(now + 0.15)
}
