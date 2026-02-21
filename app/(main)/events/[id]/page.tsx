'use client'

import { useEvent, useAddMember } from '@/lib/hooks/useEvents'
import { useExpenses as useAllExpenses } from '@/lib/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  ArrowLeft,
  Plus,
  Users,
  Banknote,
  Share2,
  Settings,
  ChevronRight,
  Copy,
  Check,
  Crown,
} from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency, formatThaiPhone } from '@/lib/utils/format'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')

  // Wait for params to resolve
  Promise.resolve(params).then((p) => setResolvedParams(p))

  const eventId = resolvedParams?.id || ''
  const { data: event, isLoading: eventLoading } = useEvent(eventId)
  const { data: expenses, isLoading: expensesLoading } = useAllExpenses(eventId)
  const addMember = useAddMember()

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

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${event?.share_code}`
    navigator.clipboard.writeText(url)
  }

  // Calculate balances
  const memberBalances = event?.members.map((member) => {
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
  const totalOwedAll = memberBalances.reduce((sum, m) => sum + m.balance, 0)

  if (eventLoading) {
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
            href="/events"
            className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
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
          <Link
            href={`/events/${event.id}/pay`}
            className="h-10 px-4 rounded-full bg-[rgb(var(--color-primary))] text-white text-sm font-medium flex items-center gap-1.5 touch-feedback active:scale-95 transition-transform shadow-lg shadow-[rgb(var(--color-primary))]/30"
          >
            <span>Pay</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
            <Banknote className="h-5 w-5 text-[rgb(var(--color-primary))] mx-auto mb-1.5" />
            <div className="text-xl font-bold text-[rgb(var(--color-text))]">
              {formatThaiCurrency(totalAmount)}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Total
            </div>
          </div>
          <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
            <Users className="h-5 w-5 text-[rgb(var(--color-accent))] mx-auto mb-1.5" />
            <div className="text-xl font-bold text-[rgb(var(--color-text))]">
              {event.members.length}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Members
            </div>
          </div>
          <div className="flex-shrink-0 w-28 card-mobile p-3 text-center">
            <div className="h-5 w-5 text-[rgb(var(--color-secondary))] mx-auto mb-1.5 flex items-center justify-center font-mono font-bold text-sm">
              {event.share_code}
            </div>
            <div className="text-xl font-bold text-[rgb(var(--color-text))] mt-1.5">
              {expenses?.length || 0}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Expenses
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-[rgb(var(--color-bg-alt))] p-1 rounded-xl">
            <TabsTrigger
              value="members"
              className="rounded-lg data-[state=active]:bg-[rgb(var(--color-bg))] data-[state=active]:text-[rgb(var(--color-primary))] data-[state=active]:shadow-sm"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="rounded-lg data-[state=active]:bg-[rgb(var(--color-bg))] data-[state=active]:text-[rgb(var(--color-primary))] data-[state=active]:shadow-sm"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="balances"
              className="rounded-lg data-[state=active]:bg-[rgb(var(--color-bg))] data-[state=active]:text-[rgb(var(--color-primary))] data-[state=active]:shadow-sm"
            >
              Balances
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                Members ({event.members.length})
              </h2>
              <Sheet open={showAddMember} onOpenChange={setShowAddMember}>
                <SheetTrigger asChild>
                  <button className="h-10 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white text-sm font-medium touch-feedback active:scale-95 transition-all">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                  <SheetHeader>
                    <SheetTitle>Add Member</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Name</Label>
                      <Input
                        id="member-name"
                        placeholder="Enter name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button
                      className="btn-primary w-full py-3"
                      onClick={handleAddMember}
                      disabled={!newMemberName.trim() || addMember.isPending}
                    >
                      {addMember.isPending ? 'Adding...' : 'Add Member'}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="space-y-3">
              {event.members.map((member) => (
                <div
                  key={member.id}
                  className="card-mobile p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-sm font-medium">
                        {member.nickname.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text))] flex items-center gap-2">
                        {member.nickname}
                        {member.role === 'creator' && (
                          <Crown className="h-3.5 w-3.5 text-[rgb(var(--color-secondary))]" />
                        )}
                      </div>
                      {member.promptpay_id && (
                        <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                          {formatThaiPhone(member.promptpay_id)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                Expenses ({expenses?.length || 0})
              </h2>
              <Link href={`/events/${event.id}/expenses/new`}>
                <button className="h-10 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white text-sm font-medium touch-feedback active:scale-95 transition-all">
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add
                </button>
              </Link>
            </div>

            {expensesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse h-8 w-8 rounded-full bg-[rgb(var(--color-border))]"></div>
              </div>
            ) : !expenses || expenses.length === 0 ? (
              <div className="card-mobile p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center mx-auto mb-4">
                  <Banknote className="h-7 w-7 text-[rgb(var(--color-text-tertiary)]" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-2">
                  No expenses yet
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
                  Add your first expense to start tracking
                </p>
                <Link href={`/events/${event.id}/expenses/new`}>
                  <button className="btn-primary w-full">
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add Expense
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <Link
                    key={expense.id}
                    href="#"
                    className="block card-mobile p-4 touch-feedback active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-[rgb(var(--color-accent))]/10 flex items-center justify-center">
                          <Banknote className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                        </div>
                        <div>
                          <div className="font-medium text-[rgb(var(--color-text))]">
                            {expense.title}
                          </div>
                          <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                            {expense.payer?.nickname || 'Unknown'} paid
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[rgb(var(--color-text))]">
                          {formatThaiCurrency(expense.amount)}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                          {new Date(expense.expense_date).toLocaleDateString('th-TH', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Balances Tab */}
          <TabsContent value="balances" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                Who Owes What
              </h2>
            </div>

            <div className="space-y-3">
              {memberBalances.map((member) => {
                const isPaid = member.balance <= 0
                const isPartial = member.balance > 0 && member.totalPaid > 0

                return (
                  <div
                    key={member.id}
                    className="card-mobile p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback
                          className={`${
                            isPaid
                              ? 'bg-[rgb(var(--color-success))]/10 text-[rgb(var(--color-success))]'
                              : 'bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]'
                          } text-sm font-medium`}
                        >
                          {member.nickname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-[rgb(var(--color-text))] flex items-center gap-2">
                          {member.nickname}
                          {member.role === 'creator' && (
                            <Crown className="h-3.5 w-3.5 text-[rgb(var(--color-secondary))]" />
                          )}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                          Owed: {formatThaiCurrency(member.totalOwed)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isPaid ? (
                        <div className="flex items-center gap-1 text-[rgb(var(--color-success))] font-semibold">
                          <Check className="h-4 w-4" />
                          <span className="text-sm">Paid</span>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`font-bold ${
                              isPartial
                                ? 'text-[rgb(var(--color-warning))]'
                                : 'text-[rgb(var(--color-error))]'
                            }`}
                          >
                            {formatThaiCurrency(member.balance)}
                          </div>
                          {isPartial && (
                            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                              {formatThaiCurrency(member.totalPaid)} paid
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Bottom Sheet */}
        <div className="flex items-center gap-3 pb-safe">
          <button
            onClick={copyShareLink}
            className="flex-1 h-12 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] font-medium flex items-center justify-center gap-2 touch-feedback active:scale-[0.98] transition-all border border-[rgb(var(--color-border-light))]"
          >
            <Copy className="h-5 w-5" />
            <span>Share Link</span>
          </button>
          <Link
            href={`/events/${event.id}/pay`}
            className="flex-1 btn-primary h-12 flex items-center justify-center gap-2"
          >
            <span>Pay Share</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
