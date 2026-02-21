'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateEvent } from '@/lib/hooks/useEvents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/Container'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, X } from 'lucide-react'
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
    <Container size="md">
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Set up a new bill split</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Friday Dinner, Chiang Mai Trip"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add some details about this event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Members</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addMember}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((member, index) => (
                <div key={member.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <Input
                      placeholder="Name"
                      value={member.nickname}
                      onChange={(e) => updateMember(member.id, 'nickname', e.target.value)}
                      className="flex-1"
                      required
                    />
                    {members.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Phone (optional)"
                      value={member.phone || ''}
                      onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    />
                    <Input
                      placeholder="PromptPay ID (optional)"
                      value={member.promptpay_id || ''}
                      onChange={(e) => updateMember(member.id, 'promptpay_id', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href="/events">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createEvent.isPending || !title.trim()}
            >
              {createEvent.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
