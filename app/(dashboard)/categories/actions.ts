'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { categorySchema } from '@/lib/validations/category'
import { z } from 'zod'

export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    const validated = categorySchema.parse(data)

    const category = await db.category.create({
      data: validated,
    })

    revalidatePath('/categories')
    return { success: true, category }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid category data' }
    }
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateCategory(id: string, data: z.infer<typeof categorySchema>) {
  try {
    const validated = categorySchema.parse(data)

    const category = await db.category.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/categories')
    return { success: true, category }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid category data' }
    }
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id },
    })

    revalidatePath('/categories')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete category' }
  }
}
