'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2, FolderKanban, Flame, Archive } from 'lucide-react'
import { HabitWithCompletions } from '@/lib/queries/habits'
import { deleteHabit, toggleHabitCompletion, toggleHabitArchive } from '@/app/(dashboard)/habits/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { calculateStreak } from '@/lib/utils/streaks'
import { isToday } from 'date-fns'

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

  const streak = calculateStreak(habit, habit.completions)
  const completedToday = habit.completions.some((c) =>
    isToday(new Date(c.completedAt))
  )

  const handleToggleCompletion = async () => {
    setIsToggling(true)
    const result = await toggleHabitCompletion(habit.id)
    setIsToggling(false)

    if (result.success) {
      toast.success(result.completed ? 'Habit completed!' : 'Completion removed')
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

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      habit.archived && 'opacity-60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completedToday}
            onCheckedChange={handleToggleCompletion}
            disabled={isToggling || habit.archived}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              {habit.name}
              {streak.currentStreak > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {streak.currentStreak}
                </Badge>
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
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleArchive}
              disabled={isDeleting || isArchiving}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isArchiving}
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
  )
}
