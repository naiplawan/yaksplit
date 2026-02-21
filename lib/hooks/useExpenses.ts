'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseWithSplits,
} from '@/types'

// API functions
async function fetchExpenses(eventId: string): Promise<ExpenseWithSplits[]> {
  const response = await fetch(`/api/events/${eventId}/expenses`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch expenses')
  }
  const data = await response.json()
  return data.data
}

async function fetchExpense(id: string): Promise<ExpenseWithSplits> {
  const response = await fetch(`/api/expenses/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch expense')
  }
  const data = await response.json()
  return data.data
}

async function createExpense(input: CreateExpenseInput & { event_id: string }): Promise<ExpenseWithSplits> {
  const response = await fetch(`/api/events/${input.event_id}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create expense')
  }
  const data = await response.json()
  return data.data
}

async function updateExpense({ id, input }: { id: string; input: UpdateExpenseInput }): Promise<ExpenseWithSplits> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update expense')
  }
  const data = await response.json()
  return data.data
}

async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete expense')
  }
}

// Hooks
export function useExpenses(eventId: string) {
  return useQuery({
    queryKey: ['expenses', eventId],
    queryFn: () => fetchExpenses(eventId),
    enabled: !!eventId,
  })
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => fetchExpense(id),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.event_id] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.event_id] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expenses', data.id] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}
