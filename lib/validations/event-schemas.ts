import { z } from 'zod'

// Thai phone number validation - 10 digits starting with 0
const thaiPhoneSchema = z
  .string()
  .regex(/^0\d{9}$/, 'Invalid Thai phone number. Must be 10 digits starting with 0.')
  .or(z.literal(''))

// PromptPay ID validation - 13 digits
const promptpayIdSchema = z
  .string()
  .regex(/^\d{13}$/, 'Invalid PromptPay ID. Must be 13 digits.')
  .or(z.literal(''))

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  members: z
    .array(
      z.object({
        nickname: z
          .string()
          .min(1, 'Nickname is required')
          .max(100, 'Nickname must be less than 100 characters'),
        phone: thaiPhoneSchema.optional(),
        promptpay_id: promptpayIdSchema.optional(),
      })
    )
    .min(1, 'At least one member is required')
    .max(50, 'Cannot have more than 50 members'),
})

export const updateEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['active', 'archived', 'completed']).optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
})

export const addMemberSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(100, 'Nickname must be less than 100 characters'),
  phone: thaiPhoneSchema.optional(),
  promptpay_id: promptpayIdSchema.optional(),
  role: z.enum(['creator', 'admin', 'member']).optional(),
})

export const updateMemberSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(100, 'Nickname must be less than 100 characters')
    .optional(),
  phone: thaiPhoneSchema.optional(),
  promptpay_id: promptpayIdSchema.optional(),
  role: z.enum(['admin', 'member']).optional(),
})

export const shareCodeSchema = z.object({
  code: z.string().length(6, 'Share code must be 6 characters'),
})

// Export types
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
