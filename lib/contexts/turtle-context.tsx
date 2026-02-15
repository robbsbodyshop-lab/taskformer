'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { TurtleName, TurtleRole, DialogueSet } from '@/lib/data/turtle-personalities'
import { TURTLES, DIALOGUES, randomFrom } from '@/lib/data/turtle-personalities'

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

interface TurtleState {
  /** Currently selected turtle stance, null if not yet picked */
  stance: TurtleName | null
  /** Whether the selector modal should be shown */
  showSelector: boolean
  /** Whether Casey Chaos Mode is active */
  chaosMode: boolean
  chaosEndTime: number | null  // epoch ms
  chaosMultiplier: number
}

interface TurtleContextType {
  stance: TurtleName | null
  stanceProfile: typeof TURTLES[TurtleName] | null
  dialogues: DialogueSet | null
  showSelector: boolean
  chaosMode: boolean
  chaosEndTime: number | null
  chaosMultiplier: number

  setStance: (turtle: TurtleName) => void
  openSelector: () => void
  closeSelector: () => void
  getDialogue: (key: keyof DialogueSet) => string
  startChaosMode: (durationMinutes: number, multiplier: number) => void
  stopChaosMode: () => void
  getRoleForStance: () => TurtleRole | null
}

const TurtleContext = createContext<TurtleContextType>({
  stance: null,
  stanceProfile: null,
  dialogues: null,
  showSelector: false,
  chaosMode: false,
  chaosEndTime: null,
  chaosMultiplier: 1,
  setStance: () => {},
  openSelector: () => {},
  closeSelector: () => {},
  getDialogue: () => '',
  startChaosMode: () => {},
  stopChaosMode: () => {},
  getRoleForStance: () => null,
})

// ───────────────────────────────────────────────────────────────
// Storage helpers
// ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'taskformer-turtle-stance'

function loadStance(): TurtleName | null {
  if (typeof window === 'undefined') return null
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    if (val && (val === 'leo' || val === 'donnie' || val === 'raph' || val === 'mikey')) {
      return val as TurtleName
    }
  } catch {
    // SSR or storage disabled
  }
  return null
}

function saveStance(turtle: TurtleName) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, turtle)
  } catch {
    // storage full or disabled
  }
}

// ───────────────────────────────────────────────────────────────
// Provider
// ───────────────────────────────────────────────────────────────

export function TurtleProvider({ children }: { children: ReactNode }) {
  // Lazy-initialize: read from localStorage on first render (client-side only)
  const [state, setState] = useState<TurtleState>(() => {
    const saved = loadStance()
    return {
      stance: saved,
      showSelector: false,
      chaosMode: false,
      chaosEndTime: null,
      chaosMultiplier: 1,
    }
  })

  // Show selector for first-time users after a short delay
  useEffect(() => {
    if (state.stance !== null) return
    const timer = setTimeout(() => {
      setState((s) => (s.stance === null ? { ...s, showSelector: true } : s))
    }, 1500)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-end chaos mode when time expires
  useEffect(() => {
    if (!state.chaosMode || !state.chaosEndTime) return
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, chaosMode: false, chaosEndTime: null, chaosMultiplier: 1 }))
    }, Math.max(0, state.chaosEndTime - Date.now()))
    return () => clearTimeout(timer)
  }, [state.chaosMode, state.chaosEndTime])

  const setStance = useCallback((turtle: TurtleName) => {
    saveStance(turtle)
    setState((s) => ({ ...s, stance: turtle, showSelector: false }))
  }, [])

  const openSelector = useCallback(() => {
    setState((s) => ({ ...s, showSelector: true }))
  }, [])

  const closeSelector = useCallback(() => {
    setState((s) => ({ ...s, showSelector: false }))
  }, [])

  const getDialogue = useCallback(
    (key: keyof DialogueSet): string => {
      const turtle = state.stance ?? 'mikey'
      const set = DIALOGUES[turtle]
      const value = set[key]
      if (Array.isArray(value)) return randomFrom(value)
      return value
    },
    [state.stance]
  )

  const startChaosMode = useCallback((durationMinutes: number, multiplier: number) => {
    setState((s) => ({
      ...s,
      chaosMode: true,
      chaosEndTime: Date.now() + durationMinutes * 60 * 1000,
      chaosMultiplier: multiplier,
    }))
  }, [])

  const stopChaosMode = useCallback(() => {
    setState((s) => ({
      ...s,
      chaosMode: false,
      chaosEndTime: null,
      chaosMultiplier: 1,
    }))
  }, [])

  const getRoleForStance = useCallback((): TurtleRole | null => {
    if (!state.stance) return null
    return TURTLES[state.stance].role
  }, [state.stance])

  const stanceProfile = state.stance ? TURTLES[state.stance] : null
  const dialogues = state.stance ? DIALOGUES[state.stance] : null

  return (
    <TurtleContext.Provider
      value={{
        stance: state.stance,
        stanceProfile,
        dialogues,
        showSelector: state.showSelector,
        chaosMode: state.chaosMode,
        chaosEndTime: state.chaosEndTime,
        chaosMultiplier: state.chaosMultiplier,
        setStance,
        openSelector,
        closeSelector,
        getDialogue,
        startChaosMode,
        stopChaosMode,
        getRoleForStance,
      }}
    >
      {children}
    </TurtleContext.Provider>
  )
}

export function useTurtle() {
  return useContext(TurtleContext)
}
