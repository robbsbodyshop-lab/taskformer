'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPLINTER_GUIDANCE, type SplinterTip } from '@/lib/data/turtle-personalities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface GuidanceState {
  overdueTasks: number
  totalTasks: number
  totalHabits: number
  categories: number
  bestStreak: number
  completedToday: number
  roleCounts: Record<string, number>
}

function pickGuidance(state: GuidanceState): SplinterTip {
  // Check conditions in priority order
  if (state.totalTasks === 0 && state.totalHabits === 0) {
    return SPLINTER_GUIDANCE.find((g) => g.condition === 'first_day')!
  }

  if (state.overdueTasks >= 3) {
    return SPLINTER_GUIDANCE.find((g) => g.condition === 'many_overdue')!
  }

  if (state.totalHabits === 0) {
    return SPLINTER_GUIDANCE.find((g) => g.condition === 'no_habits')!
  }

  if (state.categories === 0) {
    return SPLINTER_GUIDANCE.find((g) => g.condition === 'no_categories')!
  }

  // Check role imbalance
  const roles = Object.entries(state.roleCounts)
  const totalRoled = roles.reduce((s, [, c]) => s + c, 0)
  if (totalRoled >= 4) {
    const maxRole = roles.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
    const ratio = maxRole[1] / totalRoled
    if (ratio > 0.7) {
      if (maxRole[0] === 'EXECUTION') {
        return SPLINTER_GUIDANCE.find((g) => g.condition === 'all_raph_tasks')!
      }
      if (maxRole[0] === 'LEADERSHIP') {
        return SPLINTER_GUIDANCE.find((g) => g.condition === 'all_leo_tasks')!
      }
    }
    // Check if balanced
    const minRole = roles.reduce((min, curr) => (curr[1] < min[1] ? curr : min))
    if (minRole[1] >= Math.floor(totalRoled / 6)) {
      return SPLINTER_GUIDANCE.find((g) => g.condition === 'balanced_roles')!
    }
  }

  if (state.completedToday >= 5) {
    return SPLINTER_GUIDANCE.find((g) => g.condition === 'high_completion')!
  }

  // Default wisdom
  return SPLINTER_GUIDANCE.find((g) => g.condition === 'default')!
}

export function SplinterGuidance() {
  const [tip, setTip] = useState<SplinterTip | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // Fetch dashboard data to analyze current state
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()

        // Fetch tasks for role analysis
        const tasksRes = await fetch('/api/tasks', { cache: 'no-store' })
        const tasks: { turtleRole?: string | null; completed?: boolean; dueDate?: string }[] =
          tasksRes.ok ? await tasksRes.json() : []

        const roleCounts: Record<string, number> = {
          LEADERSHIP: 0, RESEARCH: 0, EXECUTION: 0, CREATIVE: 0,
        }
        let overdueTasks = 0
        const now = new Date()
        for (const task of tasks) {
          if (task.turtleRole && task.turtleRole in roleCounts) {
            roleCounts[task.turtleRole]++
          }
          if (task.dueDate && !task.completed && new Date(task.dueDate) < now) {
            overdueTasks++
          }
        }

        const state: GuidanceState = {
          overdueTasks,
          totalTasks: data.dashboardData?.activeTasks ?? 0,
          totalHabits: data.dashboardData?.totalHabits ?? 0,
          categories: data.dashboardData?.categories ?? 0,
          bestStreak: data.dashboardData?.bestStreak ?? 0,
          completedToday: data.tasksToday ?? 0,
          roleCounts,
        }

        setTip(pickGuidance(state))
      } catch {
        setTip(SPLINTER_GUIDANCE.find((g) => g.condition === 'default')!)
      }
    }
    void load()
  }, [])

  if (!tip || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🐀</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 mb-1">
                  Master Splinter says:
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  &ldquo;{tip.message}&rdquo;
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 text-muted-foreground hover:text-foreground"
                onClick={() => setDismissed(true)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
