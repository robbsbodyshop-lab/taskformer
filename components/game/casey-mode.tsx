'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHAOS_PRESETS, type ChaosPreset } from '@/lib/data/turtle-personalities'
import { useTurtle } from '@/lib/contexts/turtle-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, StopCircle, Timer, Flame } from 'lucide-react'

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Casey Chaos Mode — Sprint challenge timer.
 * Pick a preset, start the clock, earn bonus XP for every
 * task completed during the session.
 */
export function CaseyMode() {
  const { chaosMode, chaosEndTime, chaosMultiplier, startChaosMode, stopChaosMode } = useTurtle()
  const [remaining, setRemaining] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [showPresets, setShowPresets] = useState(false)
  const [tasksAtStart, setTasksAtStart] = useState(0)
  const [tasksCompleted, setTasksCompleted] = useState(0)

  // Track completed tasks during chaos mode
  useEffect(() => {
    if (!chaosMode) return
    // Capture initial completed count
    let cancelled = false
    async function captureStart() {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (res.ok && !cancelled) {
          const data = await res.json()
          setTasksAtStart(data.dashboardData?.completedTasks ?? 0)
        }
      } catch {
        // ignore
      }
    }
    void captureStart()
    return () => { cancelled = true }
  }, [chaosMode])

  // Poll for task completions during chaos mode
  useEffect(() => {
    if (!chaosMode) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          const current = data.dashboardData?.completedTasks ?? 0
          setTasksCompleted(Math.max(0, current - tasksAtStart))
        }
      } catch {
        // ignore
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [chaosMode, tasksAtStart])

  // Countdown timer
  useEffect(() => {
    if (!chaosMode || !chaosEndTime) return
    const updateRemaining = () => {
      const r = chaosEndTime - Date.now()
      setRemaining(r)
      if (r <= 0) {
        stopChaosMode()
      }
    }
    updateRemaining()
    const interval = setInterval(updateRemaining, 1000)
    return () => clearInterval(interval)
  }, [chaosMode, chaosEndTime, stopChaosMode])

  const handleSelectPreset = useCallback(
    (preset: ChaosPreset) => {
      setTasksCompleted(0)
      setTotalDuration(preset.durationMinutes * 60 * 1000)
      startChaosMode(preset.durationMinutes, preset.xpMultiplier)
      setShowPresets(false)
    },
    [startChaosMode]
  )

  // Active Chaos Mode view
  if (chaosMode) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className="border-2 border-red-500/50 bg-red-500/5 overflow-hidden">
          {/* Pulsing header */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  className="text-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🏒
                </motion.span>
                <CardTitle className="text-sm font-bold text-red-500">
                  CHAOS MODE ACTIVE
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={stopChaosMode}
              >
                <StopCircle className="h-3.5 w-3.5 mr-1" />
                End
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Timer */}
            <div className="text-center">
              <p className="text-4xl font-mono font-bold tracking-wider">
                {formatTime(remaining)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                XP Multiplier: <span className="text-primary font-bold">{chaosMultiplier}x</span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                animate={{ width: `${totalDuration > 0 ? Math.max(2, (remaining / totalDuration) * 100) : 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Stats during chaos */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-semibold">{tasksCompleted}</span>
                <span className="text-muted-foreground">tasks smashed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Preset selection
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏒</span>
            <CardTitle className="text-sm font-medium">Casey&apos;s Chaos Mode</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => setShowPresets(!showPresets)}
          >
            <Zap className="h-3 w-3" />
            {showPresets ? 'Close' : 'Go!'}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3">
                Pick a challenge. Beat the clock. Earn bonus XP.
              </p>
              <div className="space-y-2">
                {CHAOS_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className="w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span className="text-xl">{preset.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{preset.name}</p>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Timer className="h-3 w-3" />
                        {preset.durationMinutes}m
                      </div>
                      <p className="text-[10px] text-primary font-bold">{preset.xpMultiplier}x XP</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
      {!showPresets && (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            Sprint through tasks with bonus XP. Casey-style.
          </p>
        </CardContent>
      )}
    </Card>
  )
}
