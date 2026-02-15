import { db } from '@/lib/db'
import type { Category } from '@prisma/client'

type CategoryWithCounts = Category & {
  _count: {
    tasks: number
    habits: number
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await db.category.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Failed to load categories:', error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    return await db.category.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Failed to load category by id:', error)
    return null
  }
}

export async function getCategoryWithCounts(id: string): Promise<CategoryWithCounts | null> {
  try {
    return await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true,
            habits: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Failed to load category with counts:', error)
    return null
  }
}

export async function getAllCategoriesWithCounts(): Promise<CategoryWithCounts[]> {
  try {
    return await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            tasks: true,
            habits: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Failed to load categories with counts:', error)
    return []
  }
}
