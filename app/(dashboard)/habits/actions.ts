'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { createHabitSchema, updateHabitSchema } from '@/lib/validations/habit'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'

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

export async function toggleHabitCompletion(habitId: string, date: Date = new Date()) {
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

      revalidatePath('/habits')
      revalidatePath(`/habits/${habitId}`)
      revalidatePath('/')

      return { success: true, completed: true }
    }
  } catch {
    return { success: false, error: 'Failed to toggle habit completion' }
  }
}
