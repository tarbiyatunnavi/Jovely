// Audio manager untuk halaman Peta — Web Audio API (tanpa file eksternal)
// Musik ambient: nada-nada lembut loop, volume pelan
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
    ambientNodes.master.gain.targetValue = muted ? 0 : 0.12
    ambientNodes.master.gain.setTargetAtTime(muted ? 0 : 0.12, getCtx().currentTime, 0.3)
  }
}

// === Musik ambient: loop nada-nada calming ===
// Pakai oscillator + filter lembut, tempo lambat
const AMBIENT_NOTES = [
  261.63, // C4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
]

let ambientInterval = null

export function startAmbient() {
  if (ambientPlaying) return
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = isMuted ? 0 : 0.12
  master.connect(ctx.destination)

  // filter lembut supaya terdengar calming
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.5
  filter.connect(master)

  ambientNodes = { master, filter }
  ambientPlaying = true

  let noteIdx = 0
  const playNote = () => {
    if (!ambientPlaying || !ambientNodes) return
    const now = ctx.currentTime
    const freq = AMBIENT_NOTES[noteIdx % AMBIENT_NOTES.length]
    noteIdx++

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 1.5)
    gain.gain.linearRampToValueAtTime(0, now + 4.0)

    osc.connect(gain)
    gain.connect(ambientNodes.filter)
    osc.start(now)
    osc.stop(now + 4.5)
  }

  // mainkan nada pertama, lalu loop setiap 3 detik
  playNote()
  ambientInterval = setInterval(playNote, 3000)
}

export function stopAmbient() {
  ambientPlaying = false
  if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null }
  if (ambientNodes) {
    try {
      ambientNodes.master.gain.setTargetAtTime(0, getCtx().currentTime, 0.3)
    } catch {}
  }
  // bersihkan setelah fade
  setTimeout(() => { ambientNodes = null }, 500)
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
