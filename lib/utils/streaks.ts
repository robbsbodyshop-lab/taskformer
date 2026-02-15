import { startOfDay, subDays, isSameDay, differenceInDays, format } from 'date-fns'
import type { Habit, HabitCompletion } from '@prisma/client'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCompletionDate: Date | null
  completionRate: number
}

/**
 * Calculate streak statistics for a habit
 * @param habit - The habit to calculate streaks for
 * @param completions - Array of habit completions
 * @returns Streak data including current and longest streaks
 */
export function calculateStreak(
  habit: Habit,
  completions: HabitCompletion[]
): StreakData {
  if (completions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      completionRate: 0,
    }
  }

  const today = startOfDay(new Date())
  const sortedCompletions = completions
    .map((c) => startOfDay(c.date))
    .sort((a, b) => b.getTime() - a.getTime())

  const lastCompletionDate = sortedCompletions[0]

  // Calculate current streak
  let currentStreak = 0
  let checkDate = today
  const yesterday = subDays(today, 1)

  // Allow streak to continue if completed today or yesterday
  if (isSameDay(lastCompletionDate, today)) {
    currentStreak = 1
    checkDate = yesterday
  } else if (isSameDay(lastCompletionDate, yesterday)) {
    currentStreak = 1
    checkDate = subDays(yesterday, 1)
  } else {
    // Streak is broken
    currentStreak = 0
  }

  // Count consecutive days backward from checkDate
  if (currentStreak > 0) {
    for (const completion of sortedCompletions) {
      if (isSameDay(completion, checkDate)) {
        currentStreak++
        checkDate = subDays(checkDate, 1)
      } else if (completion < checkDate) {
        break
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 1; i < sortedCompletions.length; i++) {
    const completion = sortedCompletions[i]
    const previousCompletion = sortedCompletions[i - 1]
    const daysDiff = differenceInDays(previousCompletion, completion)

    if (daysDiff === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

  // Calculate completion rate (last 30 days)
  const thirtyDaysAgo = subDays(today, 30)
  const recentCompletions = completions.filter(
    (c) => startOfDay(c.date) >= thirtyDaysAgo
  )
  const completionRate = (recentCompletions.length / 30) * 100

  return {
    currentStreak,
    longestStreak,
    lastCompletionDate,
    completionRate: Math.min(completionRate, 100),
  }
}

/**
 * Check if a habit is completed on a specific date
 * @param completions - Array of habit completions
 * @param date - Date to check
 * @returns boolean indicating if habit was completed on that date
 */
export function isHabitCompletedOnDate(
  completions: HabitCompletion[],
  date: Date
): boolean {
  const targetDate = startOfDay(date)
  return completions.some((c) => isSameDay(startOfDay(c.date), targetDate))
}

/**
 * Get completion status for a range of dates
 * @param completions - Array of habit completions
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns Map of date strings to completion status
 */
export function getCompletionMap(
  completions: HabitCompletion[],
  startDate: Date,
  endDate: Date
): Map<string, boolean> {
  const map = new Map<string, boolean>()
  let current = startOfDay(startDate)
  const end = startOfDay(endDate)

  while (current <= end) {
    const dateString = format(current, 'yyyy-MM-dd')
    map.set(dateString, isHabitCompletedOnDate(completions, current))
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000) // Add one day
  }

  return map
}
