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

export function useAmbientMusic() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  // load preferensi mute
  useEffect(() => {
    try { setMuted(localStorage.getItem('jovely_muted') === '1') } catch {}
  }, [])

  // setup musik latar
  useEffect(() => {
    try {
      const audio = new Audio('/music-loop.mp3')
      audio.loop = true
      audio.volume = 0.35
      audio.preload = 'auto'
      audioRef.current = audio
      audio.addEventListener('canplaythrough', () => setReady(true), { once: true })
      audio.addEventListener('error', () => setReady(false), { once: true })
      return () => { try { audio.pause(); audio.src = '' } catch {} }
    } catch { setReady(false) }
  }, [])

  // pre-load SFX (global, sekali saja)
  useEffect(() => { loadSFX(); loadPourSFX() }, [])

  // unlock audio context + mulai musik setelah interaksi pertama
  useEffect(() => {
    const onInteract = () => {
      const ctx = getAudioCtx()
      if (ctx && ctx.state === 'suspended') { try { ctx.resume() } catch {} }
      if (audioRef.current && !muted) {
        try { const p = audioRef.current.play(); if (p?.catch) p.catch(() => {}) } catch {}
      }
    }
    document.addEventListener('click', onInteract, { once: true })
    document.addEventListener('touchstart', onInteract, { once: true })
    return () => {
      document.removeEventListener('click', onInteract)
      document.removeEventListener('touchstart', onInteract)
    }
  }, [muted])

  // pause musik saat unmount
  useEffect(() => {
    return () => { if (audioRef.current) try { audioRef.current.pause() } catch {} }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      try { localStorage.setItem('jovely_muted', next ? '1' : '0') } catch {}
      if (audioRef.current) {
        try {
          if (next) { audioRef.current.pause() }
          else { const p = audioRef.current.play(); if (p?.catch) p.catch(() => {}) }
        } catch {}
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

  return { muted, toggleMute, ready, playTap, startPour, stopPour }
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
