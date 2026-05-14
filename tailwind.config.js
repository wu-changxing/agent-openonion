/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia'],
      },
      colors: {
        // ConnectOnion dark surfaces.
        paper: {
          DEFAULT: '#030712',
          soft:    '#111827',
          muted:   '#1F2937',
          deep:    '#374151',
        },
        // Borders / rules.
        line: {
          DEFAULT: '#374151',
          soft:    '#1F2937',
          strong:  '#D1D5DB',
        },
        // Text aliases.
        ink: {
          DEFAULT: '#FFFFFF',
          soft:    '#F1F5F9',
          muted:   '#F1F5F9',
          dim:     '#E2E8F0',
          faint:   '#E2E8F0',
        },
        // Accent (green) — primary action / success.
        accent: {
          DEFAULT: '#4ADE80',
          soft:    '#4ADE80',
          glow:    '#4ADE80',
          deep:    '#22C55E',
          tint:    '#14532D',
        },
      },
      maxWidth: {
        container: '56rem',
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
        display: ['3.5rem', { lineHeight: '1', letterSpacing: '0' }],
        h1: ['2.75rem', { lineHeight: '1.05', letterSpacing: '0' }],
        h2: ['1.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
      },
      animation: {
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
