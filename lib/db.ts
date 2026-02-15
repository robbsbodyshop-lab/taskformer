import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  // Keep builds and local smoke runs from crashing when env is missing.
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/taskformer'
}

// Ensure Supabase connections use SSL even if env omits it.
if (
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.includes('supabase.co') &&
  !process.env.DATABASE_URL.includes('sslmode=')
) {
  const separator = process.env.DATABASE_URL.includes('?') ? '&' : '?'
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}sslmode=require`
}

// On Vercel, prefer Supabase pooler to avoid connection issues.
if (
  process.env.VERCEL &&
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.includes('supabase.co')
) {
  try {
    const url = new URL(process.env.DATABASE_URL)
    if (url.port === '5432') {
      url.port = '6543'
    }
    url.searchParams.set('pgbouncer', 'true')
    url.searchParams.set('connection_limit', '1')
    url.searchParams.set('sslmode', 'require')
    process.env.DATABASE_URL = url.toString()
  } catch {
    // Keep original URL if parsing fails
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Keep dev terminal usable when running without a reachable DB.
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
