'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import type { TaskWithCategory } from '@/lib/queries/tasks'
import { toggleTaskCompletion, deleteTask } from '@/app/(dashboard)/tasks/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useGame } from '@/lib/contexts/game-context'
import { getTaskXP } from '@/lib/utils/xp'
import { TurtleRoleBadge } from '@/components/game/turtle-role-badge'
import { useTurtle } from '@/lib/contexts/turtle-context'

interface TaskCardProps {
  task: TaskWithCategory
  onEdit?: (task: TaskWithCategory) => void
}

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const { handleGameReward } = useGame()
  const { getDialogue } = useTurtle()

  const handleToggleCompletion = async () => {
    setIsToggling(true)
    const result = await toggleTaskCompletion(task.id)
    setIsToggling(false)

    if (result.success) {
      // Use turtle-voiced dialogue for completion toast
      const message = task.completed
        ? 'Task marked as incomplete'
        : getDialogue('taskComplete') || 'Task completed!'
      toast.success(message)

      // Trigger game rewards if completing
      if (!task.completed && result.xp) {
        setShowXP(true)
        setTimeout(() => setShowXP(false), 1500)
        handleGameReward(result.xp, result.newAchievements)
      }
    } else {
      toast.error(result.error || 'Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setIsDeleting(true)
    const result = await deleteTask(task.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Task deleted')
    } else {
      toast.error(result.error || 'Failed to delete task')
    }
  }

  const getDueDateLabel = () => {
    if (!task.dueDate) return null

    const dueDate = new Date(task.dueDate)
    if (isToday(dueDate)) return 'Today'
    if (isTomorrow(dueDate)) return 'Tomorrow'
    if (isPast(dueDate) && !task.completed) return 'Overdue'
    return format(dueDate, 'MMM d, yyyy')
  }

  const dueDateLabel = getDueDateLabel()
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed

  // Theme-based priority colors
  const priorityColorClass = `priority-${task.priority.toLowerCase()}`
  const xpValue = getTaskXP(task.priority)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'relative transition-all hover:shadow-md',
        task.completed && 'opacity-60'
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
              +{xpValue} XP
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center min-h-[44px] min-w-[44px] -m-2 p-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggleCompletion}
                disabled={isToggling}
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className={cn(
                'text-lg',
                task.completed && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  disabled={isDeleting}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="min-h-[44px] min-w-[44px]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(priorityColorClass, 'border-current')}
            >
              {priorityLabels[task.priority]}
            </Badge>

            {/* XP value indicator */}
            {!task.completed && (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                +{xpValue} XP
              </Badge>
            )}

            {/* Turtle role badge */}
            {'turtleRole' in task && typeof (task as unknown as Record<string, string>).turtleRole === 'string' && (
              <TurtleRoleBadge role={(task as unknown as Record<string, string>).turtleRole} />
            )}

            {task.category && (
              <Badge variant="secondary" className="gap-1">
                <FolderKanban className="h-3 w-3" />
                {task.category.name}
              </Badge>
            )}

            {dueDateLabel && (
              <Badge
                variant={isOverdue ? 'destructive' : 'outline'}
                className="gap-1"
              >
                <Calendar className="h-3 w-3" />
                {dueDateLabel}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
