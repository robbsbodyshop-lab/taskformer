'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { UnlockedAchievement } from '@/lib/utils/achievements'
import { achievementIconMap } from '@/components/game/achievement-icon'

interface AchievementToastProps {
  achievement: UnlockedAchievement
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const IconComponent = achievementIconMap[achievement.icon]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-24 md:bottom-8 left-1/2 z-[150] -translate-x-1/2"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div
          className="animate-achievement-glow flex items-center gap-3 rounded-xl border-2 border-yellow-500/50 bg-card px-5 py-3 shadow-xl cursor-pointer"
          onClick={onDismiss}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-600">
            {IconComponent ? <IconComponent className="h-5 w-5" /> : <span className="text-lg">🏆</span>}
          </div>
          <div>
            <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">
              Achievement Unlocked!
            </p>
            <p className="font-bold text-sm">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
          </div>
          {achievement.xpReward > 0 && (
            <div className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              +{achievement.xpReward} XP
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
