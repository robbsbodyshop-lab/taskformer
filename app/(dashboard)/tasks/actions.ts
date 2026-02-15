'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { createTaskSchema, updateTaskSchema } from '@/lib/validations/task'
import { z } from 'zod'

export async function createTask(data: z.infer<typeof createTaskSchema>) {
  try {
    const validated = createTaskSchema.parse(data)

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

export async function toggleTaskCompletion(id: string) {
  try {
    const task = await db.task.findUnique({
      where: { id },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const updated = await db.task.update({
      where: { id },
      data: {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null,
      },
    })

    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/')

    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to toggle task completion' }
  }
}
