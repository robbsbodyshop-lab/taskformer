'use server'

import { db } from '@/lib/db'
import { startOfDay, endOfDay } from 'date-fns'
import { xpForLevel } from '@/lib/utils/xp'

export interface GameProgressData {
  level: number
  currentXP: number
  totalXP: number
  title: string
  xpToNextLevel: number
}

/** Returns game progress, creating the singleton row if needed. */
export async function getGameProgress(): Promise<GameProgressData> {
  try {
    const progress = await db.gameProgress.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton' },
      update: {},
    })

    return {
      level: progress.level,
      currentXP: progress.currentXP,
      totalXP: progress.totalXP,
      title: progress.title,
      xpToNextLevel: xpForLevel(progress.level),
    }
  } catch {
    return {
      level: 1,
      currentXP: 0,
      totalXP: 0,
      title: 'Novice',
      xpToNextLevel: xpForLevel(1),
    }
  }
}

/** Returns all unlocked achievements, most recent first. */
export async function getAchievements() {
  try {
    return await db.achievement.findMany({
      orderBy: { unlockedAt: 'desc' },
    })
  } catch {
    return []
  }
}

/** Returns the N most recent XP transactions. */
export async function getRecentXP(limit = 10) {
  try {
    return await db.xPTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  } catch {
    return []
  }
}

/** Returns total XP earned today. */
export async function getXPToday(): Promise<number> {
  try {
    const today = new Date()
    const result = await db.xPTransaction.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    })
    return result._sum.amount ?? 0
  } catch {
    return 0
  }
}

/** Returns count of tasks completed today. */
export async function getTasksCompletedToday(): Promise<number> {
  try {
    const today = new Date()
    return await db.task.count({
      where: {
        completed: true,
        completedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    })
  } catch {
    return 0
  }
}
