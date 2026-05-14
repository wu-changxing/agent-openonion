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
        // ConnectOnion light surfaces.
        paper: {
          DEFAULT: '#FFFFFF',
          soft:    '#F8FAFC',
          muted:   '#F1F5F9',
          deep:    '#E2E8F0',
        },
        // Borders / rules.
        line: {
          DEFAULT: '#CBD5E1',
          soft:    '#E2E8F0',
          strong:  '#475569',
        },
        // Text aliases.
        ink: {
          DEFAULT: '#0F172A',
          soft:    '#1E293B',
          muted:   '#475569',
          dim:     '#64748B',
          faint:   '#94A3B8',
        },
        // Accent (green) — primary action / success.
        accent: {
          DEFAULT: '#16A34A',
          soft:    '#22C55E',
          glow:    '#15803D',
          deep:    '#166534',
          tint:    '#DCFCE7',
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
