'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEvent } from '@/lib/hooks/useEvents'
import { useCreateExpense } from '@/lib/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/Container'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type SplitType = 'equal' | 'custom' | 'percentage'

export default function NewExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState('')
  const [splitType, setSplitType] = useState<SplitType>('equal')
  const [notes, setNotes] = useState('')

  Promise.resolve(params).then((p) => setResolvedParams(p))

  const eventId = resolvedParams?.id || ''
  const { data: event, isLoading } = useEvent(eventId)
  const createExpense = useCreateExpense()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !amount || !payerId || !eventId) {
      return
    }

    try {
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return
      }

      await createExpense.mutateAsync({
        event_id: eventId,
        title: title.trim(),
        amount: amountNum,
        payer_member_id: payerId,
        split_type: splitType,
        notes: notes.trim() || undefined,
      })

      router.push(`/events/${eventId}`)
    } catch (error) {
      console.error('Failed to create expense:', error)
    }
  }

  if (!resolvedParams || isLoading) {
    return (
      <Container>
        <div className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </Container>
    )
  }

  if (!event) {
    return (
      <Container>
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </Container>
    )
  }

  return (
    <Container size="md">
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/events/${eventId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Expense</h1>
            <p className="text-muted-foreground">{event.title}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Dinner at Som Tum Nua"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (THB) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payer">Paid by *</Label>
                <Select value={payerId} onValueChange={setPayerId} required>
                  <SelectTrigger id="payer">
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {event.members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.nickname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this expense..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={splitType} onValueChange={(v) => setSplitType(v as SplitType)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="equal" id="equal" />
                    <Label htmlFor="equal" className="flex-1 cursor-pointer">
                      <div className="font-medium">Split Equally</div>
                      <div className="text-sm text-muted-foreground">
                        Divide equally among all members
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex-1 cursor-pointer">
                      <div className="font-medium">Custom Amounts</div>
                      <div className="text-sm text-muted-foreground">
                        Set specific amounts for each member
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex-1 cursor-pointer">
                      <div className="font-medium">By Percentage</div>
                      <div className="text-sm text-muted-foreground">
                        Split by percentage shares
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Split Preview */}
          {amount && (
            <Card>
              <CardHeader>
                <CardTitle>Split Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.members.map((member) => {
                    const splitAmount = splitType === 'equal'
                      ? parseFloat(amount || '0') / event.members.length
                      : 0

                    return (
                      <div key={member.id} className="flex justify-between py-1">
                        <span>{member.nickname}</span>
                        <span className="font-medium">
                          {splitAmount > 0
                            ? new Intl.NumberFormat('th-TH', {
                                style: 'currency',
                                currency: 'THB',
                              }).format(splitAmount)
                            : '-'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href={`/events/${eventId}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createExpense.isPending || !title.trim() || !amount || !payerId}
            >
              {createExpense.isPending ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
