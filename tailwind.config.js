/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 13% 98%)',
        accent: 'hsl(186 90% 44.1%)',
        primary: 'hsl(220 89.8% 52.2%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 39.3% 18.8%)',
        'text-secondary': 'hsl(220 39.3% 40%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220, 39%, 18%, 0.12)',
        'modal': '0 10px 30px hsla(220, 39%, 18%, 0.2)',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}