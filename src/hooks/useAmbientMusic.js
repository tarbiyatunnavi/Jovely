import { useState, useEffect, useRef, useCallback } from 'react'

// Audio context GLOBAL — dibuat sekali, tidak pernah di-close
// (close bikin error kalau playTap dipanggil setelah unmount/remount)
let _ctx = null
let _sfxBuffer = null
let _sfxLoading = false
let _sfxReady = false

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
  useEffect(() => { loadSFX() }, [])

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
  // Tiap tap buat BufferSource baru — tidak bisa konflik
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

  return { muted, toggleMute, ready, playTap }
}
