import { db } from '@/lib/db'
import { Priority, Prisma } from '@prisma/client'

export type TaskWithCategory = Prisma.TaskGetPayload<{
  include: { category: true }
}>

export type TaskFilters = {
  completed?: boolean
  priority?: Priority
  categoryId?: string
  search?: string
  dueDateFrom?: Date
  dueDateTo?: Date
}

export async function getTasks(filters?: TaskFilters) {
  const where: Prisma.TaskWhereInput = {}

  if (filters) {
    if (filters.completed !== undefined) {
      where.completed = filters.completed
    }
    if (filters.priority) {
      where.priority = filters.priority
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {}
      if (filters.dueDateFrom) {
        where.dueDate.gte = filters.dueDateFrom
      }
      if (filters.dueDateTo) {
        where.dueDate.lte = filters.dueDateTo
      }
    }
  }

  try {
    return await db.task.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })
  } catch {
    return []
  }
}

export async function getTaskById(id: string) {
  try {
    return await db.task.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
  } catch {
    return null
  }
}

export async function getTasksForToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  try {
    return await db.task.findMany({
      where: {
        completed: false,
        OR: [
          {
            dueDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          {
            dueDate: null,
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    })
  } catch {
    return []
  }
}

export async function getOverdueTasks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    return await db.task.findMany({
      where: {
        completed: false,
        dueDate: {
          lt: today,
        },
      },
      include: {
        category: true,
      },
      orderBy: [
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    })
  } catch {
    return []
  }
}

export async function getTaskStats() {
  try {
    const total = await db.task.count()
    const completed = await db.task.count({ where: { completed: true } })
    const active = total - completed
    const overdue = await db.task.count({
      where: {
        completed: false,
        dueDate: {
          lt: new Date(),
        },
      },
    })

    return {
      total,
      completed,
      active,
      overdue,
    }
  } catch {
    return {
      total: 0,
      completed: 0,
      active: 0,
      overdue: 0,
    }
  }
}
