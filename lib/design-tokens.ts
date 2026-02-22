/**
 * YakSplit Design System Tokens
 *
 * Based on competitor research (Splitwise, Tricount, SettleUp, Heypenny)
 * and 2025 fintech design trends.
 *
 * Color palette inspired by Thai aesthetics:
 * - Primary: Thai Purple (#6B4C9A)
 * - Secondary: Temple Gold (#D4A843)
 * - Accent: Lotus Pink (#E8917C)
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Brand Colors - Thai Purple Scale
  brand: {
    primary: {
      50: '#f5f3f9',
      100: '#e8e3f1',
      200: '#d4cce4',
      300: '#b8a9d1',
      400: '#9b82ba',
      500: '#6B4C9A', // Main Thai Purple
      600: '#5a3f82',
      700: '#4a336b',
      800: '#3a2754',
      900: '#2a1b3d',
      950: '#1a0f26',
    },
    secondary: {
      50: '#fcf8eb',
      100: '#f8f0cf',
      200: '#f1e19e',
      300: '#e9cb5e',
      400: '#D4A843', // Temple Gold
      500: '#c49a3b',
      600: '#a37f30',
      700: '#7d6125',
      800: '#5a461b',
      900: '#3d2f12',
      950: '#261e0c',
    },
    accent: {
      50: '#fef5f3',
      100: '#fee8e4',
      200: '#fdd5cd',
      300: '#fbb8aa',
      400: '#E8917C', // Lotus Pink
      500: '#d47d68',
      600: '#c0644e',
      700: '#a04d3a',
      800: '#7d3c2d',
      900: '#5c2c21',
      950: '#3b1c15',
    },
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#edfaf4',
      100: '#d5f4e6',
      200: '#aee9d1',
      300: '#73d8b4',
      400: '#4EA082', // Thai Green
      500: '#3a8c6e',
      600: '#2a7158',
      700: '#225a46',
      800: '#1e4939',
      900: '#1a3c30',
      950: '#0d251b',
    },
    warning: {
      50: '#fff8ed',
      100: '#ffefcf',
      200: '#ffdf9e',
      300: '#fccb5e',
      400: '#F5B45A', // Thai Orange
      500: '#e19a3d',
      600: '#c07c2a',
      700: '#9a5f20',
      800: '#7d4c1b',
      900: '#653f17',
      950: '#3d250d',
    },
    error: {
      50: '#feefef',
      100: '#fddeed',
      200: '#fcbeda',
      300: '#f88eb8',
      400: '#DC5050', // Error Red
      500: '#c83030',
      600: '#a82222',
      700: '#8a1b1b',
      800: '#721919',
      900: '#5f1818',
      950: '#3a0b0b',
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

  // Neutral Colors
  neutral: {
    50: '#fcfcf8',  // Rice White
    100: '#f5f2ee', // Warm Gray
    200: '#e8e4df',
    300: '#d4cfc8',
    400: '#b8b0a8',
    500: '#948d85',
    600: '#7a746c',
    700: '#635d56',
    800: '#524c46',
    900: '#45403b',
    950: '#2d2926',
  },

  // Surface Colors (for light/dark mode)
  surface: {
    light: {
      background: '#fcfcf8',
      backgroundAlt: '#f5f2ee',
      card: '#ffffff',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    dark: {
      background: '#0f0c16',
      backgroundAlt: '#15111c',
      card: '#1a1622',
      elevated: '#201c28',
      overlay: 'rgba(0, 0, 0, 0.7)',
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
    fontSize: '2.25rem',   // 36px
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  display2: {
    fontSize: '1.875rem',  // 30px
    fontWeight: '700',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
  },

  // Headings
  heading1: {
    fontSize: '1.5rem',    // 24px
    fontWeight: '600',
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
  },
  heading2: {
    fontSize: '1.25rem',   // 20px
    fontWeight: '600',
    lineHeight: '1.3',
  },
  heading3: {
    fontSize: '1.125rem',  // 18px
    fontWeight: '600',
    lineHeight: '1.4',
  },

  // Body
  bodyLg: {
    fontSize: '1.125rem',  // 18px
    fontWeight: '400',
    lineHeight: '1.5',
  },
  body: {
    fontSize: '1rem',      // 16px
    fontWeight: '400',
    lineHeight: '1.5',
  },
  bodySm: {
    fontSize: '0.875rem',  // 14px
    fontWeight: '400',
    lineHeight: '1.5',
  },

  // Labels
  label: {
    fontSize: '0.875rem',  // 14px
    fontWeight: '500',
    lineHeight: '1.4',
  },
  labelSm: {
    fontSize: '0.75rem',   // 12px
    fontWeight: '500',
    lineHeight: '1.4',
  },
  overline: {
    fontSize: '0.625rem',  // 10px
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  // Caption
  caption: {
    fontSize: '0.75rem',   // 12px
    fontWeight: '400',
    lineHeight: '1.4',
  },
} as const

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const radius = {
  none: '0',
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(107, 76, 154, 0.05)',
  md: '0 4px 8px rgba(107, 76, 154, 0.08)',
  lg: '0 8px 24px rgba(107, 76, 154, 0.12)',
  xl: '0 16px 48px rgba(107, 76, 154, 0.16)',
  '2xl': '0 24px 64px rgba(107, 76, 154, 0.20)',
  // Glow effects
  glowPrimary: '0 0 20px rgba(107, 76, 154, 0.3)',
  glowSuccess: '0 0 20px rgba(78, 160, 130, 0.3)',
  glowError: '0 0 20px rgba(220, 80, 80, 0.3)',
  // Dark mode shadows
  darkSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  darkMd: '0 4px 8px rgba(0, 0, 0, 0.4)',
  darkLg: '0 8px 24px rgba(0, 0, 0, 0.5)',
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
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '375px',
  md: '425px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px',
} as const

// ============================================================================
// TOUCH TARGETS
// ============================================================================

export const touchTargets = {
  min: '44px',    // Minimum touch target (Apple HIG)
  preferred: '48px',
  large: '52px',
} as const

// ============================================================================
// COMPONENT PRESETS
// ============================================================================

export const componentPresets = {
  button: {
    heights: {
      sm: '2.75rem',  // 44px
      md: '3rem',     // 48px
      lg: '3.5rem',   // 56px
      full: '3rem',   // 48px
    },
    paddingX: {
      sm: '1rem',     // 16px
      md: '1.5rem',   // 24px
      lg: '2rem',     // 32px
    },
    borderRadius: radius.xl,
  },

  card: {
    padding: spacing[4],      // 16px
    borderRadius: radius.lg,  // 16px
    gap: spacing[4],
  },

  input: {
    height: touchTargets.min,
    paddingX: spacing[4],
    borderRadius: radius.md,
  },

  fab: {
    size: '3.5rem', // 56px
    borderRadius: radius.full,
  },
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get CSS variable for a color token
 */
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

/**
 * Generate inline styles from text style preset
 */
export function getTextStyle(preset: keyof typeof textStyles): React.CSSProperties {
  return textStyles[preset] as React.CSSProperties
}

// Export type for design tokens
export type ColorScale = typeof colors.brand.primary
export type TypographyPreset = keyof typeof textStyles
