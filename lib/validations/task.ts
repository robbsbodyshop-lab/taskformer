import { z } from 'zod'

const taskBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.coerce.date().optional(),
  reminderAt: z.coerce.date().optional(),
  categoryId: z.string().cuid().optional(),
  completed: z.boolean().default(false),
})

export const taskSchema = taskBaseSchema
  .refine(
    (data) => {
      if (data.reminderAt && data.dueDate) {
        return data.reminderAt < data.dueDate
      }
      return true
    },
    { message: 'Reminder must be before due date', path: ['reminderAt'] }
  )

export type TaskInput = z.infer<typeof taskSchema>

export const createTaskSchema = taskBaseSchema.omit({ completed: true }).refine(
  (data) => {
    if (data.reminderAt && data.dueDate) {
      return data.reminderAt < data.dueDate
    }
    return true
  },
  { message: 'Reminder must be before due date', path: ['reminderAt'] }
)

export const updateTaskSchema = taskBaseSchema.partial().refine(
  (data) => {
    if (data.reminderAt && data.dueDate) {
      return data.reminderAt < data.dueDate
    }
    return true
  },
  { message: 'Reminder must be before due date', path: ['reminderAt'] }
)
