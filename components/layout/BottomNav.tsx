'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Calendar,
  Plus,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'หน้าแรก', href: '/dashboard', icon: Home },
  { name: 'กิจกรรม', href: '/events', icon: Calendar },
  { name: 'โปรไฟล์', href: '/profile', icon: User },
]

const hideFabPages = [
  '/events/new',
  '/pay',
  '/expenses/new',
  '/settings',
  '/profile',
  '/login',
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/' || pathname?.startsWith('/login')) {
    return null
  }

  const shouldHideFab = hideFabPages.some((page) => pathname?.includes(page))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[var(--surface-background)]/95 backdrop-blur-sm border-t border-[rgb(var(--color-border-light))] md:hidden safe-area-pb">
      <div className="container-mobile">
        <div className="flex items-stretch justify-around relative">
          <NavItem
            href="/dashboard"
            icon={Home}
            label="หน้าแรก"
            isActive={pathname === '/dashboard'}
          />

          {!shouldHideFab && (
            <Link
              href="/events/new"
              className="absolute left-1/2 -translate-x-1/2 -top-6 z-10"
            >
              <div className="h-12 w-12 rounded-full bg-[var(--color-brand-primary-500)] text-white shadow-lg flex items-center justify-center touch-feedback active:scale-95 transition-all">
                <Plus className="h-6 w-6" />
              </div>
            </Link>
          )}

          <NavItem
            href="/events"
            icon={Calendar}
            label="กิจกรรม"
            isActive={pathname?.startsWith('/events') && pathname !== '/events/new'}
          />
          <NavItem
            href="/profile"
            icon={User}
            label="โปรไฟล์"
            isActive={pathname === '/profile'}
          />
        </div>
      </div>
    </nav>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center py-2 px-4 min-h-[var(--touch-target)]',
        'transition-all duration-150 flex-1',
        isActive
          ? 'text-[var(--color-brand-primary-500)]'
          : 'text-[rgb(var(--color-text-secondary))]'
      )}
    >
      <div className="relative">
        <Icon
          className={cn(
            'h-6 w-6',
            isActive ? 'fill-current' : ''
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-brand-primary-500)]" />
        )}
      </div>
      <span className="text-[10px] font-medium leading-tight mt-0.5">
        {label}
      </span>
    </Link>
  )
}
