'use client'

import { useState } from 'react'
import { useEventByCode } from '@/lib/hooks/useEvents'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, QrCode, Share2, Crown, Sparkles } from 'lucide-react'
import { formatThaiCurrency } from '@/lib/utils/format'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

export default function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null)

  Promise.resolve(params).then((p) => setResolvedParams(p))

  const code = resolvedParams?.code?.toUpperCase() || ''
  const { data: event, isLoading, error } = useEventByCode(code)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  if (!resolvedParams) {
    return null
  }

  if (isLoading) {
    return (
      <Container>
        <div className="py-16 safe-area-pt flex justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[rgb(var(--color-border))]"></div>
            <div className="h-6 w-32 rounded-full bg-[rgb(var(--color-border))]"></div>
          </div>
        </div>
      </Container>
    )
  }

  if (error || !event) {
    return (
      <Container>
        <div className="py-16 safe-area-pt text-center">
          <div className="h-20 w-20 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center mx-auto mb-6">
            <QrCode className="h-10 w-10 text-[rgb(var(--color-text-tertiary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
            Event Not Found
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))] mb-8 px-4">
            This share link may be invalid or the event has been deleted.
          </p>
          <Link href="/">
            <button className="btn-primary">
              Go to YakSplit
            </button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/10">
            <span className="text-3xl">฿</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-[rgb(var(--color-text-secondary))] mt-2">
                {event.description}
              </p>
            )}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-bg-alt))]">
            <QrCode className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <span className="font-mono font-semibold text-[rgb(var(--color-primary))]">
              {event.share_code}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
            <Users className="h-4 w-4" />
            <span>{event.members.length} members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.created_at).toLocaleDateString('th-TH')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="flex-1 h-12 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] font-medium flex items-center justify-center gap-2 touch-feedback active:scale-[0.98] transition-all border border-[rgb(var(--color-border-light))]"
          >
            <Share2 className="h-5 w-5" />
            <span>Copy Link</span>
          </button>
          <Link href="/login" className="flex-1">
            <button className="btn-primary h-12 w-full">
              Join Event
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-[rgb(var(--color-bg-alt))] p-1 rounded-xl">
            <TabsTrigger
              value="members"
              className="rounded-lg data-[state=active]:bg-[rgb(var(--color-bg))] data-[state=active]:text-[rgb(var(--color-primary))] data-[state=active]:shadow-sm"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="rounded-lg data-[state=active]:bg-[rgb(var(--color-bg))] data-[state=active]:text-[rgb(var(--color-primary))] data-[state=active]:shadow-sm"
            >
              About
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
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
                          PromptPay connected
                        </div>
                      )}
                    </div>
                  </div>
                  {member.role === 'creator' && (
                    <span className="px-2 py-1 rounded-full bg-[rgb(var(--color-secondary))]/20 text-[rgb(var(--color-secondary))] text-xs font-medium">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <div className="card-mobile p-5 space-y-4">
              <div className="text-center pb-4 border-b border-[rgb(var(--color-border-light))]">
                <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-[rgb(var(--color-primary))]" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text))]">
                  What is YakSplit?
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">
                  The easiest way to split bills with friends in Bangkok
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[rgb(var(--color-primary))]/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text))] text-sm">
                      Instant QR Codes
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                      Scan with K Plus, SCB Easy, or any Thai banking app
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text))] text-sm">
                      No App Required
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                      Friends can view and pay without logging in
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[rgb(var(--color-secondary))]/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text))] text-sm">
                      Flexible Splitting
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                      Equal split, custom amounts, or percentages
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/login">
                <button className="btn-primary w-full py-3 mt-4">
                  Create Your Own Event
                </button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-[rgb(var(--color-text-tertiary))] py-4">
          <p>Powered by YakSplit • Made with ใจ in Bangkok 🇹🇭</p>
        </div>
      </div>
    </Container>
  )
}
