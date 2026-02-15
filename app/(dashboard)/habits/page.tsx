'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { HabitCard } from '@/components/habits/habit-card'
import { HabitForm } from '@/components/habits/habit-form'
import type { HabitWithCompletions } from '@/lib/queries/habits'
import type { Category } from '@prisma/client'

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitWithCompletions[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletions | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  const fetchJson = async <T,>(url: string, fallback: T): Promise<T> => {
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) return fallback
      return (await response.json()) as T
    } catch {
      return fallback
    }
  }

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [habitsData, categoriesData] = await Promise.all([
        fetchJson<HabitWithCompletions[]>('/api/habits', []),
        fetchJson<Category[]>('/api/categories', []),
      ])
      setHabits(habitsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateHabit = () => {
    setEditingHabit(undefined)
    setIsFormOpen(true)
  }

  const handleEditHabit = (habit: HabitWithCompletions) => {
    setEditingHabit(habit)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingHabit(undefined)
    void loadData()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground">
            Track your daily and weekly habits
          </p>
        </div>
        <Button onClick={handleCreateHabit}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading habits...
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No habits found</p>
            <p className="text-sm">Create your first habit to start tracking!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
              </p>
            </div>
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={handleEditHabit}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <HabitForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        habit={editingHabit}
        categories={categories}
      />
    </div>
  )
}
