import { db } from '@/lib/db'
import { awardXP } from '@/lib/utils/xp'
import { startOfDay, endOfDay } from 'date-fns'

// --- Achievement Registry ---

export interface AchievementDef {
  key: string
  name: string
  description: string
  icon: string
  xpReward: number
  /** Returns true if the condition is met. */
  check: () => Promise<boolean>
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: 'first_task',
    name: 'First Step',
    description: 'Complete your first task',
    icon: 'sword',
    xpReward: 25,
    check: async () => {
      const count = await db.task.count({ where: { completed: true } })
      return count >= 1
    },
  },
  {
    key: 'task_10',
    name: 'Taskmaster',
    description: 'Complete 10 tasks',
    icon: 'shield',
    xpReward: 50,
    check: async () => {
      const count = await db.task.count({ where: { completed: true } })
      return count >= 10
    },
  },
  {
    key: 'task_50',
    name: 'Productivity Machine',
    description: 'Complete 50 tasks',
    icon: 'trophy',
    xpReward: 150,
    check: async () => {
      const count = await db.task.count({ where: { completed: true } })
      return count >= 50
    },
  },
  {
    key: 'first_habit',
    name: 'Creature of Habit',
    description: 'Create your first habit',
    icon: 'sprout',
    xpReward: 25,
    check: async () => {
      const count = await db.habit.count()
      return count >= 1
    },
  },
  {
    key: 'streak_7',
    name: 'On Fire',
    description: 'Reach a 7-day habit streak',
    icon: 'fire',
    xpReward: 100,
    check: async () => {
      // Check if any habit has 7+ consecutive completions
      // We'll check by looking at the best streak from recent completions
      const habits = await db.habit.findMany({
        include: { completions: { orderBy: { date: 'desc' }, take: 30 } },
      })
      for (const habit of habits) {
        if (getStreakLength(habit.completions.map((c) => c.date)) >= 7) {
          return true
        }
      }
      return false
    },
  },
  {
    key: 'streak_30',
    name: 'Unstoppable',
    description: 'Reach a 30-day habit streak',
    icon: 'lightning',
    xpReward: 500,
    check: async () => {
      const habits = await db.habit.findMany({
        include: { completions: { orderBy: { date: 'desc' }, take: 60 } },
      })
      for (const habit of habits) {
        if (getStreakLength(habit.completions.map((c) => c.date)) >= 30) {
          return true
        }
      }
      return false
    },
  },
  {
    key: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: 'star',
    xpReward: 0,
    check: async () => {
      const progress = await db.gameProgress.findUnique({ where: { id: 'singleton' } })
      return (progress?.level ?? 0) >= 5
    },
  },
  {
    key: 'level_10',
    name: 'Elite',
    description: 'Reach level 10',
    icon: 'crown',
    xpReward: 0,
    check: async () => {
      const progress = await db.gameProgress.findUnique({ where: { id: 'singleton' } })
      return (progress?.level ?? 0) >= 10
    },
  },
  {
    key: 'urgent_slayer',
    name: 'Urgent Slayer',
    description: 'Complete an URGENT priority task',
    icon: 'zap',
    xpReward: 30,
    check: async () => {
      const count = await db.task.count({ where: { completed: true, priority: 'URGENT' } })
      return count >= 1
    },
  },
  {
    key: 'daily_3',
    name: 'Trifecta',
    description: 'Complete 3 tasks in one day',
    icon: 'target',
    xpReward: 40,
    check: async () => {
      const today = new Date()
      const count = await db.task.count({
        where: {
          completed: true,
          completedAt: { gte: startOfDay(today), lte: endOfDay(today) },
        },
      })
      return count >= 3
    },
  },
]

// --- Helpers ---

/** Simple streak length calculator from sorted-desc date array. */
function getStreakLength(dates: Date[]): number {
  if (dates.length === 0) return 0

  const sorted = [...dates]
    .map((d) => startOfDay(d).getTime())
    .sort((a, b) => b - a)

  // deduplicate
  const unique = [...new Set(sorted)]

  const DAY = 86400000
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    if (unique[i - 1] - unique[i] === DAY) {
      streak++
    } else {
      break
    }
  }
  return streak
}

// --- Public API ---

export function getAchievementDefs(): AchievementDef[] {
  return ACHIEVEMENT_DEFS
}

export interface UnlockedAchievement {
  key: string
  name: string
  description: string
  icon: string
  xpReward: number
}

/**
 * Checks all achievement conditions, inserts newly unlocked ones,
 * and awards their XP bonuses. Returns list of newly unlocked achievements.
 */
export async function checkAndUnlockAchievements(): Promise<UnlockedAchievement[]> {
  try {
    // Get already-unlocked keys
    const existing = await db.achievement.findMany({ select: { key: true } })
    const unlockedKeys = new Set(existing.map((a) => a.key))

    const newlyUnlocked: UnlockedAchievement[] = []

    for (const def of ACHIEVEMENT_DEFS) {
      if (unlockedKeys.has(def.key)) continue

      const met = await def.check()
      if (!met) continue

      // Unlock it
      await db.achievement.create({
        data: {
          key: def.key,
          name: def.name,
          description: def.description,
          icon: def.icon,
          xpReward: def.xpReward,
        },
      })

      // Award bonus XP (if any)
      if (def.xpReward > 0) {
        await awardXP(def.xpReward, `achievement:${def.key}`)
      }

      newlyUnlocked.push({
        key: def.key,
        name: def.name,
        description: def.description,
        icon: def.icon,
        xpReward: def.xpReward,
      })
    }

    return newlyUnlocked
  } catch {
    return []
  }
}
