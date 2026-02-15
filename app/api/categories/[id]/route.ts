import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { categorySchema } from '@/lib/validations/category'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validated = categorySchema.parse(body)
    const category = await db.category.update({
      where: { id: context.params.id },
      data: validated,
    })
    return NextResponse.json({ success: true, category })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 400 }
    )
  }
}

export async function DELETE(_request: Request, context: { params: { id: string } }) {
  try {
    await db.category.delete({
      where: { id: context.params.id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 400 }
    )
  }
}
