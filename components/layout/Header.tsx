'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Settings, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: {
    display_name?: string | null
    avatar_url?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  // Simplified header for landing page
  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[rgb(var(--color-bg))]/80 backdrop-blur-md border-b border-[rgb(var(--color-border-light))]">
        <div className="container-mobile">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 touch-feedback">
              <div className="h-10 w-10 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center">
                <span className="text-lg font-bold text-white">฿</span>
              </div>
              <span className="text-lg font-bold text-[rgb(var(--color-text))]">YakSplit</span>
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="btn-secondary text-sm px-4 py-2">
                  Log in
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-primary text-sm px-4 py-2">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // App header (authenticated pages)
  return (
    <header className="sticky top-0 z-50 w-full bg-[rgb(var(--color-bg))]/80 backdrop-blur-md border-b border-[rgb(var(--color-border-light))]">
      <div className="container-mobile">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 touch-feedback">
            <div className="h-9 w-9 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center">
              <span className="text-base font-bold text-white">฿</span>
            </div>
            <span className="font-semibold text-[rgb(var(--color-text))] hidden sm:block">
              YakSplit
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search button */}
            <button className="btn-icon btn-icon-ghost">
              <Search className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
            </button>

            {/* Notifications */}
            <button className="btn-icon btn-icon-ghost relative">
              <Bell className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[rgb(var(--color-accent))]"></span>
            </button>

            {/* Settings */}
            <Link href="/profile">
              <button className="btn-icon btn-icon-ghost hidden sm:block">
                <Settings className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
              </button>
            </Link>

            {/* Avatar - links to profile */}
            <Link href="/profile" className="touch-feedback">
              <Avatar className="h-9 w-9 border-2 border-[rgb(var(--color-border))]">
                <AvatarFallback className="bg-[rgb(var(--color-primary))] text-white text-xs font-medium">
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
