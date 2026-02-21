'use client'

import { useState } from 'react'
import { useEventByCode } from '@/lib/hooks/useEvents'
import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, QrCode, Download, Share2 } from 'lucide-react'
import { formatThaiCurrency } from '@/lib/utils/format'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import Link from 'next/link'

export default function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null)

  Promise.resolve(params).then((p) => setResolvedParams(p))

  const code = resolvedParams?.code?.toUpperCase() || ''
  const { data: event, isLoading, error } = useEventByCode(code)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const downloadQR = (qrCode: string) => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `promptpay-${code}.png`
    link.click()
  }

  if (!resolvedParams) {
    return null
  }

  if (isLoading) {
    return (
      <Container>
        <div className="py-16 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </Container>
    )
  }

  if (error || !event) {
    return (
      <Container size="sm">
        <div className="py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This share link may be invalid or the event has been deleted.
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </Container>
    )
  }

  // Calculate totals for each member
  const memberTotals = event.members.map((member) => {
    // This would normally come from expense data, but for the share page
    // we'll show a simplified view
    return {
      ...member,
      totalOwed: 0, // Would be calculated from actual splits
      totalPaid: 0,
    }
  })

  return (
    <Container size="md">
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
            <span className="text-3xl">฿</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            {event.description && (
              <p className="text-muted-foreground mt-2">{event.description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-sm">
            Share Code: {event.share_code}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={copyLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button asChild>
            <Link href="/login">
              Join Event
            </Link>
          </Button>
        </div>

        {/* Event Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.members.length} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.created_at).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="members">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="info">Event Info</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Members</CardTitle>
              </CardHeader>
              <CardContent>
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
                              PromptPay: {member.promptpay_id}
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

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About YakSplit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  YakSplit makes it easy to split bills with friends in Bangkok.
                  Generate PromptPay QR codes for each person and settle up in seconds.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <QrCode className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Instant QR Codes</div>
                      <div className="text-xs text-muted-foreground">
                        Scan with any Thai banking app
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">No App Required</div>
                      <div className="text-xs text-muted-foreground">
                        Friends can view and pay without logging in
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Flexible Splitting</div>
                      <div className="text-xs text-muted-foreground">
                        Equal, custom amounts, or percentages
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/login">
                    Create Your Own Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by YakSplit • Made with ใจ in Bangkok 🇹🇭</p>
        </div>
      </div>
    </Container>
  )
}
