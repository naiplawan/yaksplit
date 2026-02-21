import { z } from 'zod'

export const createExpenseSchema = z.object({
  event_id: z.string().uuid('Invalid event ID'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(500000, 'Amount cannot exceed 500,000 THB'),
  currency: z.string().default('THB'),
  payer_member_id: z.string().uuid('Invalid member ID'),
  receipt_image_url: z.string().url().optional().or(z.literal('')),
  expense_date: z.string().optional(),
  split_type: z.enum(['equal', 'custom', 'percentage'], {
    message: 'Split type is required',
  }),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  splits: z
    .array(
      z.object({
        member_id: z.string().uuid('Invalid member ID'),
        amount_owed: z.number().nonnegative('Amount owed must be non-negative'),
      })
    )
    .optional(),
})

export const updateExpenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(500000, 'Amount cannot exceed 500,000 THB')
    .optional(),
  currency: z.string().optional(),
  payer_member_id: z.string().uuid('Invalid member ID').optional(),
  receipt_image_url: z.string().url().optional().or(z.literal('')),
  expense_date: z.string().optional(),
  split_type: z.enum(['equal', 'custom', 'percentage']).optional(),
  notes: z.string().max(500).optional(),
  splits: z
    .array(
      z.object({
        member_id: z.string().uuid('Invalid member ID'),
        amount_owed: z.number().nonnegative('Amount owed must be non-negative'),
      })
    )
    .optional(),
})

export const updateSplitSchema = z.object({
  amount_paid: z.number().nonnegative('Amount paid must be non-negative').optional(),
  status: z.enum(['pending', 'partial', 'paid']).optional(),
})

export const createPaymentSchema = z.object({
  split_id: z.string().uuid('Invalid split ID'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(500000, 'Amount cannot exceed 500,000 THB'),
  payment_method: z.enum(['promptpay', 'cash', 'transfer', 'other']),
  reference_id: z.string().optional(),
})

export const verifyPaymentSchema = z.object({
  payment_id: z.string().uuid('Invalid payment ID'),
  verified: z.boolean(),
})

export const generateQRSchema = z.object({
  phone: z.union([
    z.string().regex(/^0\d{9}$/, 'Invalid Thai phone number'),
    z.string().regex(/^\d{13}$/, 'Invalid PromptPay ID'),
  ]),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(500000, 'Amount cannot exceed 500,000 THB'),
})

// Export types
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type UpdateSplitInput = z.infer<typeof updateSplitSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
export type GenerateQRInput = z.infer<typeof generateQRSchema>
