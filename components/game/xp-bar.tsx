'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface XPBarProps {
  currentXP: number
  xpToNextLevel: number
  level: number
  title: string
  /** Compact mode for header, full mode for dashboard */
  variant?: 'compact' | 'full'
  className?: string
}

export function XPBar({
  currentXP,
  xpToNextLevel,
  level,
  title,
  variant = 'full',
  className,
}: XPBarProps) {
  const progress = Math.min((currentXP / xpToNextLevel) * 100, 100)

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[60px]">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {currentXP}/{xpToNextLevel}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Level {level}</span>
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentXP} / {xpToNextLevel} XP
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-chart-1"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
