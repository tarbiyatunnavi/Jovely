import { useState, useEffect, useRef, useCallback } from 'react'

// Audio context GLOBAL — dibuat sekali, tidak pernah di-close
let _ctx = null
let _sfxBuffer = null
let _sfxLoading = false
let _sfxReady = false

// Pour SFX buffer
let _pourBuffer = null
let _pourLoading = false
let _pourReady = false

// Active pour source (untuk stop)
let _pourSource = null
let _pourGain = null

// Swipe SFX buffer
let _swipeBuffer = null
let _swipeLoading = false
let _swipeReady = false

// Bubble SFX buffer (quick-tap pop)
let _bubbleBuffer = null
let _bubbleLoading = false
let _bubbleReady = false

function getAudioCtx() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)() } catch {}
  }
  return _ctx
}

async function loadSFX() {
  if (_sfxReady || _sfxLoading) return
  _sfxLoading = true
  try {
    const ctx = getAudioCtx()
    if (!ctx) return
    const res = await fetch('/tap-sfx.mp3')
    const arrayBuf = await res.arrayBuffer()
    _sfxBuffer = await ctx.decodeAudioData(arrayBuf)
    _sfxReady = true
  } catch {
    // fail-safe
  } finally {
    _sfxLoading = false
  }
}

async function loadPourSFX() {
  if (_pourReady || _pourLoading) return
  _pourLoading = true
  try {
    const ctx = getAudioCtx()
    if (!ctx) return
    const res = await fetch('/pour-sfx.mp3')
    const arrayBuf = await res.arrayBuffer()
    _pourBuffer = await ctx.decodeAudioData(arrayBuf)
    _pourReady = true
  } catch {
    // fail-safe
  } finally {
    _pourLoading = false
  }
}

async function loadSwipeSFX() {
  if (_swipeReady || _swipeLoading) return
  _swipeLoading = true
  try {
    const ctx = getAudioCtx()
    if (!ctx) return
    const res = await fetch('/swipe-sfx.mp3')
    const arrayBuf = await res.arrayBuffer()
    _swipeBuffer = await ctx.decodeAudioData(arrayBuf)
    _swipeReady = true
  } catch {
    // fail-safe
  } finally {
    _swipeLoading = false
  }
}

async function loadBubbleSFX() {
  if (_bubbleReady || _bubbleLoading) return
  _bubbleLoading = true
  try {
    const ctx = getAudioCtx()
    if (!ctx) return
    const res = await fetch('/bubble-sfx.mp3')
    const arrayBuf = await res.arrayBuffer()
    _bubbleBuffer = await ctx.decodeAudioData(arrayBuf)
    _bubbleReady = true
  } catch {
    // fail-safe
  } finally {
    _bubbleLoading = false
  }
}

// === Global music manager (Peta & Level) ===
// Dua file: music-loop.mp3 (Peta) & level-music.mp3 (Level)
// Transisi: fade out satu, fade in yang lain

let _mapAudio = null
let _levelAudio = null
let _mapMusicLoaded = false
let _levelMusicLoaded = false

function initMusic() {
  if (!_mapAudio) {
    try {
      _mapAudio = new Audio('/music-loop.mp3')
      _mapAudio.loop = true
      _mapAudio.volume = 0
      _mapAudio.preload = 'auto'
      _mapAudio.addEventListener('canplaythrough', () => { _mapMusicLoaded = true }, { once: true })
    } catch {}
  }
  if (!_levelAudio) {
    try {
      _levelAudio = new Audio('/level-music.mp3')
      _levelAudio.loop = true
      _levelAudio.volume = 0
      _levelAudio.preload = 'auto'
      _levelAudio.addEventListener('canplaythrough', () => { _levelMusicLoaded = true }, { once: true })
    } catch {}
  }
}

function isMusicMuted() {
  try { return localStorage.getItem('jovely_muted') === '1' } catch { return false }
}

function fadeTo(audio, targetVol, duration = 0.5) {
  try {
    const ctx = getAudioCtx()
    if (ctx && ctx.state !== 'closed') {
      audio.volume = targetVol // simple fade via volume (HTML5 audio)
    }
  } catch {}
}

export function playMapMusic() {
  try {
    initMusic()
    if (!_mapAudio || isMusicMuted()) return
    // stop level music
    if (_levelAudio) { try { _levelAudio.pause() } catch {} }
    // play map music
    if (_mapAudio.paused) {
      const p = _mapAudio.play()
      if (p?.catch) p.catch(() => {})
    }
    _mapAudio.volume = 0.35
  } catch {}
}

export function playLevelMusic() {
  try {
    initMusic()
    if (!_levelAudio || isMusicMuted()) return
    // stop map music
    if (_mapAudio) { try { _mapAudio.pause() } catch {} }
    // play level music
    if (_levelAudio.paused) {
      const p = _levelAudio.play()
      if (p?.catch) p.catch(() => {})
    }
    _levelAudio.volume = 0.3 // sedikit lebih pelan dari map (0.35)
  } catch {}
}

export function pauseAllMusic() {
  try {
    if (_mapAudio) { try { _mapAudio.pause() } catch {} }
    if (_levelAudio) { try { _levelAudio.pause() } catch {} }
  } catch {}
}

export function setMusicMuted(muted) {
  try { localStorage.setItem('jovely_muted', muted ? '1' : '0') } catch {}
  if (muted) {
    pauseAllMusic()
  } else {
    // resume music yang aktif (cek dari URL/location)
    // dipanggil dari toggleMute di hook
  }
}

export function useAmbientMusic() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  // load preferensi mute
  useEffect(() => {
    try { setMuted(localStorage.getItem('jovely_muted') === '1') } catch {}
  }, [])

  // init global music + pre-load SFX
  useEffect(() => {
    initMusic()
    loadSFX()
    loadPourSFX()
    loadSwipeSFX()
    loadBubbleSFX()
  }, [])

  // mulai musik Peta setelah interaksi pertama
  useEffect(() => {
    const onInteract = () => {
      const ctx = getAudioCtx()
      if (ctx && ctx.state === 'suspended') { try { ctx.resume() } catch {} }
      playMapMusic()
    }
    document.addEventListener('click', onInteract, { once: true })
    document.addEventListener('touchstart', onInteract, { once: true })
    return () => {
      document.removeEventListener('click', onInteract)
      document.removeEventListener('touchstart', onInteract)
    }
  }, [])

  // pause musik saat unmount (dari Peta)
  useEffect(() => {
    return () => { try { pauseAllMusic() } catch {} }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      try { localStorage.setItem('jovely_muted', next ? '1' : '0') } catch {}
      if (next) {
        pauseAllMusic()
      } else {
        // resume — cek lokasi untuk tentukan musik mana
        if (window.location.pathname.includes('/level/')) {
          playLevelMusic()
        } else {
          playMapMusic()
        }
      }
      return next
    })
  }, [])

  // playTap: instant, no conflict, fail-safe
  const playTap = useCallback(() => {
    try {
      const ctx = getAudioCtx()
      if (!ctx || !_sfxReady || !_sfxBuffer) return
      if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
      if (ctx.state === 'closed') return

      const source = ctx.createBufferSource()
      source.buffer = _sfxBuffer
      const gain = ctx.createGain()
      gain.gain.value = 0.25
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start(0)
    } catch {}
  }, [])

  // startPour: mulai suara tuang (loop), stop dengan stopPour
  const startPour = useCallback(() => {
    try {
      const ctx = getAudioCtx()
      if (!ctx || !_pourReady || !_pourBuffer) return
      if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
      if (ctx.state === 'closed') return

      // stop pour sebelumnya kalau ada (jangan overlap)
      stopPour()

      const source = ctx.createBufferSource()
      source.buffer = _pourBuffer
      source.loop = true // loop selama tuang
      const gain = ctx.createGain()
      gain.gain.value = 0.2 // lebih pelan dari tap (0.25) & musik (0.35)
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start(0)
      _pourSource = source
      _pourGain = gain
    } catch {}
  }, [])

  // stopPour: hentikan suara tuang dengan fade halus
  const stopPour = useCallback(() => {
    try {
      if (_pourSource && _pourGain) {
        const ctx = getAudioCtx()
        if (ctx && ctx.state !== 'closed') {
          // fade out cepat (50ms) supaya tidak pop/click
          _pourGain.gain.setTargetAtTime(0, ctx.currentTime, 0.025)
          _pourSource.stop(ctx.currentTime + 0.1)
        }
      }
    } catch {}
    _pourSource = null
    _pourGain = null
  }, [])

  return { muted, toggleMute, ready, playTap, startPour, stopPour, playMapMusic, playLevelMusic }
}

// Export fungsi global untuk dipanggil dari komponen lain (PourLoveGame dll)
export function playTapSFX() {
  try {
    const ctx = getAudioCtx()
    if (!ctx || !_sfxReady || !_sfxBuffer) return
    if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
    if (ctx.state === 'closed') return
    const source = ctx.createBufferSource()
    source.buffer = _sfxBuffer
    const gain = ctx.createGain()
    gain.gain.value = 0.25
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
  } catch {}
}

export function startPourSFX() {
  try {
    const ctx = getAudioCtx()
    if (!ctx || !_pourReady || !_pourBuffer) return
    if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
    if (ctx.state === 'closed') return
    stopPourSFX()
    const source = ctx.createBufferSource()
    source.buffer = _pourBuffer
    source.loop = true
    const gain = ctx.createGain()
    gain.gain.value = 0.2
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
    _pourSource = source
    _pourGain = gain
  } catch {}
}

export function stopPourSFX() {
  try {
    if (_pourSource && _pourGain) {
      const ctx = getAudioCtx()
      if (ctx && ctx.state !== 'closed') {
        _pourGain.gain.setTargetAtTime(0, ctx.currentTime, 0.025)
        _pourSource.stop(ctx.currentTime + 0.1)
      }
    }
  } catch {}
  _pourSource = null
  _pourGain = null
}

// Swipe SFX: diputar saat mulai drag kartu (instant, no conflict)
export function playSwipeSFX() {
  try {
    const ctx = getAudioCtx()
    if (!ctx || !_swipeReady || !_swipeBuffer) return
    if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
    if (ctx.state === 'closed') return
    const source = ctx.createBufferSource()
    source.buffer = _swipeBuffer
    const gain = ctx.createGain()
    gain.gain.value = 0.2 // seimbang dengan tap (0.25) & pour (0.2)
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
  } catch {}
}

// Bubble SFX: diputar saat tap bubble Benar/Salah (instant, no conflict)
export function playBubbleSFX() {
  try {
    const ctx = getAudioCtx()
    if (!ctx || !_bubbleReady || !_bubbleBuffer) return
    if (ctx.state === 'suspended') { try { ctx.resume() } catch {} }
    if (ctx.state === 'closed') return
    const source = ctx.createBufferSource()
    source.buffer = _bubbleBuffer
    const gain = ctx.createGain()
    gain.gain.value = 0.2
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
  } catch {}
}
