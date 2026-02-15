'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { HabitCompletion } from '@prisma/client'

interface HabitCalendarProps {
  completions: HabitCompletion[]
}

export function HabitCalendar({ completions }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const isCompleted = (day: Date) => {
    return completions.some((completion) =>
      isSameDay(new Date(completion.date), day)
    )
  }

  const isCurrentMonth = (day: Date) => {
    return day >= monthStart && day <= monthEnd
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day labels */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground pb-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const completed = isCompleted(day)
            const inCurrentMonth = isCurrentMonth(day)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-md text-sm transition-colors',
                  inCurrentMonth
                    ? 'text-foreground'
                    : 'text-muted-foreground opacity-50',
                  completed && 'bg-primary text-primary-foreground font-medium',
                  !completed && inCurrentMonth && 'hover:bg-muted',
                  isToday && !completed && 'border-2 border-primary'
                )}
              >
                {format(day, 'd')}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
