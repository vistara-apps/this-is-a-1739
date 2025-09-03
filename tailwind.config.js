/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors from PRD design system
      colors: {
        bg: 'hsl(220 13% 98%)',
        accent: 'hsl(186 90% 44.1%)',
        primary: 'hsl(220 89.8% 52.2%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 39.3% 18.8%)',
        'text-secondary': 'hsl(220 39.3% 40%)',
      },
      // Border radius from PRD design system
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      // Shadows from PRD design system
      boxShadow: {
        'card': '0 8px 24px hsla(220, 39%, 18%, 0.12)',
        'modal': '0 10px 30px hsla(220, 39%, 18%, 0.2)',
      },
      // Spacing from PRD design system
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Grid system from PRD
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      // Motion from PRD design system
      transitionTimingFunction: {
        'design-system': 'cubic-bezier(0.22,1,0.36,1)',
      },
      transitionDuration: {
        'base': '250ms',
        'fast': '150ms',
        'slow': '400ms',
      },
      // Custom animations
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'dna-flow': 'dna-flow 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'dna-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      // Typography from PRD design system
      fontSize: {
        'display': ['3.75rem', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}
