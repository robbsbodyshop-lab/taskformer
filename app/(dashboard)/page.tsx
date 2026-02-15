import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Calendar, FolderKanban, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to TaskFormer - Your personal task and habit tracker
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tasks yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No habits yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No categories yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 days</div>
            <p className="text-xs text-muted-foreground">Start a habit!</p>
          </CardContent>
        </Card>
      </div>

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
