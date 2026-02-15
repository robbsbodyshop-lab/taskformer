import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/queries/categories'
import { db } from '@/lib/db'
import { categorySchema } from '@/lib/validations/category'

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
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 400 }
    )
  }
}
