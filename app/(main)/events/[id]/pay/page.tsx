'use client'

import { useState } from 'react'
import { useEvent } from '@/lib/hooks/useEvents'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useSplitQR, useMarkAsPaid } from '@/lib/hooks/useSplits'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Copy, QrCode, Download } from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency } from '@/lib/utils/format'
import Image from 'next/image'

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [selectedSplitId, setSelectedSplitId] = useState<string | null>(null)

  Promise.resolve(params).then((p) => setResolvedParams(p))

  const eventId = resolvedParams?.id || ''
  const { data: event, isLoading: eventLoading } = useEvent(eventId)
  const { data: expenses, isLoading: expensesLoading } = useExpenses(eventId)
  const { data: qrData, isLoading: qrLoading } = useSplitQR(selectedSplitId || '')
  const markAsPaid = useMarkAsPaid()

  // Get all splits for the current user (non-paid splits)
  const pendingSplits = expenses
    ?.flatMap((expense) =>
      expense.splits
        ?.filter((s) => s.status !== 'paid' && s.amount_owed > s.amount_paid)
        .map((s) => ({
          ...s,
          expense_title: expense.title,
          expense_date: expense.expense_date,
          payer: expense.payer,
        }))
    )
    .sort((a, b) => new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime()) || []

  // Auto-select first split
  if (!selectedSplitId && pendingSplits.length > 0) {
    setSelectedSplitId(pendingSplits[0].id)
  }

  const selectedSplit = pendingSplits.find((s) => s.id === selectedSplitId)
  const amountOwed = selectedSplit
    ? selectedSplit.amount_owed - selectedSplit.amount_paid
    : 0

  const handleMarkAsPaid = async () => {
    if (!selectedSplitId) return

    try {
      await markAsPaid.mutateAsync(selectedSplitId)
      // Select next split or clear selection
      const nextSplit = pendingSplits.find((s) => s.id !== selectedSplitId && s.status !== 'paid')
      setSelectedSplitId(nextSplit?.id || null)
    } catch (error) {
      console.error('Failed to mark as paid:', error)
    }
  }

  const copyShareLink = () => {
    if (!event) return
    const url = `${window.location.origin}/share/${event.share_code}`
    navigator.clipboard.writeText(url)
  }

  const downloadQR = () => {
    if (!qrData?.qr_code) return

    const link = document.createElement('a')
    link.href = qrData.qr_code
    link.download = `promptpay-${selectedSplitId}.png`
    link.click()
  }

  if (!resolvedParams || eventLoading || expensesLoading) {
    return (
      <Container>
        <div className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
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

  const totalOwed = pendingSplits.reduce((sum, s) => sum + (s.amount_owed - s.amount_paid), 0)

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
            <h1 className="text-2xl font-bold">Pay Your Share</h1>
            <p className="text-muted-foreground">{event.title}</p>
          </div>
        </div>

        {/* Total Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Amount Due</p>
              <p className="text-4xl font-bold text-primary">{formatThaiCurrency(totalOwed)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {pendingSplits.length} expense{pendingSplits.length !== 1 ? 's' : ''} to pay
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        {pendingSplits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">
                You have paid all your shares for this event.
              </p>
              <Button asChild>
                <Link href={`/events/${eventId}`}>Back to Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Split Selector */}
            {pendingSplits.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Expense to Pay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingSplits.map((split) => {
                      const owed = split.amount_owed - split.amount_paid
                      return (
                        <button
                          key={split.id}
                          onClick={() => setSelectedSplitId(split.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedSplitId === split.id
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{split.expense_title}</div>
                              <div className="text-sm text-muted-foreground">
                                Paid by {split.payer?.nickname || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatThaiCurrency(owed)}</div>
                              <Badge variant="outline" className="text-xs">
                                {split.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code Display */}
            {selectedSplit && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">PromptPay QR Code</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={copyShareLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      {qrData?.qr_code && (
                        <Button variant="outline" size="icon" onClick={downloadQR}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {qrLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-pulse h-64 w-64 bg-muted rounded-lg" />
                    </div>
                  ) : qrData?.qr_code ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <Image
                            src={qrData.qr_code}
                            alt="PromptPay QR Code"
                            width={256}
                            height={256}
                            className="w-64 h-64"
                          />
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <p className="text-2xl font-bold">{formatThaiCurrency(amountOwed)}</p>
                        <p className="text-sm text-muted-foreground">
                          Pay to: <span className="font-medium">{qrData.payer_name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {qrData.expense_title}
                        </p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                        <p className="font-medium">How to pay:</p>
                        <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                          <li>Open your banking app (K Plus, SCB Easy, etc.)</li>
                          <li>Scan the QR code above</li>
                          <li>Confirm the payment amount</li>
                          <li>Complete the transfer</li>
                        </ol>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleMarkAsPaid}
                        disabled={markAsPaid.isPending}
                      >
                        {markAsPaid.isPending ? (
                          'Marking...'
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No PromptPay ID set for the payer</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Container>
  )
}
