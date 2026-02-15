import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  // Keep builds and local smoke runs from crashing when env is missing.
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/taskformer'
}

// Ensure Supabase connections use SSL and connection limits for serverless.
if (
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.includes('supabase.co')
) {
  try {
    const url = new URL(process.env.DATABASE_URL)
    // Always use SSL for Supabase
    url.searchParams.set('sslmode', 'require')
    // Limit connections in serverless environments to avoid exhausting the pool
    if (process.env.VERCEL) {
      url.searchParams.set('connection_limit', '1')
    }
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
