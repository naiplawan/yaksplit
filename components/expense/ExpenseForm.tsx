'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Banknote, Divide, X } from 'lucide-react'
import { formatThaiCurrency } from '@/lib/utils/format'

type SplitType = 'equal' | 'custom' | 'percentage'

interface ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  members: Array<{ id: string; nickname: string }>
  onSubmit: (data: {
    title: string
    amount: number
    payer_member_id: string
    split_type: SplitType
    notes?: string
  }) => Promise<void>
}

export function ExpenseForm({
  open,
  onOpenChange,
  members,
  onSubmit,
}: ExpenseFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState('')
  const [splitType, setSplitType] = useState<SplitType>('equal')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const amountNum = parseFloat(amount) || 0
  const splitPerPerson = splitType === 'equal' && members.length
    ? amountNum / members.length
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !amount || !payerId) {
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        amount: amountNum,
        payer_member_id: payerId,
        split_type: splitType,
        notes: notes.trim() || undefined,
      })

      // Reset form
      setTitle('')
      setAmount('')
      setPayerId('')
      setSplitType('equal')
      setNotes('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create expense:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>เพิ่มรายจ่าย</SheetTitle>
          <SheetClose asChild>
            <button className="h-8 w-8 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Amount Input - Large */}
          <div className="card-mobile p-6 bg-gradient-to-br from-[rgb(var(--color-secondary))]/20 to-[rgb(var(--color-accent))]/20 border-[rgb(var(--color-secondary))]/30 text-center">
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
              จำนวนเงิน
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
                รายละเอียด
              </h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-[rgb(var(--color-text))]">
                ค่าอะไร? <span className="text-[rgb(var(--color-error))]">*</span>
              </Label>
              <Input
                id="title"
                placeholder="เช่น อาหารเย็นที่ส้มตำนัว"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payer" className="text-sm text-[rgb(var(--color-text))]">
                ใครจ่าย? <span className="text-[rgb(var(--color-error))]">*</span>
              </Label>
              <Select value={payerId} onValueChange={setPayerId} required>
                <SelectTrigger id="payer" className="h-12">
                  <SelectValue placeholder="เลือกคนจ่าย" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.nickname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split Type */}
          <div className="card-mobile p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Divide className="h-5 w-5 text-[rgb(var(--color-accent))]" />
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                แบ่งยังไง?
              </h2>
            </div>

            <div className="space-y-2">
              {[
                { key: 'equal', label: 'แบ่งเท่ากัน', desc: splitPerPerson > 0 ? `${formatThaiCurrency(splitPerPerson)} ต่อคน` : 'หารเท่าๆ กัน' },
                { key: 'custom', label: 'ระบุจำนวน', desc: 'กำหนดเองว่าใครจ่ายเท่าไหร่' },
                { key: 'percentage', label: 'แบ่งตามสัดส่วน', desc: 'หารตามเปอร์เซ็นต์' },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSplitType(option.key as SplitType)}
                  className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all touch-feedback active:scale-[0.99] text-left ${
                    splitType === option.key
                      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                      : 'border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-border))]'
                  }`}
                >
                  <div className="font-medium text-[rgb(var(--color-text))]">{option.label}</div>
                  <div className="text-sm text-[rgb(var(--color-text-secondary))]">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Split Preview */}
          {amountNum > 0 && splitType === 'equal' && (
            <div className="card-mobile p-5 space-y-4">
              <h2 className="font-semibold text-[rgb(var(--color-text))]">
                ตัวอย่างการแบ่ง
              </h2>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border-light))] last:border-0"
                  >
                    <span className="text-[rgb(var(--color-text))]">{member.nickname}</span>
                    <span className="font-semibold text-[rgb(var(--color-text))]">
                      {formatThaiCurrency(splitPerPerson)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !title.trim() || !amount || !payerId}
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกรายจ่าย'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
