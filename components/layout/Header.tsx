'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Search } from 'lucide-react'
import { ThemeToggleButton } from '@/components/layout/ThemeToggle'

interface HeaderProps {
  user?: {
    display_name?: string | null
    avatar_url?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  // Landing page header
  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[var(--surface-background)]/95 backdrop-blur-sm border-b border-[rgb(var(--color-border-light))]">
        <div className="container-mobile">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 touch-feedback">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-primary-500)] flex items-center justify-center">
                <span className="text-lg font-bold text-white">฿</span>
              </div>
              <span className="text-lg font-bold text-[rgb(var(--color-text))]">YakSplit</span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <Link href="/events/new">
                <button className="btn-primary text-sm px-4 py-2.5">
                  สร้างกิจกรรม
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // App header
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--surface-background)]/95 backdrop-blur-sm border-b border-[rgb(var(--color-border-light))]">
      <div className="container-mobile">
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 touch-feedback">
            <div className="h-9 w-9 rounded-xl bg-[var(--color-brand-primary-500)] flex items-center justify-center">
              <span className="text-base font-bold text-white">฿</span>
            </div>
            <span className="font-semibold text-[rgb(var(--color-text))] hidden sm:block">
              YakSplit
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggleButton />

            <button className="btn-icon btn-icon-ghost">
              <Search className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
            </button>

            <button className="btn-icon btn-icon-ghost relative">
              <Bell className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--color-brand-primary-500)]"></span>
            </button>

            <Link href="/profile" className="touch-feedback">
              <Avatar className="h-9 w-9 border-2 border-[rgb(var(--color-border-light))]">
                <AvatarFallback className="bg-[var(--color-brand-primary-500)] text-white text-xs font-medium">
                  {user?.display_name?.charAt(0).toUpperCase() || 'Y'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
