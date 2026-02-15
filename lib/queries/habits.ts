import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { calculateStreak } from '@/lib/utils/streaks'
import { startOfDay, endOfDay } from 'date-fns'

export type HabitWithCompletions = Prisma.HabitGetPayload<{
  include: { completions: true; category: true }
}>

export async function getHabits() {
  try {
    return await db.habit.findMany({
      where: {
        archived: false,
      },
      include: {
        completions: {
          orderBy: {
            date: 'desc',
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch {
    return []
  }
}

export async function getHabitById(id: string) {
  try {
    return await db.habit.findUnique({
      where: { id },
      include: {
        completions: {
          orderBy: {
            date: 'desc',
          },
        },
        category: true,
      },
    })
  } catch {
    return null
  }
}

export async function getHabitsWithStreaks() {
  const habits = await getHabits()

  return habits.map((habit) => ({
    ...habit,
    streak: calculateStreak(habit, habit.completions),
  }))
}

export async function getHabitCompletionForDate(habitId: string, date: Date) {
  const start = startOfDay(date)
  const end = endOfDay(date)

  try {
    return await db.habitCompletion.findFirst({
      where: {
        habitId,
        date: {
          gte: start,
          lte: end,
        },
      },
    })
  } catch {
    return null
  }
}

export async function getHabitStats() {
  try {
    const totalHabits = await db.habit.count({
      where: { archived: false },
    })

    const habitsWithCompletions = await db.habit.findMany({
      where: { archived: false },
      include: {
        completions: true,
      },
    })

    const streaks = habitsWithCompletions.map((habit) =>
      calculateStreak(habit, habit.completions)
    )

    const longestStreak = Math.max(...streaks.map((s) => s.longestStreak), 0)
    const activeStreaks = streaks.filter((s) => s.currentStreak > 0).length

    return {
      totalHabits,
      activeStreaks,
      longestStreak,
    }
  } catch {
    return {
      totalHabits: 0,
      activeStreaks: 0,
      longestStreak: 0,
    }
  }
}

export async function getHabitCompletionsForMonth(habitId: string, month: Date) {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59)

  try {
    return await db.habitCompletion.findMany({
      where: {
        habitId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })
  } catch {
    return []
  }
}
