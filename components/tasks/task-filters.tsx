'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { Priority } from '@prisma/client'
import { Category } from '@prisma/client'

export interface TaskFilterState {
  completed?: boolean
  priority?: Priority
  categoryId?: string
  search?: string
}

interface TaskFiltersProps {
  filters: TaskFilterState
  onFiltersChange: (filters: TaskFilterState) => void
  categories: Category[]
}

export function TaskFilters({ filters, onFiltersChange, categories }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '')

  const handleCompletionChange = (value: string) => {
    const completed = value === 'all' ? undefined : value === 'completed'
    onFiltersChange({ ...filters, completed })
  }

  const handlePriorityChange = (value: string) => {
    const priority = value === 'all' ? undefined : (value as Priority)
    onFiltersChange({ ...filters, priority })
  }

  const handleCategoryChange = (value: string) => {
    const categoryId = value === 'all' ? undefined : value
    onFiltersChange({ ...filters, categoryId })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, search: searchInput || undefined })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    onFiltersChange({})
  }

  const hasActiveFilters = filters.completed !== undefined || filters.priority || filters.categoryId || filters.search

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your task list</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Completion Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <RadioGroup
            value={
              filters.completed === undefined
                ? 'all'
                : filters.completed
                ? 'completed'
                : 'active'
            }
            onValueChange={handleCompletionChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                All Tasks
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active" className="font-normal cursor-pointer">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="font-normal cursor-pointer">
                Completed
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
