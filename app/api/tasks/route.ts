import { NextResponse } from 'next/server'
import { Priority } from '@prisma/client'
import { getTasks, type TaskFilters } from '@/lib/queries/tasks'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const filters: TaskFilters = {}
  const completed = searchParams.get('completed')
  if (completed === 'true') filters.completed = true
  if (completed === 'false') filters.completed = false

  const priority = searchParams.get('priority')
  if (priority && priority !== 'all') {
    filters.priority = priority as Priority
  }

  const categoryId = searchParams.get('categoryId')
  if (categoryId && categoryId !== 'all') {
    filters.categoryId = categoryId
  }

  const search = searchParams.get('search')
  if (search) {
    filters.search = search
  }

  const hasFilters = Object.keys(filters).length > 0
  const tasks = await getTasks(hasFilters ? filters : undefined)

  return NextResponse.json(tasks)
}
