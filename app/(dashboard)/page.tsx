'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Calendar, FolderKanban, TrendingUp } from 'lucide-react'
import { ThemedWelcome } from '@/components/shared/themed-welcome'
import { getDashboardData } from '@/lib/queries/dashboard'
import { TaskCard } from '@/components/tasks/task-card'

export default function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboardData>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await getDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ThemedWelcome />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              {data.completedTasks} completed
            </p>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.categories}</div>
            <p className="text-xs text-muted-foreground">
              {data.categories === 0 ? 'No categories yet' : 'Organize your work'}
            </p>
          </CardContent>
        </Card>

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

      {/* Getting Started Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Set up your task and habit tracking system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              1
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Create Categories
              </p>
              <p className="text-sm text-muted-foreground">
                Organize your tasks and habits by creating categories like Work, Personal, Health, etc.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              2
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Add Your First Task
              </p>
              <p className="text-sm text-muted-foreground">
                Create tasks with priorities, due dates, and reminders to stay on top of your work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              3
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Start a Habit
              </p>
              <p className="text-sm text-muted-foreground">
                Track daily or weekly habits and build streaks to stay motivated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
