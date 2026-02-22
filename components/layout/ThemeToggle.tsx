'use client'

import { useTheme } from '@/app/providers/theme-provider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    { key: 'light' as const, label: 'สว่าง', icon: Sun },
    { key: 'dark' as const, label: 'มืด', icon: Moon },
    { key: 'system' as const, label: 'ระบบ', icon: Monitor },
  ]

  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 rounded-xl bg-[rgb(var(--color-bg-alt))] border border-[rgb(var(--color-border-light))]',
        className
      )}
      role="radiogroup"
      aria-label="เลือกธีม"
    >
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'min-h-[40px] min-w-[40px]',
            theme === key
              ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-text))] shadow-sm'
              : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]'
          )}
          role="radio"
          aria-checked={theme === key}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
          {showLabel && <span>{label}</span>}
        </button>
      ))}
    </div>
  )
}

// Simple toggle button that switches between light and dark
export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'h-11 w-11 rounded-full flex items-center justify-center',
        'bg-[rgb(var(--color-bg-alt))] border border-[rgb(var(--color-border-light))]',
        'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]',
        'transition-all duration-200 touch-feedback active:scale-95',
        className
      )}
      aria-label={resolvedTheme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
