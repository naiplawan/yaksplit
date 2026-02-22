'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Container } from '@/components/layout/Container'
import {
  Plus,
  QrCode,
  History,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { EventCard } from '@/components/event/EventCard'
import { EmptyState } from '@/components/common/EmptyState'
import { SkeletonDashboard } from '@/components/ui/skeleton'
import { Amount, AmountBalance } from '@/components/ui/amount'
import { formatThaiCurrency, formatRelativeTime } from '@/lib/utils/format'

export default function DashboardPage() {
  const { data: events, isLoading, error } = useEvents()

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const completedEvents = events?.filter((e) => e.status === 'completed') || []
  const totalMembers = events?.reduce((sum, e) => sum + (e.members?.length || 0), 0) || 0

  // Calculate mock balance (in real app, this would come from the backend)
  const mockBalance = {
    owed: 1250, // Money owed to you
    owing: 350, // Money you owe
  }
  const netBalance = mockBalance.owed - mockBalance.owing

  if (isLoading) {
    return (
      <Container>
        <div className="py-4 safe-area-pt">
          <SkeletonDashboard />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <p className="text-[rgb(var(--color-text-secondary))] text-center mb-4">
            ไม่สามารถโหลดกิจกรรมได้
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            ลองใหม่
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              สวัสดี
            </p>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              ภาพรวม
            </h1>
          </div>
          <Link
            href="/events/new"
            className="h-11 px-4 rounded-full bg-[rgb(var(--color-primary))] text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[rgb(var(--color-primary))]/30 touch-feedback active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>สร้าง</span>
          </Link>
        </div>

        {/* Balance Summary Card - Prominent display */}
        <div className="card-elevated overflow-hidden">
          {/* Gradient header */}
          <div className="gradient-thai p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">ยอดคงเหลือสุทธิ</p>
                <h2 className="text-4xl font-bold tracking-tight">
                  {netBalance >= 0 ? '+' : ''}{formatThaiCurrency(netBalance)}
                </h2>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                {netBalance >= 0 ? (
                  <TrendingUp className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
              </div>
            </div>
          </div>

          {/* Balance breakdown */}
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[var(--color-semantic-success-500)] mb-1">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-xs font-medium">คุณได้รับ</span>
              </div>
              <p className="text-xl font-bold text-[rgb(var(--color-text))]">
                {formatThaiCurrency(mockBalance.owed)}
              </p>
            </div>
            <div className="text-center border-l border-[rgb(var(--color-border-light))]">
              <div className="flex items-center justify-center gap-1 text-[var(--color-semantic-error-500)] mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-medium">คุณต้องจ่าย</span>
              </div>
              <p className="text-xl font-bold text-[rgb(var(--color-text))]">
                {formatThaiCurrency(mockBalance.owing)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - 2x2 Grid */}
        <section>
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-3">
            ทางลัด
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Create Event */}
            <Link href="/events/new" className="block">
              <div className="card-interactive p-4 h-full">
                <div className="h-14 w-14 rounded-2xl mb-3 flex items-center justify-center bg-[var(--color-brand-primary-500)] text-white shadow-lg shadow-[var(--color-brand-primary-500)]/30">
                  <Plus className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-1">
                  สร้างกิจกรรม
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  เริ่มแบ่งค่าใช้จ่ายใหม่
                </p>
              </div>
            </Link>

            {/* Scan QR */}
            <Link href="/scan" className="block">
              <div className="card-interactive p-4 h-full">
                <div className="h-14 w-14 rounded-2xl mb-3 flex items-center justify-center bg-[var(--color-brand-accent-500)] text-white shadow-lg shadow-[var(--color-brand-accent-500)]/30">
                  <QrCode className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-1">
                  สแกน QR
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  เข้าร่วมกิจกรรม
                </p>
              </div>
            </Link>

            {/* History */}
            <Link href="/events?filter=all" className="block">
              <div className="card-interactive p-4 h-full">
                <div className="h-14 w-14 rounded-2xl mb-3 flex items-center justify-center bg-[var(--color-brand-secondary-500)] text-white shadow-lg shadow-[var(--color-brand-secondary-500)]/30">
                  <History className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-1">
                  ประวัติ
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  ดูกิจกรรมทั้งหมด
                </p>
              </div>
            </Link>

            {/* Members Stats */}
            <div className="card-interactive p-4 h-full bg-gradient-to-br from-[var(--surface-card)] to-[var(--color-brand-primary-50)]">
              <div className="h-14 w-14 rounded-2xl mb-3 flex items-center justify-center bg-[var(--color-semantic-success-500)] text-white shadow-lg shadow-[var(--color-semantic-success-500)]/30">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-[rgb(var(--color-text))] mb-1">
                {totalMembers} คน
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                ใน {events?.length || 0} กิจกรรม
              </p>
            </div>
          </div>
        </section>

        {/* Active Events Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              กิจกรรมที่กำลังดำเนิน
            </h2>
            {activeEvents.length > 0 && (
              <Link href="/events" className="flex items-center">
                <span className="text-sm text-[rgb(var(--color-primary))] font-medium">
                  ดูทั้งหมด
                </span>
                <ChevronRight className="h-4 w-4 text-[rgb(var(--color-primary))]" />
              </Link>
            )}
          </div>

          {activeEvents.length === 0 ? (
            <EmptyState
              icon={<Plus className="h-12 w-12" />}
              title="ยังไม่มีกิจกรรม"
              description="สร้างกิจกรรมแรกเพื่อเริ่มแบ่งค่าใช้จ่ายกับเพื่อน"
              action={{
                label: 'สร้างกิจกรรม',
                href: '/events/new',
              }}
            />
          ) : (
            <div className="space-y-3">
              {activeEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} showActions={false} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity - Horizontal scroll */}
        {completedEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                เสร็จสิ้นล่าสุด
              </h2>
              <Link href="/events?filter=completed" className="flex items-center">
                <span className="text-sm text-[rgb(var(--color-primary))] font-medium">
                  ดูทั้งหมด
                </span>
                <ChevronRight className="h-4 w-4 text-[rgb(var(--color-primary))]" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
              {completedEvents.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex-shrink-0 w-64 block"
                >
                  <div className="card-interactive p-4 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-[var(--color-semantic-success-500)]/10 flex items-center justify-center">
                        <History className="h-5 w-5 text-[var(--color-semantic-success-500)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[rgb(var(--color-text))] truncate">
                          {event.title}
                        </h3>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                          {formatRelativeTime(event.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[rgb(var(--color-text-secondary))]">
                        {event.members?.length || 0} คน
                      </span>
                      <span className="badge-success px-2 py-1 rounded-full text-xs font-medium">
                        เสร็จสิ้น
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  )
}
