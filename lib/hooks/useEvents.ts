'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  CreateEventInput,
  UpdateEventInput,
  EventWithMembers,
} from '@/types'
import type { AddMemberInput } from '@/lib/validations/event-schemas'

// API functions
async function fetchEvents(): Promise<EventWithMembers[]> {
  const response = await fetch('/api/events')
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch events')
  }
  const data = await response.json()
  return data.data
}

async function fetchEvent(id: string): Promise<EventWithMembers> {
  const response = await fetch(`/api/events/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch event')
  }
  const data = await response.json()
  return data.data
}

async function fetchEventByCode(code: string): Promise<EventWithMembers> {
  const response = await fetch(`/api/events/code/${code}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch event')
  }
  const data = await response.json()
  return data.data
}

async function createEvent(input: CreateEventInput): Promise<EventWithMembers> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create event')
  }
  const data = await response.json()
  return data.data
}

async function updateEvent({ id, input }: { id: string; input: UpdateEventInput }): Promise<EventWithMembers> {
  const response = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update event')
  }
  const data = await response.json()
  return data.data
}

async function deleteEvent(id: string): Promise<void> {
  const response = await fetch(`/api/events/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete event')
  }
}

async function addMember({ eventId, member }: { eventId: string; member: AddMemberInput }) {
  const response = await fetch(`/api/events/${eventId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add member')
  }
  const data = await response.json()
  return data.data
}

async function removeMember(memberId: string): Promise<void> {
  const response = await fetch(`/api/events/members/${memberId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove member')
  }
}

// Hooks
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  })
}

export function useEventByCode(code: string) {
  return useQuery({
    queryKey: ['events', 'code', code],
    queryFn: () => fetchEventByCode(code),
    enabled: !!code && code.length === 6,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', data.id] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addMember,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
