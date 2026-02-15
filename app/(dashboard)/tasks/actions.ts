'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { createTaskSchema, updateTaskSchema } from '@/lib/validations/task'
import { z } from 'zod'
import { awardXP, getTaskXP } from '@/lib/utils/xp'
import { checkAndUnlockAchievements } from '@/lib/utils/achievements'
import type { UnlockedAchievement } from '@/lib/utils/achievements'
import type { AwardResult } from '@/lib/utils/xp'

export async function createTask(data: z.infer<typeof createTaskSchema>) {
  try {
    const validated = createTaskSchema.parse(data)

    // Clean "none" sentinel value from turtleRole
    if (validated.turtleRole === 'none' as unknown) {
      validated.turtleRole = undefined
    }

    const task = await db.task.create({
      data: validated,
    })

    revalidatePath('/tasks')
    revalidatePath('/')

    return { success: true, data: task }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid task data' }
    }
    return { success: false, error: 'Failed to create task' }
  }
}

export async function updateTask(id: string, data: z.infer<typeof updateTaskSchema>) {
  try {
    const validated = updateTaskSchema.parse(data)

    const task = await db.task.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/')

    return { success: true, data: task }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid task data' }
    }
    return { success: false, error: 'Failed to update task' }
  }
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: { id },
    })

    revalidatePath('/tasks')
    revalidatePath('/')

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete task' }
  }
}

export async function toggleTaskCompletion(id: string): Promise<{
  success: boolean
  error?: string
  data?: unknown
  xp?: AwardResult
  newAchievements?: UnlockedAchievement[]
}> {
  try {
    const task = await db.task.findUnique({
      where: { id },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const isCompleting = !task.completed

    const updated = await db.task.update({
      where: { id },
      data: {
        completed: isCompleting,
        completedAt: isCompleting ? new Date() : null,
      },
    })

    let xp: AwardResult | undefined
    let newAchievements: UnlockedAchievement[] = []

    // Award XP only when completing (not uncompleting)
    if (isCompleting) {
      const xpAmount = getTaskXP(task.priority)
      xp = await awardXP(xpAmount, 'task_complete', task.id)
      newAchievements = await checkAndUnlockAchievements()
    }

    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/')

    return { success: true, data: updated, xp, newAchievements }
  } catch {
    return { success: false, error: 'Failed to toggle task completion' }
  }
}
