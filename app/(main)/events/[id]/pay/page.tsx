'use client'

import { useState } from 'react'
import { useEvent } from '@/lib/hooks/useEvents'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useSplitQR, useMarkAsPaid } from '@/lib/hooks/useSplits'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { ArrowLeft, CheckCircle, Copy, QrCode, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency } from '@/lib/utils/format'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [selectedSplitId, setSelectedSplitId] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

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
        <div className="py-4 safe-area-pt">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-[rgb(var(--color-border))] rounded" />
            <div className="h-64 bg-[rgb(var(--color-border))] rounded-2xl" />
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

  const totalOwed = pendingSplits.reduce((sum, s) => sum + (s.amount_owed - s.amount_paid), 0)

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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[rgb(var(--color-text))]">
              Pay Your Share
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {event.title}
            </p>
          </div>
          <button
            onClick={copyShareLink}
            className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
          >
            <Share2 className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
          </button>
        </div>

        {/* Total Summary Card */}
        <div className="card-mobile p-5 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-accent))]/20 border-[rgb(var(--color-primary))]/30">
          <div className="text-center">
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
              Total Amount Due
            </p>
            <p className="text-4xl font-bold text-[rgb(var(--color-primary))] mb-1">
              {formatThaiCurrency(totalOwed)}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {pendingSplits.length} expense{pendingSplits.length !== 1 ? 's' : ''} to pay
            </p>
          </div>
        </div>

        {/* Payment Content */}
        {pendingSplits.length === 0 ? (
          <div className="card-mobile p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-[rgb(var(--color-success))]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-[rgb(var(--color-success))]" />
            </div>
            <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">
              All Caught Up!
            </h3>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6">
              You have paid all your shares for this event.
            </p>
            <Link href={`/events/${eventId}`}>
              <button className="btn-primary w-full">
                Back to Event
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Expense Selector - Horizontal Scroll */}
            {pendingSplits.length > 1 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-[rgb(var(--color-text-secondary))] px-1">
                  Select Expense to Pay
                </h2>
                <div className="flex gap-3 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
                  {pendingSplits.map((split) => {
                    const owed = split.amount_owed - split.amount_paid
                    const isSelected = selectedSplitId === split.id

                    return (
                      <button
                        key={split.id}
                        onClick={() => setSelectedSplitId(split.id)}
                        className={cn(
                          'flex-shrink-0 w-36 card-mobile p-4 text-left transition-all touch-feedback active:scale-[0.98]',
                          isSelected
                            ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                            : ''
                        )}
                      >
                        <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1 truncate">
                          {split.expense_title}
                        </div>
                        <div className="font-bold text-[rgb(var(--color-text))]">
                          {formatThaiCurrency(owed)}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                          Pay to {split.payer?.nickname || 'Unknown'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* QR Code Display */}
            {selectedSplit && (
              <div className="card-mobile overflow-hidden">
                {/* QR Code Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[rgb(var(--color-text))]">
                      PromptPay QR Code
                    </h2>
                    {qrData?.qr_code && (
                      <button
                        onClick={downloadQR}
                        className="h-9 px-3 rounded-lg bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] text-sm font-medium touch-feedback active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        Save
                      </button>
                    )}
                  </div>

                  {qrLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse h-64 w-64 bg-[rgb(var(--color-border))] rounded-2xl"></div>
                    </div>
                  ) : qrData?.qr_code ? (
                    <div className="space-y-5">
                      {/* QR Code Image */}
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-2xl shadow-xl">
                          <Image
                            src={qrData.qr_code}
                            alt="PromptPay QR Code"
                            width={256}
                            height={256}
                            className="w-56 h-56"
                          />
                        </div>
                      </div>

                      {/* Amount Display */}
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[rgb(var(--color-primary))]">
                          {formatThaiCurrency(amountOwed)}
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                          Pay to{' '}
                          <span className="font-medium text-[rgb(var(--color-text))]">
                            {qrData.payer_name}
                          </span>
                        </p>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-0.5">
                          {qrData.expense_title}
                        </p>
                      </div>

                      {/* Instructions Toggle */}
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="w-full p-4 rounded-xl bg-[rgb(var(--color-bg-alt))] text-left touch-feedback active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[rgb(var(--color-text))] text-sm">
                            How to pay with PromptPay
                          </span>
                          <QrCode className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                        </div>
                      </button>

                      {showInstructions && (
                        <div className="p-4 rounded-xl bg-[rgb(var(--color-bg-alt))] space-y-3">
                          <ol className="space-y-3 text-sm text-[rgb(var(--color-text-secondary))]">
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold">
                                1
                              </span>
                              <span>Open your banking app (K Plus, SCB Easy, etc.)</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold">
                                2
                              </span>
                              <span>Select "Scan QR" or "PromptPay" feature</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold">
                                3
                              </span>
                              <span>Scan the QR code above</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold">
                                4
                              </span>
                              <span>Confirm the payment amount and transfer</span>
                            </li>
                          </ol>
                        </div>
                      )}

                      {/* Mark as Paid Button */}
                      <button
                        className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
                        onClick={handleMarkAsPaid}
                        disabled={markAsPaid.isPending}
                      >
                        {markAsPaid.isPending ? (
                          'Marking...'
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            Mark as Paid
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center mx-auto mb-4">
                        <QrCode className="h-8 w-8 text-[rgb(var(--color-text-tertiary)]" />
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        No PromptPay ID set for the payer
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}
