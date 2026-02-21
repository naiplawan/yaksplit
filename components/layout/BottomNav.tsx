'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Calendar,
  CreditCard,
  Plus,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Activity', href: '/activity', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
]

// Pages where FAB should be hidden
const hideFabPages = [
  '/events/new',
  '/pay',
  '/expenses/new',
  '/settings',
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
      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[rgb(var(--color-bg))]/95 backdrop-blur-lg border-t border-[rgb(var(--color-border-light))] md:hidden safe-area-pb">
        <div className="container-mobile">
          <div className="flex items-stretch justify-around">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 min-h-[var(--touch-target)]',
                    'transition-all duration-200',
                    isActive
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-text-secondary))]'
                  )}
                >
                  <div className="relative">
                    <Icon className={cn(
                      'h-6 w-6',
                      isActive ? 'fill-current' : ''
                    )} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[rgb(var(--color-primary))]" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-tight mt-0.5">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Floating Action Button - Hidden on certain pages */}
      {!shouldHideFab && (pathname === '/dashboard' || pathname?.startsWith('/events')) && (
        <Link
          href="/events/new"
          className="fab fixed bottom-24 right-4 z-[var(--z-modal)] bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30 md:hidden"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </>
  )
}
