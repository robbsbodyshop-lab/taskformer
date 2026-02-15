import { db } from '@/lib/db'
import { getTaskStats, getTasksForToday } from './tasks'
import { getHabitStats, getHabitsWithStreaks } from './habits'

export async function getDashboardData() {
  const [taskStats, habitStats, todayTasks, habitsWithStreaks, categories] = await Promise.all([
    getTaskStats(),
    getHabitStats(),
    getTasksForToday(),
    getHabitsWithStreaks(),
    db.category.count(),
  ])

  const bestStreak = habitStats.longestStreak

  return {
    totalTasks: taskStats.total,
    activeTasks: taskStats.active,
    completedTasks: taskStats.completed,
    overdueTasks: taskStats.overdue,
    activeHabits: habitStats.activeStreaks,
    totalHabits: habitStats.totalHabits,
    bestStreak,
    categories,
    todayTasks,
    habitsWithStreaks,
  }
}
