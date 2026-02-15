import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/queries/dashboard'
import { getAchievements, getTasksCompletedToday, getXPToday } from '@/lib/queries/game'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [dashboardData, achievements, xpToday, tasksToday] = await Promise.all([
    getDashboardData(),
    getAchievements(),
    getXPToday(),
    getTasksCompletedToday(),
  ])

  return NextResponse.json({
    dashboardData,
    achievements,
    xpToday,
    tasksToday,
  })
}
