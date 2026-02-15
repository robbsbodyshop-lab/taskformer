'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2, FolderKanban, Flame, Archive } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HabitWithCompletions } from '@/lib/queries/habits'
import { deleteHabit, toggleHabitCompletion, toggleHabitArchive } from '@/app/(dashboard)/habits/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { calculateStreak } from '@/lib/utils/streaks'
import { getHabitXP } from '@/lib/utils/xp'
import { isToday } from 'date-fns'
import { useGame } from '@/lib/contexts/game-context'

interface HabitCardProps {
  habit: HabitWithCompletions
  onEdit?: (habit: HabitWithCompletions) => void
}

const frequencyLabels = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  CUSTOM: 'Custom',
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const { handleGameReward } = useGame()

  const streak = calculateStreak(habit, habit.completions)
  const completedToday = habit.completions.some((c) =>
    isToday(new Date(c.completedAt))
  )

  const xpValue = getHabitXP(streak.currentStreak)
  const hasStreakBonus = streak.currentStreak >= 3

  const handleToggleCompletion = async () => {
    setIsToggling(true)
    const result = await toggleHabitCompletion(habit.id)
    setIsToggling(false)

    if (result.success) {
      toast.success(result.completed ? 'Habit completed!' : 'Completion removed')

      // Trigger game rewards if completing
      if (result.completed && result.xp) {
        setShowXP(true)
        setTimeout(() => setShowXP(false), 1500)
        handleGameReward(result.xp, result.newAchievements)
      }
    } else {
      toast.error(result.error || 'Failed to update habit')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit? All completion data will be lost.')) return

    setIsDeleting(true)
    const result = await deleteHabit(habit.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Habit deleted')
    } else {
      toast.error(result.error || 'Failed to delete habit')
    }
  }

  const handleToggleArchive = async () => {
    setIsArchiving(true)
    const result = await toggleHabitArchive(habit.id)
    setIsArchiving(false)

    if (result.success) {
      toast.success(habit.archived ? 'Habit restored' : 'Habit archived')
    } else {
      toast.error(result.error || 'Failed to archive habit')
    }
  }

  // Flame size scales with streak
  const flameSize = streak.currentStreak >= 30 ? 'h-5 w-5' :
    streak.currentStreak >= 7 ? 'h-4 w-4' : 'h-3 w-3'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'relative transition-all hover:shadow-md',
        habit.archived && 'opacity-60'
      )}>
        {/* Inline XP gain indicator */}
        <AnimatePresence>
          {showXP && (
            <motion.div
              className="absolute -top-3 right-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              +{xpValue} XP{hasStreakBonus && ' (streak!)'}
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center min-h-[44px] min-w-[44px] -m-2 p-2">
              <Checkbox
                checked={completedToday}
                onCheckedChange={handleToggleCompletion}
                disabled={isToggling || habit.archived}
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                {habit.name}
                {streak.currentStreak > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Badge variant="secondary" className="gap-1">
                      <Flame className={cn(flameSize, 'text-orange-500')} />
                      {streak.currentStreak}
                    </Badge>
                  </motion.div>
                )}
                {hasStreakBonus && (
                  <span className="text-[10px] font-medium text-orange-500">
                    Streak bonus!
                  </span>
                )}
              </CardTitle>
              {habit.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {habit.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(habit)}
                  disabled={isDeleting || isArchiving}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleArchive}
                disabled={isDeleting || isArchiving}
                className="min-h-[44px] min-w-[44px]"
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting || isArchiving}
                className="min-h-[44px] min-w-[44px]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {frequencyLabels[habit.frequency]}
            </Badge>

            {/* XP value indicator */}
            {!completedToday && !habit.archived && (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                +{xpValue} XP
              </Badge>
            )}

            {habit.category && (
              <Badge variant="secondary" className="gap-1">
                <FolderKanban className="h-3 w-3" />
                {habit.category.name}
              </Badge>
            )}

            {streak.longestStreak > 0 && (
              <Badge variant="outline" className="gap-1">
                Best: {streak.longestStreak} days
              </Badge>
            )}

            {habit.archived && (
              <Badge variant="secondary">
                Archived
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
