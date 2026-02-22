'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Container } from '@/components/layout/Container'
import { Sparkles, Plus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { FilterTabs } from '@/components/common/FilterTabs'
import { EventCard, EventCardSkeleton } from '@/components/event/EventCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EventsPage() {
  const { data: events, isLoading, error } = useEvents()
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlFilter = params.get('filter')
    if (urlFilter === 'active' || urlFilter === 'completed' || urlFilter === 'all') {
      setFilter(urlFilter)
    }
  }, [])

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const completedEvents = events?.filter((e) => e.status === 'completed') || []
  const filteredEvents =
    (filter === 'all' ? events : filter === 'active' ? activeEvents : completedEvents) || []

  const tabs = [
    { key: 'active', label: 'กำลังดำเนิน', count: activeEvents.length },
    { key: 'completed', label: 'เสร็จสิ้น', count: completedEvents.length },
    { key: 'all', label: 'ทั้งหมด', count: events?.length || 0 },
  ]

  return (
    <Container>
      <div className="py-6 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              กิจกรรม
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {activeEvents.length > 0
                ? `${activeEvents.length} กิจกรรมที่กำลังดำเนิน`
                : 'จัดการค่าใช้จ่ายร่วมกัน'}
            </p>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
            <input
              type="text"
              placeholder="ค้นหากิจกรรม..."
              className="input-mobile pl-12 h-11"
            />
          </div>
          <Link href="/events/new">
            <Button size="icon" className="h-11 w-11 rounded-lg">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          tabs={tabs}
          activeTab={filter}
          onTabChange={(key) => setFilter(key as typeof filter)}
        />

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="card-mobile p-8 text-center">
            <p className="text-[rgb(var(--color-text-secondary))] mb-4">
              ไม่สามารถโหลดกิจกรรมได้
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              ลองใหม่
            </button>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-12 w-12" />}
            title={filter === 'completed' ? 'ยังไม่มีกิจกรรมที่เสร็จสิ้น' : 'ยังไม่มีกิจกรรม'}
            description={
              filter === 'active'
                ? 'สร้างกิจกรรมแรกเพื่อเริ่มแบ่งค่าใช้จ่ายกับเพื่อน'
                : 'กิจกรรมจะแสดงที่นี่เมื่อคุณสร้าง'
            }
            action={
              filter !== 'completed'
                ? {
                    label: 'สร้างกิจกรรม',
                    href: '/events/new',
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard
                  event={event}
                  showActions={filter === 'active'}
                  mockTotal={Math.floor(Math.random() * 5000) + 1000}
                  mockPaid={Math.floor(Math.random() * 3000) + 500}
                />
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && events && events.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--surface-background-alt)] border border-[rgb(var(--color-border-light))]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--color-text))]">
                  {events.length}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  กิจกรรมทั้งหมด
                </p>
              </div>
              <div className="border-l border-r border-[rgb(var(--color-border-light))]">
                <p className="text-2xl font-bold text-[var(--color-brand-primary-500)]">
                  {activeEvents.length}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  กำลังดำเนิน
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-semantic-success-500)]">
                  {completedEvents.length}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  เสร็จสิ้น
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
