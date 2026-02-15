import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/queries/categories'

export const dynamic = 'force-dynamic'

export async function GET() {
  const categories = await getCategories()
  return NextResponse.json(categories)
}
