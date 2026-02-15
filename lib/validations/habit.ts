import { z } from 'zod'

export const habitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'CUSTOM']).default('DAILY'),
  targetDays: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').default('#3b82f6'),
  categoryId: z.string().cuid().optional(),
  archived: z.boolean().default(false),
})

export const habitCompletionSchema = z.object({
  habitId: z.string().cuid(),
  date: z.coerce.date(),
  note: z.string().max(500, 'Note must be 500 characters or less').optional(),
})

export type HabitInput = z.infer<typeof habitSchema>
export type HabitCompletionInput = z.infer<typeof habitCompletionSchema>
