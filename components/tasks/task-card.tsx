'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { TaskWithCategory } from '@/lib/queries/tasks'
import { toggleTaskCompletion, deleteTask } from '@/app/(dashboard)/tasks/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

  const handleToggleCompletion = async () => {
    setIsToggling(true)
    const result = await toggleTaskCompletion(task.id)
    setIsToggling(false)

    if (result.success) {
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!')
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

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      task.completed && 'opacity-60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleCompletion}
            disabled={isToggling}
            className="mt-1"
          />
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
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
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
  )
}
