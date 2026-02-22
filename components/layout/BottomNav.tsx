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

// Simplified navigation: 3 items + FAB for Create
const navigation = [
  { name: 'หน้าแรก', href: '/dashboard', icon: Home },
  { name: 'กิจกรรม', href: '/events', icon: Calendar },
  { name: 'โปรไฟล์', href: '/profile', icon: User },
]

// Pages where FAB should be hidden
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

  // Hide on landing page and login/signup
  if (pathname === '/' || pathname?.startsWith('/login')) {
    return null
  }

  // Check if FAB should be hidden
  const shouldHideFab = hideFabPages.some((page) => pathname?.includes(page))

  return (
    <>
      {/* Mobile bottom navigation - 3 items with centered FAB */}
      <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[rgb(var(--color-bg))]/95 backdrop-blur-lg border-t border-[rgb(var(--color-border-light))] md:hidden safe-area-pb">
        <div className="container-mobile">
          <div className="flex items-stretch justify-around relative">
            {/* Left side: Home */}
            <NavItem
              href="/dashboard"
              icon={Home}
              label="หน้าแรก"
              isActive={pathname === '/dashboard'}
            />

            {/* Center: Create FAB */}
            {!shouldHideFab && (
              <Link
                href="/events/new"
                className="absolute left-1/2 -translate-x-1/2 -top-7 z-10"
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/40 flex items-center justify-center touch-feedback active:scale-95 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
                  <Plus className="h-7 w-7" />
                </div>
              </Link>
            )}

            {/* Right side: Events and Profile */}
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
    </>
  )
}

// Navigation Item Component
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
        'transition-all duration-200 flex-1',
        isActive
          ? 'text-[rgb(var(--color-primary))]'
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
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[rgb(var(--color-primary))]" />
        )}
      </div>
      <span className="text-[10px] font-medium leading-tight mt-0.5">
        {label}
      </span>
    </Link>
  )
}
