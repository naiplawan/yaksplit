'use client'

import { useEvent, useAddMember } from '@/lib/hooks/useEvents'
import { useExpenses as useAllExpenses, useCreateExpense } from '@/lib/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  ArrowLeft,
  Plus,
  Users,
  Banknote,
  ChevronRight,
  Copy,
  Check,
  X,
  Share2,
  QrCode,
} from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency, formatRelativeTime } from '@/lib/utils/format'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { MemberList, MemberWithBalance } from '@/components/event/MemberList'
import { ExpenseForm } from '@/components/expense/ExpenseForm'
import { Progress } from '@/components/ui/progress'
import { SkeletonBalanceCard, SkeletonExpenseList } from '@/components/ui/skeleton'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [copied, setCopied] = useState(false)

  Promise.resolve(params).then((p) => setResolvedParams(p))

  const eventId = resolvedParams?.id || ''
  const { data: event, isLoading: eventLoading } = useEvent(eventId)
  const { data: expenses, isLoading: expensesLoading } = useAllExpenses(eventId)
  const addMember = useAddMember()
  const createExpense = useCreateExpense()

  if (!resolvedParams) {
    return null
  }

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !eventId) return

    try {
      await addMember.mutateAsync({
        eventId,
        member: {
          nickname: newMemberName.trim(),
        },
      })
      setNewMemberName('')
      setShowAddMember(false)
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleCreateExpense = async (data: {
    title: string
    amount: number
    payer_member_id: string
    split_type: 'equal' | 'custom' | 'percentage'
    notes?: string
  }) => {
    await createExpense.mutateAsync({
      event_id: eventId,
      ...data,
    })
  }

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${event?.share_code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const memberBalances: MemberWithBalance[] = event?.members.map((member) => {
    const memberSplits = expenses
      ?.flatMap((e) => e.splits)
      .filter((s) => s?.member_id === member.id) || []

    const totalOwed = memberSplits.reduce((sum, s) => sum + (s?.amount_owed || 0), 0)
    const totalPaid = memberSplits.reduce((sum, s) => sum + (s?.amount_paid || 0), 0)
    const balance = totalOwed - totalPaid

    return {
      ...member,
      totalOwed,
      totalPaid,
      balance,
    }
  }) || []

  const totalAmount = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
  const totalPaid = expenses?.reduce((sum, e) => {
    const paidForExpense = e.splits?.reduce((s, split) => s + (split?.amount_paid || 0), 0) || 0
    return sum + paidForExpense
  }, 0) || 0

  if (eventLoading) {
    return (
      <Container>
        <div className="py-6 safe-area-pt space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-[rgb(var(--color-border))] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-[rgb(var(--color-border))] rounded w-32 animate-pulse" />
              <div className="h-4 bg-[rgb(var(--color-border))] rounded w-24 animate-pulse" />
            </div>
          </div>
          <SkeletonBalanceCard />
          <SkeletonExpenseList count={3} />
        </div>
      </Container>
    )
  }

  if (!event) {
    return (
      <Container>
        <div className="py-6 safe-area-pt text-center">
          <p className="text-[rgb(var(--color-text-secondary))]">ไม่พบกิจกรรม</p>
        </div>
      </Container>
    )
  }

  const progressPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0

  return (
    <>
      <Container>
        <div className="py-6 safe-area-pt space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="h-11 w-11 rounded-lg bg-[var(--surface-background-alt)] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5 text-[rgb(var(--color-text))]" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[rgb(var(--color-text))] truncate">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
                  {event.description}
                </p>
              )}
            </div>
            <button
              onClick={copyShareLink}
              className="h-11 w-11 rounded-lg bg-[var(--surface-background-alt)] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
            >
              {copied ? (
                <Check className="h-5 w-5 text-[var(--color-semantic-success-500)]" />
              ) : (
                <Share2 className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
              )}
            </button>
          </div>

          {/* Balance Card */}
          <div className="card-elevated">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
                  ยอดรวมทั้งหมด
                </p>
                <h2 className="text-3xl font-bold text-[rgb(var(--color-text))] tracking-tight">
                  {formatThaiCurrency(totalAmount)}
                </h2>
              </div>
              <Link
                href={`/events/${event.id}/pay`}
                className="h-10 px-4 rounded-lg bg-[var(--color-brand-primary-500)] text-white text-sm font-semibold flex items-center gap-1.5 touch-feedback active:scale-95 transition-transform"
              >
                <span>จ่าย</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Progress */}
            <div className="pt-4 border-t border-[rgb(var(--color-border-light))]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                  ชำระแล้ว {progressPercentage}%
                </span>
                <span className="text-xs font-medium text-[rgb(var(--color-text))]">
                  ฿{totalPaid.toLocaleString()} / ฿{totalAmount.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercentage} size="sm" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
            <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-primary-100)] flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-[var(--color-brand-primary-500)]" />
              </div>
              <div className="text-xl font-bold text-[rgb(var(--color-text))]">
                {event.members.length}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                สมาชิก
              </div>
            </div>
            <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-accent-100)] flex items-center justify-center mx-auto mb-2">
                <Banknote className="h-5 w-5 text-[var(--color-brand-accent-600)]" />
              </div>
              <div className="text-xl font-bold text-[rgb(var(--color-text))]">
                {expenses?.length || 0}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                รายจ่าย
              </div>
            </div>
            <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-secondary-100)] flex items-center justify-center mx-auto mb-2">
                <QrCode className="h-5 w-5 text-[var(--color-brand-secondary-600)]" />
              </div>
              <div className="text-lg font-bold text-[rgb(var(--color-text))] font-mono">
                {event.share_code}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                รหัสแชร์
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-[var(--surface-background-alt)] p-1 rounded-lg">
              <TabsTrigger
                value="expenses"
                className="rounded-md data-[state=active]:bg-[var(--surface-card)] data-[state=active]:text-[rgb(var(--color-text))] data-[state=active]:shadow-sm text-sm"
              >
                รายจ่าย
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="rounded-md data-[state=active]:bg-[var(--surface-card)] data-[state=active]:text-[rgb(var(--color-text))] data-[state=active]:shadow-sm text-sm"
              >
                สมาชิก
              </TabsTrigger>
              <TabsTrigger
                value="balances"
                className="rounded-md data-[state=active]:bg-[var(--surface-card)] data-[state=active]:text-[rgb(var(--color-text))] data-[state=active]:shadow-sm text-sm"
              >
                ยอดคงเหลือ
              </TabsTrigger>
            </TabsList>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[rgb(var(--color-text))]">
                  รายจ่าย ({expenses?.length || 0})
                </h2>
                <Button size="sm" onClick={() => setShowAddExpense(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่ม
                </Button>
              </div>

              {expensesLoading ? (
                <SkeletonExpenseList count={3} />
              ) : !expenses || expenses.length === 0 ? (
                <div className="card-mobile p-8 text-center">
                  <div className="h-14 w-14 rounded-xl bg-[var(--surface-background-alt)] flex items-center justify-center mx-auto mb-4">
                    <Banknote className="h-6 w-6 text-[rgb(var(--color-text-tertiary))]" />
                  </div>
                  <h3 className="font-semibold text-[rgb(var(--color-text))] mb-2">
                    ยังไม่มีรายจ่าย
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
                    เพิ่มรายจ่ายแรกเพื่อเริ่มต้น
                  </p>
                  <Button onClick={() => setShowAddExpense(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มรายจ่าย
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      className="card-interactive p-4 touch-feedback animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-accent-100)] flex items-center justify-center">
                            <Banknote className="h-5 w-5 text-[var(--color-brand-accent-600)]" />
                          </div>
                          <div>
                            <div className="font-medium text-[rgb(var(--color-text))]">
                              {expense.title}
                            </div>
                            <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                              {expense.payer?.nickname || 'ไม่ทราบ'} จ่าย
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[rgb(var(--color-text))]">
                            ฿{expense.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                            {formatRelativeTime(expense.expense_date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[rgb(var(--color-text))]">
                  สมาชิก ({event.members.length})
                </h2>
                <Sheet open={showAddMember} onOpenChange={setShowAddMember}>
                  <SheetTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      เพิ่ม
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="flex flex-row items-center justify-between">
                      <SheetTitle>เพิ่มสมาชิก</SheetTitle>
                      <SheetClose asChild>
                        <button className="h-8 w-8 rounded-lg bg-[var(--surface-background-alt)] flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </button>
                      </SheetClose>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-name">ชื่อ</Label>
                        <Input
                          id="member-name"
                          placeholder="กรอกชื่อ"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          autoFocus
                          className="h-11"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAddMember}
                        disabled={!newMemberName.trim() || addMember.isPending}
                      >
                        {addMember.isPending ? 'กำลังเพิ่ม...' : 'เพิ่มสมาชิก'}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <MemberList members={event.members} />
            </TabsContent>

            {/* Balances Tab */}
            <TabsContent value="balances" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[rgb(var(--color-text))]">
                  ใครค้างเท่าไหร่
                </h2>
              </div>

              <MemberList members={memberBalances} showBalances />
            </TabsContent>
          </Tabs>

          {/* Quick Actions Bottom */}
          <div className="flex items-center gap-3 pb-safe">
            <button
              onClick={copyShareLink}
              className="flex-1 h-11 rounded-lg bg-[var(--surface-background-alt)] text-[rgb(var(--color-text))] font-medium flex items-center justify-center gap-2 touch-feedback active:scale-98 transition-all border border-[rgb(var(--color-border-light))]"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-[var(--color-semantic-success-500)]" />
                  <span className="text-[var(--color-semantic-success-500)]">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>แชร์ลิงก์</span>
                </>
              )}
            </button>
            <Button
              className="flex-1 h-11"
              onClick={() => setShowAddExpense(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              เพิ่มรายจ่าย
            </Button>
          </div>
        </div>
      </Container>

      <ExpenseForm
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        eventId={eventId}
        members={event.members}
        onSubmit={handleCreateExpense}
      />
    </>
  )
}
