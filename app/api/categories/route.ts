import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/queries/categories'
import { db } from '@/lib/db'
import { categorySchema } from '@/lib/validations/category'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET() {
  const categories = await getCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = categorySchema.parse(body)
    const category = await db.category.create({
      data: validated,
    })
    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('[POST /api/categories] Error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const message =
      error instanceof Error ? error.message : 'Failed to create category'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
