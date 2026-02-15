import { format, formatDistance, isPast, isToday, isTomorrow, isYesterday } from 'date-fns'

/**
 * Format a date for display
 * @param date - Date to format
 * @param formatStr - Optional format string (defaults to 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date | null | undefined, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return ''
  return format(new Date(date), formatStr)
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to format
 * @returns Relative date string
 */
export function formatRelativeDate(date: Date | null | undefined): string {
  if (!date) return ''
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

/**
 * Get a human-readable date description
 * @param date - Date to describe
 * @returns Human-readable description (e.g., "Today", "Tomorrow", "Yesterday", or formatted date)
 */
export function getDateDescription(date: Date | null | undefined): string {
  if (!date) return ''

  const dateObj = new Date(date)

  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  if (isYesterday(dateObj)) return 'Yesterday'

  return formatDate(dateObj)
}

/**
 * Check if a date is overdue
 * @param date - Date to check
 * @returns true if the date is in the past
 */
export function isOverdue(date: Date | null | undefined): boolean {
  if (!date) return false
  return isPast(new Date(date)) && !isToday(new Date(date))
}

/**
 * Get date string for database storage (YYYY-MM-DD)
 * @param date - Date to convert
 * @returns ISO date string
 */
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Get the start of today (midnight)
 * @returns Date object at start of today
 */
export function getToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}
