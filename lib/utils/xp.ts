import { db } from '@/lib/db'
import type { Priority } from '@prisma/client'

// --- XP Values ---

const TASK_XP: Record<Priority, number> = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 35,
  URGENT: 50,
}

const HABIT_BASE_XP = 15
const STREAK_XP_PER_DAY = 2
const STREAK_XP_CAP = 50

// --- Level Curve ---

/** XP required to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 80 + level * 20
}

/** Total cumulative XP required to reach the *start* of `level`. */
export function cumulativeXPForLevel(level: number): number {
  // Sum of xpForLevel(1) + xpForLevel(2) + ... + xpForLevel(level-1)
  let total = 0
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i)
  }
  return total
}

// --- Title Progression ---

export function getTitleForLevel(level: number): string {
  if (level >= 25) return 'Legend'
  if (level >= 15) return 'Champion'
  if (level >= 10) return 'Warrior'
  if (level >= 5) return 'Apprentice'
  return 'Novice'
}

// --- XP Calculation Helpers ---

export function getTaskXP(priority: Priority): number {
  return TASK_XP[priority]
}

export function getHabitXP(currentStreak: number): number {
  const streakBonus = Math.min(currentStreak * STREAK_XP_PER_DAY, STREAK_XP_CAP)
  return HABIT_BASE_XP + streakBonus
}

// --- Core Award Function ---

export interface AwardResult {
  xpGained: number
  totalXP: number
  currentXP: number
  level: number
  title: string
  levelUp: boolean
  previousLevel: number
}

/**
 * Awards XP, updates GameProgress, handles level-ups.
 * Must be called from a server context (server action / API route).
 */
export async function awardXP(
  amount: number,
  reason: string,
  entityId?: string
): Promise<AwardResult> {
  try {
    // Ensure game progress row exists
    const progress = await db.gameProgress.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton' },
      update: {},
    })

    // Log the transaction
    await db.xPTransaction.create({
      data: { amount, reason, entityId },
    })

    // Calculate new totals
    const newTotalXP = progress.totalXP + amount
    let newCurrentXP = progress.currentXP + amount
    let newLevel = progress.level
    let levelUp = false
    const previousLevel = progress.level

    // Check for level-ups (can be multiple at once with big XP gains)
    while (newCurrentXP >= xpForLevel(newLevel)) {
      newCurrentXP -= xpForLevel(newLevel)
      newLevel++
      levelUp = true
    }

    const newTitle = getTitleForLevel(newLevel)

    // Persist
    await db.gameProgress.update({
      where: { id: 'singleton' },
      data: {
        totalXP: newTotalXP,
        currentXP: newCurrentXP,
        level: newLevel,
        title: newTitle,
      },
    })

    return {
      xpGained: amount,
      totalXP: newTotalXP,
      currentXP: newCurrentXP,
      level: newLevel,
      title: newTitle,
      levelUp,
      previousLevel,
    }
  } catch {
    // Graceful fallback when game tables are not yet migrated in production.
    return {
      xpGained: amount,
      totalXP: amount,
      currentXP: amount,
      level: 1,
      title: 'Novice',
      levelUp: false,
      previousLevel: 1,
    }
  }
}
