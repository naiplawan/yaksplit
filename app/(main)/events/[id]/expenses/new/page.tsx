'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEvent } from '@/lib/hooks/useEvents'
import { useCreateExpense } from '@/lib/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/layout/Container'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Banknote, Divide } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatThaiCurrency } from '@/lib/utils/format'

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

  const amountNum = parseFloat(amount) || 0
  const splitPerPerson = splitType === 'equal' && event
    ? amountNum / event.members.length
    : 0

  if (!resolvedParams || isLoading) {
    return (
      <Container>
        <div className="py-4 safe-area-pt">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-[rgb(var(--color-border))] rounded" />
            <div className="h-32 bg-[rgb(var(--color-border))] rounded-2xl" />
          </div>
        </div>
      </Container>
    )
  }

  if (!event) {
    return (
      <Container>
        <div className="py-4 safe-area-pt text-center">
          <p className="text-[rgb(var(--color-text-secondary))]">Event not found</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/events/${eventId}`}
            className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[rgb(var(--color-text))]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[rgb(var(--color-text))]">
              Add Expense
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {event.title}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Display Card */}
          <div className="card-mobile p-6 bg-gradient-to-br from-[rgb(var(--color-secondary))]/20 to-[rgb(var(--color-accent))]/20 border-[rgb(var(--color-secondary))]/30 text-center">
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
              Total Amount
            </p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl font-bold text-[rgb(var(--color-text))]">฿</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 bg-transparent text-4xl font-bold text-[rgb(var(--color-text))] text-center focus:outline-none focus:ring-0 p-0"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Expense Details */}
          <div className="card-mobile p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-[rgb(var(--color-primary))]" />
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                Expense Details
              </h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-[rgb(var(--color-text))]">
                What was this for? <span className="text-[rgb(var(--color-error))]">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Dinner at Som Tum Nua"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payer" className="text-sm text-[rgb(var(--color-text))]">
                Who paid? <span className="text-[rgb(var(--color-error))]">*</span>
              </Label>
              <Select value={payerId} onValueChange={setPayerId} required>
                <SelectTrigger id="payer" className="h-12">
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
              <Label htmlFor="notes" className="text-sm text-[rgb(var(--color-text))]">
                Notes <span className="text-[rgb(var(--color-text-tertiary))]">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this expense..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          {/* Split Type */}
          <div className="card-mobile p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Divide className="h-5 w-5 text-[rgb(var(--color-accent))]" />
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                How to Split?
              </h2>
            </div>

            <RadioGroup value={splitType} onValueChange={(v) => setSplitType(v as SplitType)}>
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all touch-feedback active:scale-[0.99] ${
                    splitType === 'equal'
                      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                      : 'border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-border))]'
                  }`}
                  onClick={() => setSplitType('equal')}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="equal" id="equal" className="mt-1" />
                    <Label htmlFor="equal" className="flex-1 cursor-pointer">
                      <div className="font-medium text-[rgb(var(--color-text))]">Split Equally</div>
                      <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                        ฿{splitPerPerson.toFixed(2)} per person
                      </div>
                    </Label>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all touch-feedback active:scale-[0.99] ${
                    splitType === 'custom'
                      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                      : 'border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-border))]'
                  }`}
                  onClick={() => setSplitType('custom')}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="custom" id="custom" className="mt-1" />
                    <Label htmlFor="custom" className="flex-1 cursor-pointer">
                      <div className="font-medium text-[rgb(var(--color-text))]">Custom Amounts</div>
                      <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Set specific amounts for each member
                      </div>
                    </Label>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all touch-feedback active:scale-[0.99] ${
                    splitType === 'percentage'
                      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                      : 'border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-border))]'
                  }`}
                  onClick={() => setSplitType('percentage')}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="percentage" id="percentage" className="mt-1" />
                    <Label htmlFor="percentage" className="flex-1 cursor-pointer">
                      <div className="font-medium text-[rgb(var(--color-text))]">By Percentage</div>
                      <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Split by percentage shares
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Split Preview */}
          {amountNum > 0 && (
            <div className="card-mobile p-5 space-y-4">
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                Split Preview
              </h2>
              <div className="space-y-3">
                {event.members.map((member) => {
                  const splitAmount = splitType === 'equal'
                    ? amountNum / event.members.length
                    : 0

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border-light))] last:border-0"
                    >
                      <span className="text-[rgb(var(--color-text))]">{member.nickname}</span>
                      <span className="font-semibold text-[rgb(var(--color-text))]">
                        {splitAmount > 0 ? formatThaiCurrency(splitAmount) : '-'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pb-safe">
            <Link href={`/events/${eventId}`} className="flex-1">
              <button
                type="button"
                className="w-full h-12 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] font-medium touch-feedback active:scale-[0.98] transition-all border border-[rgb(var(--color-border-light))]"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="flex-1 btn-primary h-12 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createExpense.isPending || !title.trim() || !amount || !payerId}
            >
              {createExpense.isPending ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Container>
  )
}
