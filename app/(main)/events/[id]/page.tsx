'use client'

import { useEvent, useAddMember } from '@/lib/hooks/useEvents'
import { useExpenses as useAllExpenses } from '@/lib/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Plus,
  Users,
  Banknote,
  Share2,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency, formatThaiPhone } from '@/lib/utils/format'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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

  if (eventLoading) {
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
    <Container size="lg">
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={copyShareLink}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/events/${event.id}/settings`}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Expenses</div>
              <div className="text-2xl font-bold">{formatThaiCurrency(totalAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Members</div>
              <div className="text-2xl font-bold">{event.members.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Share Code</div>
              <div className="text-2xl font-bold">{event.share_code}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Members</h2>
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Name</Label>
                      <Input
                        id="member-name"
                        placeholder="Enter name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAddMember}
                      disabled={!newMemberName.trim() || addMember.isPending}
                    >
                      {addMember.isPending ? 'Adding...' : 'Add Member'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {event.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10">
                            {member.nickname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.nickname}</div>
                          {member.promptpay_id && (
                            <div className="text-xs text-muted-foreground">
                              {formatThaiPhone(member.promptpay_id)}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={member.role === 'creator' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <Button size="sm" asChild>
                <Link href={`/events/${event.id}/expenses/new`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Expense
                </Link>
              </Button>
            </div>

            {expensesLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ) : !expenses || expenses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Banknote className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">No expenses yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your first expense to start tracking
                      </p>
                      <Button asChild>
                        <Link href={`/events/${event.id}/expenses/new`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Expense
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <Card key={expense.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{expense.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Paid by {expense.payer?.nickname || 'Unknown'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatThaiCurrency(expense.amount)}</div>
                          <Badge variant="outline" className="text-xs">
                            {expense.split_type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Balances Tab */}
          <TabsContent value="balances" className="space-y-4">
            <h2 className="text-xl font-semibold">Member Balances</h2>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {memberBalances.map((member) => {
                    const isPaid = member.balance <= 0
                    const isPartial = member.balance > 0 && member.totalPaid > 0

                    return (
                      <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10">
                              {member.nickname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.nickname}</div>
                            <div className="text-sm text-muted-foreground">
                              Owed: {formatThaiCurrency(member.totalOwed)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${isPaid ? 'text-green-600' : isPartial ? 'text-yellow-600' : 'text-red-600'}`}>
                            {member.balance > 0 ? formatThaiCurrency(member.balance) : 'Paid'}
                          </div>
                          {isPartial && (
                            <div className="text-xs text-muted-foreground">
                              {formatThaiCurrency(member.totalPaid)} paid
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
