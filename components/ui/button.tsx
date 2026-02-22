import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * YakSplit Button Component
 *
 * Mobile-first design with minimum 44px touch target (h-11 = 44px)
 * Variants based on 2025 fintech design trends
 *
 * Usage:
 * ```tsx
 * <Button variant="primary">Primary Action</Button>
 * <Button variant="gradient" size="lg">Gradient CTA</Button>
 * <Button variant="outline-primary">Outlined Primary</Button>
 * <Button variant="ghost" size="icon">Icon Button</Button>
 * ```
 */
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary - Main CTA buttons
        primary:
          "bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30 hover:bg-[rgb(var(--color-primary))]/90 active:scale-[0.98]",

        // Secondary - Secondary actions
        secondary:
          "bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border-light))] hover:bg-[rgb(var(--color-border-light))] active:scale-[0.98]",

        // Ghost - Minimal button
        ghost:
          "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-alt))] hover:text-[rgb(var(--color-text))] active:scale-[0.98]",

        // Gradient - Eye-catching CTAs (Splitwise-inspired)
        gradient:
          "bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]",

        // Outline Primary - Bordered primary color
        outlinePrimary:
          "border-2 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] bg-transparent hover:bg-[rgb(var(--color-primary))]/10 active:scale-[0.98]",

        // Outline Secondary - Bordered subtle
        outlineSecondary:
          "border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] bg-transparent hover:bg-[rgb(var(--color-bg-alt))] active:scale-[0.98]",

        // Destructive - Dangerous actions (delete, remove)
        destructive:
          "bg-[rgb(var(--color-error))] text-white shadow-lg shadow-[rgb(var(--color-error))]/30 hover:bg-[rgb(var(--color-error))]/90 active:scale-[0.98]",

        // Destructive Outline
        destructiveOutline:
          "border-2 border-[rgb(var(--color-error))] text-[rgb(var(--color-error))] bg-transparent hover:bg-[rgb(var(--color-error))]/10 active:scale-[0.98]",

        // Success - Positive actions (confirm, complete)
        success:
          "bg-[rgb(var(--color-success))] text-white shadow-lg shadow-[rgb(var(--color-success))]/30 hover:bg-[rgb(var(--color-success))]/90 active:scale-[0.98]",

        // Link - Looks like a link
        link:
          "text-[rgb(var(--color-primary))] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-11 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
        iconSm: "h-9 w-9",
        iconLg: "h-12 w-12",
        full: "h-12 w-full px-6 text-base",
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

// Export compound components for common patterns
const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn(
      "flex gap-2",
      orientation === 'vertical' && "flex-col",
      className
    )}
    {...props}
  />
))
ButtonGroup.displayName = "ButtonGroup"

export { Button, buttonVariants, ButtonGroup }
