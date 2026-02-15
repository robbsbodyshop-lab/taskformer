import { db } from '@/lib/db'
import type { Category } from '@prisma/client'

export async function getCategories(): Promise<Category[]> {
  return db.category.findMany({
    orderBy: { order: 'asc' },
  })
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return db.category.findUnique({
    where: { id },
  })
}

export async function getCategoryWithCounts(id: string) {
  return db.category.findUnique({
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
}

export async function getAllCategoriesWithCounts() {
  return db.category.findMany({
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
}
