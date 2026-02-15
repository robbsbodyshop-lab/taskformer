'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { createHabitSchema, updateHabitSchema } from '@/lib/validations/habit'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'
import { awardXP, getHabitXP } from '@/lib/utils/xp'
import { checkAndUnlockAchievements } from '@/lib/utils/achievements'
import { calculateStreak } from '@/lib/utils/streaks'
import type { UnlockedAchievement } from '@/lib/utils/achievements'
import type { AwardResult } from '@/lib/utils/xp'

export async function createHabit(data: z.infer<typeof createHabitSchema>) {
  try {
    const validated = createHabitSchema.parse(data)

    const habit = await db.habit.create({
      data: validated,
    })

    revalidatePath('/habits')
    revalidatePath('/')

    return { success: true, data: habit }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid habit data' }
    }
    return { success: false, error: 'Failed to create habit' }
  }
}

export async function updateHabit(id: string, data: z.infer<typeof updateHabitSchema>) {
  try {
    const validated = updateHabitSchema.parse(data)

    const habit = await db.habit.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/habits')
    revalidatePath(`/habits/${id}`)
    revalidatePath('/')

    return { success: true, data: habit }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid habit data' }
    }
    return { success: false, error: 'Failed to update habit' }
  }
}

export async function deleteHabit(id: string) {
  try {
    await db.habit.delete({
      where: { id },
    })

    revalidatePath('/habits')
    revalidatePath('/')

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete habit' }
  }
}

export async function toggleHabitArchive(id: string) {
  try {
    const habit = await db.habit.findUnique({
      where: { id },
    })

    if (!habit) {
      return { success: false, error: 'Habit not found' }
    }

    const updated = await db.habit.update({
      where: { id },
      data: {
        archived: !habit.archived,
      },
    })

    revalidatePath('/habits')
    revalidatePath(`/habits/${id}`)
    revalidatePath('/')

    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to toggle habit archive' }
  }
}

export async function toggleHabitCompletion(
  habitId: string,
  date: Date = new Date()
): Promise<{
  success: boolean
  completed?: boolean
  error?: string
  xp?: AwardResult
  newAchievements?: UnlockedAchievement[]
}> {
  try {
    const start = startOfDay(date)
    const end = endOfDay(date)

    // Check if completion exists for this date
    const existingCompletion = await db.habitCompletion.findFirst({
      where: {
        habitId,
        completedAt: {
          gte: start,
          lte: end,
        },
      },
    })

    if (existingCompletion) {
      // Remove completion
      await db.habitCompletion.delete({
        where: { id: existingCompletion.id },
      })

      revalidatePath('/habits')
      revalidatePath(`/habits/${habitId}`)
      revalidatePath('/')

      return { success: true, completed: false }
    } else {
      // Add completion
      await db.habitCompletion.create({
        data: {
          habitId,
          completedAt: date,
        },
      })

      // Calculate streak and award XP
      const habit = await db.habit.findUnique({
        where: { id: habitId },
        include: { completions: true },
      })

      let xp: AwardResult | undefined
      let newAchievements: UnlockedAchievement[] = []

      if (habit) {
        const streak = calculateStreak(habit, habit.completions)
        const xpAmount = getHabitXP(streak.currentStreak)
        xp = await awardXP(xpAmount, 'habit_complete', habitId)
        newAchievements = await checkAndUnlockAchievements()
      }

      revalidatePath('/habits')
      revalidatePath(`/habits/${habitId}`)
      revalidatePath('/')

      return { success: true, completed: true, xp, newAchievements }
    }
  } catch {
    return { success: false, error: 'Failed to toggle habit completion' }
  }
}
