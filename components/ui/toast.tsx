'use client'

import * as React from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

// Toast context
interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 4000
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Toast container
function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-[var(--z-toast)] flex flex-col items-center gap-2 px-4 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// Individual toast item
const toastConfig: Record<ToastType, { icon: typeof CheckCircle; className: string }> = {
  success: {
    icon: CheckCircle,
    className: 'bg-[var(--color-semantic-success-500)] text-white',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-[var(--color-semantic-error-500)] text-white',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-[var(--color-semantic-warning-500)] text-white',
  },
  info: {
    icon: Info,
    className: 'bg-[var(--color-semantic-info-500)] text-white',
  },
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = toastConfig[toast.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'toast pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-[400px]',
        'animate-fade-in-up',
        config.className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{toast.title}</p>
        {toast.description && (
          <p className="text-sm opacity-90 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="ปิด"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Convenience hooks
export function toast(toast: Omit<Toast, 'id'>) {
  // This is a workaround since we can't use hooks outside components
  // In a real app, you'd use a state manager or event emitter
  console.warn('toast() called outside ToastProvider. Use useToast() hook instead.')
}

export const toastSuccess = (title: string, description?: string) =>
  toast({ type: 'success', title, description })

export const toastError = (title: string, description?: string) =>
  toast({ type: 'error', title, description })

export const toastWarning = (title: string, description?: string) =>
  toast({ type: 'warning', title, description })

export const toastInfo = (title: string, description?: string) =>
  toast({ type: 'info', title, description })
