'use client'

import { cn } from '@/lib/utils'

export interface FilterTab {
  key: string
  label: string
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: FilterTabsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all',
            'touch-feedback min-h-[var(--touch-target)]',
            activeTab === tab.key
              ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30'
              : 'bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border-light))]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              activeTab === tab.key
                ? 'bg-white/20'
                : 'bg-[rgb(var(--color-border-light))]'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
