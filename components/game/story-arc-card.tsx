'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getCurrentStoryArc, type StoryArc, type StoryGoal } from '@/lib/data/turtle-personalities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scroll, CheckCircle2 } from 'lucide-react'

interface GoalProgress {
  goal: StoryGoal
  current: number
  complete: boolean
}

/**
 * Story Arc Seasons — Weekly narrative missions that rotate
 * based on week-of-year. Each arc has themed goals.
 */
export function StoryArcCard() {
  const [arc] = useState<StoryArc>(getCurrentStoryArc)
  const [progress, setProgress] = useState<GoalProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProgress() {
      try {
        const dashRes = await fetch('/api/dashboard', { cache: 'no-store' })
        const tasksRes = await fetch('/api/tasks', { cache: 'no-store' })
        const habitsRes = await fetch('/api/habits', { cache: 'no-store' })

        const dashData = dashRes.ok ? await dashRes.json() : {}
        const tasks: { turtleRole?: string | null; completed?: boolean }[] =
          tasksRes.ok ? await tasksRes.json() : []
        const habits: { completions?: { date: string }[] }[] =
          habitsRes.ok ? await habitsRes.json() : []

        const completedTasks = tasks.filter((t) => t.completed).length
        const completedByRole: Record<string, number> = {}
        for (const task of tasks) {
          if (task.completed && task.turtleRole) {
            completedByRole[task.turtleRole] = (completedByRole[task.turtleRole] || 0) + 1
          }
        }

        const bestStreak = dashData.dashboardData?.bestStreak ?? 0

        // Calculate days with all habits completed
        const habitDaysComplete = new Set<string>()
        for (const habit of habits) {
          if (habit.completions) {
            for (const c of habit.completions) {
              habitDaysComplete.add(c.date)
            }
          }
        }

        const goalProgress: GoalProgress[] = arc.goals.map((goal) => {
          let current = 0

          switch (goal.type) {
            case 'tasks_complete':
              current = completedTasks
              break
            case 'habits_complete':
              current = habitDaysComplete.size
              break
            case 'streak':
              current = bestStreak
              break
            case 'role_tasks':
              current = goal.roleFilter ? (completedByRole[goal.roleFilter] ?? 0) : 0
              break
          }

          return {
            goal,
            current: Math.min(current, goal.target),
            complete: current >= goal.target,
          }
        })

        setProgress(goalProgress)
      } catch {
        // Use zeros for progress on error
        setProgress(arc.goals.map((goal) => ({ goal, current: 0, complete: false })))
      } finally {
        setLoading(false)
      }
    }

    void loadProgress()
  }, [arc.goals])

  const allComplete = progress.length > 0 && progress.every((p) => p.complete)

  return (
    <Card className={allComplete ? 'border-primary/40' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{arc.emoji}</span>
            <div>
              <CardTitle className="text-sm font-medium">{arc.title}</CardTitle>
              <p className="text-[10px] text-muted-foreground">Weekly Story Arc</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Scroll className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="outline" className="text-[10px] h-5">
              +{arc.rewardXP} XP
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">{arc.description}</p>

        {loading ? (
          <p className="text-xs text-muted-foreground">Loading quest progress...</p>
        ) : (
          <div className="space-y-2.5">
            {progress.map(({ goal, current, complete }, i) => {
              const percent = (current / goal.target) * 100
              return (
                <motion.div
                  key={`${goal.description}-${i}`}
                  className="space-y-1"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {complete ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                      )}
                      <span className={complete ? 'line-through text-muted-foreground' : ''}>
                        {goal.description}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {current}/{goal.target}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        complete ? 'bg-green-500' : 'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {allComplete && (
          <motion.div
            className="mt-3 rounded-lg border border-primary/30 bg-primary/10 p-2 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-xs font-bold text-primary">
              🏆 {arc.reward} — Arc Complete!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
