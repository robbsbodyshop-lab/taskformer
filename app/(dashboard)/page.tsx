'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Calendar, FolderKanban, TrendingUp, Trophy, Zap, Target } from 'lucide-react'
import { ThemedWelcome } from '@/components/shared/themed-welcome'
import type { getDashboardData } from '@/lib/queries/dashboard'
import { TaskCard } from '@/components/tasks/task-card'
import { XPBar } from '@/components/game/xp-bar'
import { useGame } from '@/lib/contexts/game-context'
import { achievementIconMap } from '@/components/game/achievement-icon'
import Link from 'next/link'
import type { Achievement } from '@prisma/client'

// TMNT Feature Components
import { SplinterGuidance } from '@/components/game/splinter-guidance'
import { AprilBrief } from '@/components/game/april-brief'
import { CaseyMode } from '@/components/game/casey-mode'
import { BrotherhoodMeter } from '@/components/game/brotherhood-meter'
import { StoryArcCard } from '@/components/game/story-arc-card'
import { WeaponBonusCard } from '@/components/game/weapon-bonus-card'
import { AllyPanel } from '@/components/game/ally-panel'
import { PomodoroTimer } from '@/components/game/pomodoro-timer'

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

type DashboardResponse = {
  dashboardData: DashboardData
  achievements: Achievement[]
  xpToday: number
  tasksToday: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [xpToday, setXPToday] = useState(0)
  const [tasksToday, setTasksToday] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { progress } = useGame()

  const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return (await response.json()) as T
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const payload = await fetchJson<DashboardResponse>('/api/dashboard')
        setData(payload.dashboardData)
        setAchievements(payload.achievements)
        setXPToday(payload.xpToday)
        setTasksToday(payload.tasksToday)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        setLoadError('Unable to load dashboard data. Check database configuration and try again.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (loadError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{loadError ?? 'Unable to load dashboard.'}</p>
      </div>
    )
  }

  const dailyChallengeTarget = 3
  const dailyChallengeProgress = Math.min(tasksToday, dailyChallengeTarget)
  const dailyChallengePercent = (dailyChallengeProgress / dailyChallengeTarget) * 100

  return (
    <div className="space-y-6 md:space-y-8">
      <ThemedWelcome />

      {/* Player Profile Card */}
      {progress && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {progress.title}
                </CardTitle>
                <CardDescription>
                  Level {progress.level} &middot; {progress.totalXP} total XP
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{xpToday} XP today</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <XPBar
              currentXP={progress.currentXP}
              xpToNextLevel={progress.xpToNextLevel}
              level={progress.level}
              title={progress.title}
            />
          </CardContent>
        </Card>
      )}

      {/* Daily Challenge + Recent Achievements row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Challenge */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Daily Challenge</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Complete {dailyChallengeTarget} tasks today
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${dailyChallengePercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">
                {dailyChallengeProgress}/{dailyChallengeTarget}
              </span>
            </div>
            {dailyChallengeProgress >= dailyChallengeTarget && (
              <p className="text-xs font-semibold text-green-600 mt-2">
                Challenge complete!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              </div>
              <Link href="/achievements" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No achievements yet. Complete tasks and habits to earn badges!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {achievements.slice(0, 4).map((a) => {
                  const Icon = achievementIconMap[a.icon]
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1"
                      title={a.description}
                    >
                      {Icon ? (
                        <Icon className="h-3.5 w-3.5 text-yellow-600" />
                      ) : (
                        <span className="text-xs">🏆</span>
                      )}
                      <span className="text-xs font-medium">{a.name}</span>
                    </div>
                  )
                })}
                {achievements.length > 4 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{achievements.length - 4} more
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Splinter Guidance (#4) */}
      <SplinterGuidance />

      {/* Pomodoro + TMNT Feature Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pomodoro Timer */}
        <PomodoroTimer />

        {/* Casey Chaos Mode (#6) */}
        <CaseyMode />

        {/* April Intel Brief (#5) */}
        <AprilBrief />

        {/* Brotherhood Meter (#3) */}
        <BrotherhoodMeter />
      </div>

      {/* Story Arc + Weapon Bonuses row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Story Arc Seasons (#9) */}
        <StoryArcCard />

        {/* Weapon Bonuses (#7) */}
        <WeaponBonusCard />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/tasks?new=1" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              {data.completedTasks} completed
            </p>
            <p className="text-[11px] text-primary mt-2">Click to add a task</p>
          </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeHabits}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalHabits} total habits
            </p>
          </CardContent>
        </Card>

        <Link href="/categories?new=1" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.categories}</div>
              <p className="text-xs text-muted-foreground">
                {data.categories === 0 ? 'No categories yet' : 'Organize your work'}
              </p>
              <p className="text-[11px] text-primary mt-2">Click to add a category</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bestStreak} days</div>
            <p className="text-xs text-muted-foreground">
              {data.bestStreak === 0 ? 'Start a habit!' : 'Keep it up!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      {data.todayTasks.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Today&apos;s Tasks</h2>
            <p className="text-muted-foreground">
              {data.todayTasks.length} {data.todayTasks.length === 1 ? 'task' : 'tasks'} for today
            </p>
          </div>
          <div className="space-y-3">
            {data.todayTasks.slice(0, 5).map((task: (typeof data.todayTasks)[number]) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Ally Panel (#10) */}
      <AllyPanel />
    </div>
  )
}
