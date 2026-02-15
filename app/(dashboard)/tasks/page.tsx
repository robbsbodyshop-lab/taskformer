'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskFilters, TaskFilterState } from '@/components/tasks/task-filters'
import { getTasks } from '@/lib/queries/tasks'
import { getCategories } from '@/lib/queries/categories'
import { TaskWithCategory } from '@/lib/queries/tasks'
import { Category } from '@prisma/client'

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithCategory | undefined>()
  const [filters, setFilters] = useState<TaskFilterState>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        getTasks(filters),
        getCategories(),
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleCreateTask = () => {
    setEditingTask(undefined)
    setIsFormOpen(true)
  }

  const handleEditTask = (task: TaskWithCategory) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTask(undefined)
    void loadData()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay productive
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside>
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
        </aside>

        {/* Tasks List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">Create your first task to get started!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        task={editingTask}
        categories={categories}
      />
    </div>
  )
}
