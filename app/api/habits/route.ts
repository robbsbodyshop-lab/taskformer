import { NextResponse } from 'next/server'
import { getHabits } from '@/lib/queries/habits'

export const dynamic = 'force-dynamic'

export async function GET() {
  const habits = await getHabits()
  return NextResponse.json(habits)
}
