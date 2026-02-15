'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, Play, Pause, RotateCcw, SkipForward, Coffee, Brain } from 'lucide-react'
import { toast } from 'sonner'
import { useTurtle } from '@/lib/contexts/turtle-context'

// ─── Configuration ───────────────────────────────────────────
const WORK_MINUTES = 25
const SHORT_BREAK_MINUTES = 5
const LONG_BREAK_MINUTES = 15
const SESSIONS_BEFORE_LONG_BREAK = 4

const STORAGE_KEY = 'taskformer-pomodoro'

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroState {
  /** Timestamp (epoch ms) when the current segment started counting */
  startedAt: number | null
  /** Total duration for the current segment in ms */
  duration: number
  /** Time already elapsed before the last pause (ms) */
  elapsed: number
  /** Whether the timer is actively running */
  running: boolean
  /** Current mode */
  mode: PomodoroMode
  /** Number of completed work sessions in this cycle */
  sessionsCompleted: number
}

// ─── Helpers ─────────────────────────────────────────────────

function minutesToMs(m: number) {
  return m * 60 * 1000
}

function durationForMode(mode: PomodoroMode): number {
  switch (mode) {
    case 'work':
      return minutesToMs(WORK_MINUTES)
    case 'shortBreak':
      return minutesToMs(SHORT_BREAK_MINUTES)
    case 'longBreak':
      return minutesToMs(LONG_BREAK_MINUTES)
  }
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function defaultState(): PomodoroState {
  return {
    startedAt: null,
    duration: durationForMode('work'),
    elapsed: 0,
    running: false,
    mode: 'work',
    sessionsCompleted: 0,
  }
}

function loadState(): PomodoroState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as PomodoroState
    // Validate the shape
    if (typeof parsed.duration !== 'number' || typeof parsed.mode !== 'string') {
      return defaultState()
    }
    return parsed
  } catch {
    return defaultState()
  }
}

function saveState(state: PomodoroState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

function requestNotificationPermission() {
  if (typeof window === 'undefined') return
  if ('Notification' in window && Notification.permission === 'default') {
    void Notification.requestPermission()
  }
}

function sendNotification(title: string, body: string) {
  if (typeof window === 'undefined') return
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.ico' })
    } catch {
      // Notification API not available (e.g., iOS Safari)
    }
  }
}

// ─── Component ───────────────────────────────────────────────

export function PomodoroTimer() {
  const [state, setState] = useState<PomodoroState>(loadState)
  const [remaining, setRemaining] = useState<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { getDialogue, stance } = useTurtle()

  // Calculate remaining time from timestamp (survives screen-lock / tab-switch)
  const calcRemaining = useCallback(
    (s: PomodoroState): number => {
      if (!s.running || s.startedAt === null) {
        return s.duration - s.elapsed
      }
      const now = Date.now()
      const totalElapsed = s.elapsed + (now - s.startedAt)
      return Math.max(0, s.duration - totalElapsed)
    },
    []
  )

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveState(state)
  }, [state])

  // Handle timer completion
  const handleComplete = useCallback(() => {
    setState((prev) => {
      const isWork = prev.mode === 'work'
      const newSessions = isWork ? prev.sessionsCompleted + 1 : prev.sessionsCompleted

      let nextMode: PomodoroMode
      if (isWork) {
        nextMode = newSessions % SESSIONS_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak'
      } else {
        nextMode = 'work'
      }

      const nextDuration = durationForMode(nextMode)

      // Notify the user
      if (isWork) {
        const msg = `Session ${newSessions} done! Time for a ${nextMode === 'longBreak' ? 'long' : 'short'} break.`
        toast.success(msg)
        sendNotification('Pomodoro Complete!', msg)
      } else {
        const msg = 'Break over. Time to focus!'
        toast.info(msg)
        sendNotification('Break Over', msg)
      }

      return {
        startedAt: null,
        duration: nextDuration,
        elapsed: 0,
        running: false,
        mode: nextMode,
        sessionsCompleted: newSessions,
      }
    })
  }, [])

  // Main tick loop — recalculates from timestamps every 250ms
  useEffect(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }

    // Always calculate once immediately
    const r = calcRemaining(state)
    setRemaining(r)

    if (!state.running) return

    // Check if already completed (e.g., phone was locked past the end)
    if (r <= 0) {
      handleComplete()
      return
    }

    tickRef.current = setInterval(() => {
      const rem = calcRemaining(state)
      setRemaining(rem)
      if (rem <= 0) {
        handleComplete()
      }
    }, 250)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [state, calcRemaining, handleComplete])

  // Recalculate when tab becomes visible again (screen unlock / tab switch)
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        const r = calcRemaining(state)
        setRemaining(r)
        if (state.running && r <= 0) {
          handleComplete()
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [state, calcRemaining, handleComplete])

  // Ask for notification permission on first interaction
  const ensureNotifications = useCallback(() => {
    requestNotificationPermission()
  }, [])

  // ─── Actions ─────────────────────────────────────────────

  const handleStart = () => {
    ensureNotifications()
    setState((prev) => ({
      ...prev,
      startedAt: Date.now(),
      running: true,
    }))
  }

  const handlePause = () => {
    setState((prev) => {
      if (!prev.running || prev.startedAt === null) return prev
      const now = Date.now()
      return {
        ...prev,
        elapsed: prev.elapsed + (now - prev.startedAt),
        startedAt: null,
        running: false,
      }
    })
  }

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      startedAt: null,
      elapsed: 0,
      running: false,
      duration: durationForMode(prev.mode),
    }))
  }

  const handleSkip = () => {
    // Skip to the next phase
    setState((prev) => {
      const isWork = prev.mode === 'work'
      const newSessions = isWork ? prev.sessionsCompleted + 1 : prev.sessionsCompleted
      let nextMode: PomodoroMode
      if (isWork) {
        nextMode = newSessions % SESSIONS_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak'
      } else {
        nextMode = 'work'
      }
      return {
        startedAt: null,
        duration: durationForMode(nextMode),
        elapsed: 0,
        running: false,
        mode: nextMode,
        sessionsCompleted: newSessions,
      }
    })
  }

  // ─── Derived values ──────────────────────────────────────

  const progress = Math.max(0, Math.min(100, ((state.duration - remaining) / state.duration) * 100))

  const modeLabel =
    state.mode === 'work'
      ? 'Focus Time'
      : state.mode === 'shortBreak'
        ? 'Short Break'
        : 'Long Break'

  const ModeIcon = state.mode === 'work' ? Brain : Coffee

  // Turtle-themed colors for the progress ring
  const stanceColors: Record<string, string> = {
    leo: '#4169E1',
    donnie: '#9370DB',
    raph: '#DC143C',
    mikey: '#FF6B35',
  }
  const accentColor = stance ? stanceColors[stance] ?? '#00A651' : '#00A651'

  // SVG ring dimensions
  const SIZE = 140
  const STROKE = 6
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Pomodoro</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ModeIcon className="h-3.5 w-3.5" />
            <span>{modeLabel}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pt-0">
        {/* Circular progress ring with time */}
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            className="rotate-[-90deg]"
          >
            {/* Background ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-muted/30"
            />
            {/* Progress ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={accentColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          {/* Time display centered on ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums tracking-tight">
              {formatTime(remaining)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Session {state.sessionsCompleted + (state.mode === 'work' ? 1 : 0)}/{SESSIONS_BEFORE_LONG_BREAK}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {state.running ? (
            <Button
              size="sm"
              className="h-9 px-5 font-semibold text-white min-h-[44px]"
              style={{ backgroundColor: accentColor }}
              onClick={handlePause}
            >
              <Pause className="h-4 w-4 mr-1.5" />
              Pause
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9 px-5 font-semibold text-white min-h-[44px]"
              style={{ backgroundColor: accentColor }}
              onClick={handleStart}
            >
              <Play className="h-4 w-4 mr-1.5" />
              {state.elapsed > 0 ? 'Resume' : 'Start'}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleSkip}
            title="Skip to next phase"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Session dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }).map((_, i) => {
            const completed = i < state.sessionsCompleted
            return (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${completed ? '' : 'bg-muted'}`}
                style={completed ? { backgroundColor: accentColor } : undefined}
              />
            )
          })}
          <span className="text-[10px] text-muted-foreground ml-1">
            {state.sessionsCompleted} done
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
