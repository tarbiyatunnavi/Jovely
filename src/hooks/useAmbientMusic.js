import { useState, useEffect, useRef, useCallback } from 'react'

// Hook untuk musik latar — pakai HTML5 audio element (bukan Web Audio API)
// Fail-safe: kalau audio gagal load/play, app tetap jalan tanpa musik
export function useAmbientMusic() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  // load preferensi mute dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jovely_muted')
      setMuted(stored === '1')
    } catch {
      setMuted(false)
    }
  }, [])

  // setup audio element
  useEffect(() => {
    try {
      const audio = new Audio('/music-loop.mp3')
      audio.loop = true
      audio.volume = 0.35
      audio.preload = 'auto'
      audioRef.current = audio

      audio.addEventListener('canplaythrough', () => setReady(true), { once: true })
      audio.addEventListener('error', () => { setReady(false) }, { once: true })

      return () => {
        try { audio.pause(); audio.src = '' } catch {}
        audioRef.current = null
      }
    } catch {
      // fail-safe: kalau Audio() gagal, app tetap jalan
      setReady(false)
    }
  }, [])

  // mulai musik setelah interaksi pertama (autoplay policy)
  const tryStart = useCallback(() => {
    if (!audioRef.current || muted) return
    try {
      const p = audioRef.current.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {}) // autoplay blocked = silently ignore, no crash
      }
    } catch {
      // fail-safe
    }
  }, [muted])

  // listen untuk interaksi pertama
  useEffect(() => {
    const onInteract = () => tryStart()
    document.addEventListener('click', onInteract, { once: true })
    document.addEventListener('touchstart', onInteract, { once: true })
    return () => {
      document.removeEventListener('click', onInteract)
      document.removeEventListener('touchstart', onInteract)
    }
  }, [tryStart])

  // stop musik saat unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try { audioRef.current.pause() } catch {}
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      try { localStorage.setItem('jovely_muted', next ? '1' : '0') } catch {}
      if (audioRef.current) {
        try {
          if (next) {
            audioRef.current.pause()
          } else {
            const p = audioRef.current.play()
            if (p && typeof p.catch === 'function') p.catch(() => {})
          }
        } catch {}
      }
      return next
    })
  }, [])

  return { muted, toggleMute, ready }
}
