import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        // Midnight Amber palette
        flux: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f', 950: '#451a03',
        },
        surge: {
          50: '#f0f0ff', 100: '#e0e0ff', 200: '#c7c7ff', 300: '#a5a5fd',
          400: '#8585f6', 500: '#6b6bec', 600: '#5a5ad5', 700: '#4a49ab',
          800: '#3d3d88', 900: '#35356e', 950: '#1f1f3f',
        },
        spark: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#b9e6fe', 300: '#7cd4fd',
          400: '#36bffa', 500: '#0ca5eb', 600: '#0086c9', 700: '#026aa2',
          800: '#065986', 900: '#0b4a6f', 950: '#062c41',
        },
        ember: {
          400: '#fb923c', 500: '#f97316', 600: '#ea6000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-exo)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        pulse_amber: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 12px rgba(245,158,11,0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 28px rgba(245,158,11,0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanH: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-amber': 'pulse_amber 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3.5s ease-in-out infinite',
        scanH: 'scanH 3s linear infinite',
        fadeUp: 'fadeSlideUp 0.4s ease-out forwards',
      },
      backgroundImage: {
        'grid-flux': 'linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)',
        'grid-surge': 'linear-gradient(rgba(107,107,236,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(107,107,236,0.04) 1px, transparent 1px)',
      },
      backgroundSize: { grid: '44px 44px' },
      boxShadow: {
        'flux-glow': '0 0 18px rgba(245,158,11,0.35), 0 0 50px rgba(245,158,11,0.12)',
        'surge-glow': '0 0 18px rgba(107,107,236,0.35), 0 0 50px rgba(107,107,236,0.12)',
        'spark-glow': '0 0 18px rgba(12,165,235,0.35), 0 0 50px rgba(12,165,235,0.12)',
        'glass-card': '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card-hover': '0 20px 60px rgba(245,158,11,0.12)',
      },
    },
  },
  plugins: [animate],
}
export default config
