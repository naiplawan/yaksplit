import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * YakSplit Button Component
 *
 * Clean Minimal style - Splitwise inspired
 * Warm Orange primary color
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary-500)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary - Warm Orange
        primary:
          "bg-[var(--color-brand-primary-500)] text-white hover:bg-[var(--color-brand-primary-600)] active:scale-[0.98]",

        // Secondary - Subtle gray
        secondary:
          "bg-[var(--surface-background-alt)] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-border-light))] active:scale-[0.98]",

        // Ghost - Minimal
        ghost:
          "text-[rgb(var(--color-text-secondary))] hover:bg-[var(--surface-background-alt)] hover:text-[rgb(var(--color-text))] active:scale-[0.98]",

        // Outline - Bordered primary
        outline:
          "border-2 border-[var(--color-brand-primary-500)] text-[var(--color-brand-primary-600)] bg-transparent hover:bg-[var(--color-brand-primary-50)] active:scale-[0.98]",

        // Destructive - Red for dangerous actions
        destructive:
          "bg-[var(--color-semantic-error-500)] text-white hover:bg-[var(--color-semantic-error-600)] active:scale-[0.98]",

        // Success - Green for positive actions
        success:
          "bg-[var(--color-semantic-success-500)] text-white hover:bg-[var(--color-semantic-success-600)] active:scale-[0.98]",

        // Link - Text only
        link:
          "text-[var(--color-brand-primary-500)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-11 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
        iconSm: "h-9 w-9",
        full: "h-11 w-full px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
