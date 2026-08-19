import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { ALL_LEVELS, getLevelXP } from '../data/levels'

const ProgressContext = createContext(null)
const LS_KEY = 'jovely_progress'

// load initial: merge dari localStorage
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

export function ProgressProvider({ children }) {
  const { isAuthed, authedFetch, token } = useAuth()
  const [progress, setProgress] = useState(loadLocal)
  const [loaded, setLoaded] = useState(false)

  // sinkronisasi progress dari server saat login
  const loadFromServer = useCallback(async () => {
    if (!isAuthed) { setLoaded(true); return }
    try {
      const data = await authedFetch('/progress')
      if (data.ok) {
        const merged = {}
        for (const lvl of ALL_LEVELS) {
          const p = data.progress?.[lvl.id]
          if (p) {
            merged[lvl.id] = {
              status: p.status,
              answers: p.answers || {},
              xp: p.xp || getLevelXP(lvl.id)
            }
          }
        }
        setProgress(merged)
      }
    } catch {}
    setLoaded(true)
  }, [isAuthed, authedFetch])

  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])

  // persist ke localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(progress))
  }, [progress])

  const getLevelProgress = useCallback((levelId) => {
    return progress[levelId] || null
  }, [progress])

  const isLevelUnlocked = useCallback((levelId) => {
    const idx = ALL_LEVELS.findIndex(l => l.id === levelId)
    if (idx === 0) return true
    const prev = ALL_LEVELS[idx - 1]
    return (progress[prev.id]?.status === 'completed')
  }, [progress])

  const saveLevel = useCallback(async (levelId, answers, status = 'in_progress') => {
    const xp = status === 'completed' ? getLevelXP(levelId) : (progress[levelId]?.xp || 0)
    setProgress(prev => ({
      ...prev,
      [levelId]: { status, answers, xp }
    }))
    if (isAuthed) {
      await authedFetch('/progress', {
        method: 'POST',
        body: JSON.stringify({ levelId, status, answers, xp })
      })
    }
  }, [progress, isAuthed, authedFetch])

  const completedCount = useCallback(() => {
    return ALL_LEVELS.filter(l => progress[l.id]?.status === 'completed').length
  }, [progress])

  const totalXP = useCallback(() => {
    return ALL_LEVELS.reduce((sum, l) => sum + (progress[l.id]?.status === 'completed' ? getLevelXP(l.id) : 0), 0)
  }, [progress])

  const resetAll = useCallback(async () => {
    setProgress({})
    localStorage.removeItem(LS_KEY)
    // hapus progress di server juga supaya tidak balik saat loadFromServer
    if (isAuthed) {
      try {
        await authedFetch('/progress/reset', { method: 'POST' })
      } catch {}
    }
  }, [isAuthed, authedFetch])

  return (
    <ProgressContext.Provider value={{
      progress, loaded,
      getLevelProgress, isLevelUnlocked, saveLevel,
      completedCount, totalXP, resetAll, loadFromServer
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress harus di dalam ProgressProvider')
  return ctx
}
