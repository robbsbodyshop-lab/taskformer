import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  icon: z.string().max(50).optional(),
  order: z.number().int().min(0).default(0),
})

export type CategoryInput = z.infer<typeof categorySchema>
