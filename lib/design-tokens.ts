/**
 * YakSplit Design System Tokens
 *
 * Style: Clean Minimal (Splitwise-inspired)
 * Primary: Warm Orange - friendly, approachable
 *
 * Design Principles:
 * - Lots of white space
 * - Subtle shadows, no heavy gradients
 * - Muted secondary colors
 * - Simple, flat design with soft edges
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Brand Colors - Warm Orange Scale
  brand: {
    primary: {
      50: '#fff8f4',
      100: '#ffede0',
      200: '#ffd9bf',
      300: '#ffb88a',
      400: '#ff9054',
      500: '#FF6B2C', // Main Warm Orange
      600: '#f04f1a',
      700: '#c93d14',
      800: '#a33114',
      900: '#862a16',
      950: '#48140a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Slate gray - neutral secondary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15', // Soft yellow accent
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },

  // Neutral Colors - Warm gray scale
  neutral: {
    50: '#fafaf9',   // Warm white
    100: '#f5f5f4',  // Light warm gray
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // Surface Colors (for light/dark mode)
  surface: {
    light: {
      background: '#ffffff',
      backgroundAlt: '#fafaf9',
      card: '#ffffff',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    dark: {
      background: '#0c0a09',
      backgroundAlt: '#1c1917',
      card: '#292524',
      elevated: '#292524',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
  },
} as const

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, monospace',
    thai: 'var(--font-geist-sans), "Noto Sans Thai", "Sarabun", -apple-system, sans-serif',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const

// Typography Presets
export const textStyles = {
  // Display
  display1: {
    fontSize: '2.25rem',
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  display2: {
    fontSize: '1.875rem',
    fontWeight: '700',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
  },

  // Headings
  heading1: {
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
  },
  heading2: {
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  heading3: {
    fontSize: '1.125rem',
    fontWeight: '600',
    lineHeight: '1.4',
  },

  // Body
  bodyLg: {
    fontSize: '1.125rem',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  body: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  bodySm: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.5',
  },

  // Labels
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  labelSm: {
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  overline: {
    fontSize: '0.625rem',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  // Caption
  caption: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4',
  },
} as const

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const radius = {
  none: '0',
  sm: '0.375rem',   // 6px - subtle
  md: '0.5rem',     // 8px - standard
  lg: '0.75rem',    // 12px - cards
  xl: '1rem',       // 16px - buttons
  '2xl': '1.25rem', // 20px - larger elements
  '3xl': '1.5rem',  // 24px - modals
  full: '9999px',
} as const

// ============================================================================
// SHADOW TOKENS - Subtle, minimal shadows
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.08)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
  '2xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
  // Subtle colored shadows
  glowPrimary: '0 2px 8px rgba(255, 107, 44, 0.15)',
  glowSuccess: '0 2px 8px rgba(34, 197, 94, 0.15)',
  glowError: '0 2px 8px rgba(239, 68, 68, 0.15)',
} as const

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animation = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  above: 10,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  toast: 700,
  tooltip: 800,
  max: 999,
} as const

// ============================================================================
// TOUCH TARGETS
// ============================================================================

export const touchTargets = {
  min: '44px',
  preferred: '48px',
  large: '52px',
} as const

// ============================================================================
// COMPONENT PRESETS
// ============================================================================

export const componentPresets = {
  button: {
    heights: {
      sm: '2.5rem',
      md: '2.75rem',
      lg: '3rem',
      full: '2.75rem',
    },
    paddingX: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
    },
    borderRadius: radius.lg,
  },

  card: {
    padding: spacing[4],
    borderRadius: radius.xl,
    gap: spacing[4],
  },

  input: {
    height: touchTargets.min,
    paddingX: spacing[3],
    borderRadius: radius.lg,
  },

  fab: {
    size: '3.5rem',
    borderRadius: radius.full,
  },
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getColorVar(path: string): string {
  const parts = path.split('.')
  if (parts[0] === 'brand' || parts[0] === 'semantic') {
    return `var(--color-${parts[0]}-${parts[1]}-${parts[2]})`
  }
  if (parts[0] === 'surface') {
    return `var(--surface-${parts[1]})`
  }
  return `var(--color-${path})`
}

export function getTextStyle(preset: keyof typeof textStyles): React.CSSProperties {
  return textStyles[preset] as React.CSSProperties
}

export type ColorScale = typeof colors.brand.primary
export type TypographyPreset = keyof typeof textStyles
