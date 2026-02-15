'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, TrendingUp, Clock } from 'lucide-react'

interface IntelData {
  overdueTasks: number
  completedToday: number
  activeTasks: number
  activeHabits: number
  bestStreak: number
  topPriority: string | null
  totalXPToday: number
}

function getIntelBriefing(data: IntelData): { icon: string; headline: string; body: string; severity: 'good' | 'warn' | 'alert' }[] {
  const briefs: { icon: string; headline: string; body: string; severity: 'good' | 'warn' | 'alert' }[] = []

  // Overdue alert
  if (data.overdueTasks > 0) {
    briefs.push({
      icon: '🚨',
      headline: `${data.overdueTasks} Overdue ${data.overdueTasks === 1 ? 'Task' : 'Tasks'}`,
      body: data.overdueTasks >= 3
        ? 'Critical: multiple tasks past deadline. Recommend immediate triage.'
        : 'One task needs attention. Handle it before it compounds.',
      severity: 'alert',
    })
  }

  // Today's progress
  if (data.completedToday > 0) {
    briefs.push({
      icon: '✅',
      headline: `${data.completedToday} Completed Today`,
      body: data.completedToday >= 5
        ? 'Outstanding productivity. Keep this momentum!'
        : `${data.completedToday} down. Keep pushing to hit your daily target.`,
      severity: 'good',
    })
  }

  // Active tasks summary
  if (data.activeTasks > 0) {
    briefs.push({
      icon: '📋',
      headline: `${data.activeTasks} Active Tasks`,
      body: data.activeTasks > 10
        ? 'Heavy backlog detected. Consider prioritizing your top 3.'
        : 'Manageable workload. Stay focused on what matters.',
      severity: data.activeTasks > 10 ? 'warn' : 'good',
    })
  }

  // Streak intel
  if (data.bestStreak >= 3) {
    briefs.push({
      icon: '🔥',
      headline: `${data.bestStreak}-Day Best Streak`,
      body: "Strong consistency detected. Don't break the chain!",
      severity: 'good',
    })
  }

  // XP today
  if (data.totalXPToday > 0) {
    briefs.push({
      icon: '⚡',
      headline: `${data.totalXPToday} XP Earned Today`,
      body: data.totalXPToday >= 100
        ? 'Exceptional XP gain! You\'re leveling fast.'
        : 'Every XP counts. Keep completing tasks for more.',
      severity: 'good',
    })
  }

  // Fallback if no data
  if (briefs.length === 0) {
    briefs.push({
      icon: '📡',
      headline: 'No Intel Yet',
      body: 'Start adding tasks and habits to see your daily intelligence brief.',
      severity: 'good',
    })
  }

  return briefs.slice(0, 3) // Cap at 3 items
}

export function AprilBrief() {
  const [briefs, setBriefs] = useState<ReturnType<typeof getIntelBriefing>>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()

        // Fetch tasks for overdue count
        const tasksRes = await fetch('/api/tasks', { cache: 'no-store' })
        const tasks: { completed?: boolean; dueDate?: string; priority?: string }[] =
          tasksRes.ok ? await tasksRes.json() : []

        const now = new Date()
        let overdueTasks = 0
        let topPriority: string | null = null
        for (const task of tasks) {
          if (task.dueDate && !task.completed && new Date(task.dueDate) < now) {
            overdueTasks++
          }
          if (!task.completed && task.priority === 'URGENT' && !topPriority) {
            topPriority = 'URGENT'
          }
        }

        const intel: IntelData = {
          overdueTasks,
          completedToday: data.tasksToday ?? 0,
          activeTasks: data.dashboardData?.activeTasks ?? 0,
          activeHabits: data.dashboardData?.activeHabits ?? 0,
          bestStreak: data.dashboardData?.bestStreak ?? 0,
          topPriority,
          totalXPToday: data.xpToday ?? 0,
        }

        setBriefs(getIntelBriefing(intel))
      } catch {
        setBriefs([{
          icon: '📡',
          headline: 'Intel Offline',
          body: 'Unable to reach the intelligence network. Check back soon.',
          severity: 'warn',
        }])
      }
    }
    void load()
  }, [])

  if (briefs.length === 0) return null

  const severityIcons = {
    good: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
    warn: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
    alert: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <CardTitle className="text-sm font-medium">
            April&apos;s Intel Brief
          </CardTitle>
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {briefs.map((brief, i) => (
            <motion.div
              key={brief.headline}
              className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-sm ${
                brief.severity === 'alert'
                  ? 'border-red-500/30 bg-red-500/5'
                  : brief.severity === 'warn'
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : 'border-border bg-card/50'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <span className="text-base flex-shrink-0">{brief.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {severityIcons[brief.severity]}
                  <span className="font-semibold text-xs">{brief.headline}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{brief.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
