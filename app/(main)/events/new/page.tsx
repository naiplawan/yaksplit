'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateEvent } from '@/lib/hooks/useEvents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/layout/Container'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, X, Users } from 'lucide-react'
import Link from 'next/link'

interface MemberInput {
  id: string
  nickname: string
  phone?: string
  promptpay_id?: string
}

export default function NewEventPage() {
  const router = useRouter()
  const createEvent = useCreateEvent()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [members, setMembers] = useState<MemberInput[]>([
    { id: '1', nickname: 'Me' },
  ])

  const addMember = () => {
    setMembers([...members, { id: Date.now().toString(), nickname: '' }])
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id))
    }
  }

  const updateMember = (id: string, field: keyof MemberInput, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    const validMembers = members.filter((m) => m.nickname.trim())

    if (validMembers.length === 0) {
      return
    }

    try {
      const result = await createEvent.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        members: validMembers.map((m) => ({
          nickname: m.nickname.trim(),
          phone: m.phone?.trim(),
          promptpay_id: m.promptpay_id?.trim(),
        })),
      })

      router.push(`/events/${result.id}`)
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[rgb(var(--color-text))]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[rgb(var(--color-text))]">
              Create New Event
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Set up a new bill split
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Details Card */}
          <div className="card-mobile p-5 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[rgb(var(--color-primary))]/10 flex items-center justify-center">
                <span className="text-[rgb(var(--color-primary))] font-bold text-sm">
                  1
                </span>
              </div>
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                Event Details
              </h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-[rgb(var(--color-text))]">
                Event Title <span className="text-[rgb(var(--color-error))]">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Friday Dinner, Chiang Mai Trip"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-[rgb(var(--color-text))]">
                Description <span className="text-[rgb(var(--color-text-tertiary))]">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Add some details about this event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Members Card */}
          <div className="card-mobile p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[rgb(var(--color-accent))]/10 flex items-center justify-center">
                  <span className="text-[rgb(var(--color-accent))] font-bold text-sm">
                    2
                  </span>
                </div>
                <h2 className="font-semibold text-[rgb(var(--color-text))]">
                  Members ({members.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="h-10 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white text-sm font-medium touch-feedback active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-[rgb(var(--color-bg-alt))] border border-[rgb(var(--color-border-light))] space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[rgb(var(--color-primary))]">
                        {index + 1}
                      </span>
                    </div>
                    <Input
                      placeholder="Name"
                      value={member.nickname}
                      onChange={(e) => updateMember(member.id, 'nickname', e.target.value)}
                      className="flex-1 h-11"
                      required
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="h-11 w-11 rounded-xl bg-[rgb(var(--color-bg))]/50 flex items-center justify-center touch-feedback active:scale-95 transition-all border border-[rgb(var(--color-border-light))]"
                      >
                        <X className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Phone (optional)"
                      value={member.phone || ''}
                      onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                      className="h-11"
                    />
                    <Input
                      placeholder="PromptPay ID (optional)"
                      value={member.promptpay_id || ''}
                      onChange={(e) => updateMember(member.id, 'promptpay_id', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pb-safe">
            <Link href="/events" className="flex-1">
              <button
                type="button"
                className="w-full h-12 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] font-medium touch-feedback active:scale-[0.98] transition-all border border-[rgb(var(--color-border-light))]"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="flex-1 btn-primary h-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createEvent.isPending || !title.trim()}
            >
              {createEvent.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </Container>
  )
}
