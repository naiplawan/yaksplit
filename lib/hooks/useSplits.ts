'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Split } from '@/types'

// API functions
async function fetchSplitQR(id: string) {
  const response = await fetch(`/api/splits/${id}/qr`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate QR code')
  }
  const data = await response.json()
  return data.data
}

async function updateSplit({ id, amount }: { id: string; amount?: number }): Promise<void> {
  const response = await fetch(`/api/splits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount_paid: amount }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update split')
  }
}

async function recordPayment({
  splitId,
  amount,
  paymentMethod,
  referenceId,
}: {
  splitId: string
  amount: number
  paymentMethod: 'promptpay' | 'cash' | 'transfer' | 'other'
  referenceId?: string
}) {
  const response = await fetch(`/api/splits/${splitId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      split_id: splitId,
      amount,
      payment_method: paymentMethod,
      reference_id: referenceId,
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to record payment')
  }
  const data = await response.json()
  return data.data
}

// Hooks
export function useSplitQR(id: string) {
  return useQuery({
    queryKey: ['splits', id, 'qr'],
    queryFn: () => fetchSplitQR(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes - QR doesn't change frequently
  })
}

export function useUpdateSplit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSplit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['splits'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function useMarkAsPaid() {
  const queryClient = useQueryClient()
  const updateSplitMutation = useUpdateSplit()

  return useMutation({
    mutationFn: async (splitId: string) => {
      await updateSplitMutation.mutateAsync({ id: splitId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['splits'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['splits'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function usePendingPayments(memberId: string) {
  return useQuery({
    queryKey: ['payments', 'pending', memberId],
    queryFn: async () => {
      const response = await fetch(`/api/members/${memberId}/payments`)
      if (!response.ok) {
        throw new Error('Failed to fetch pending payments')
      }
      const data = await response.json()
      return data.data
    },
    enabled: !!memberId,
  })
}
