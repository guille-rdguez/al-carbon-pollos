/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./HomePage.jsx",
    "./index.jsx",
    "./components/**/*.jsx",
    "./hooks/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E94E1B',
          dark: '#B53A13',
          light: '#FF6B3D',
        },
        orange: {
          50:  '#FFF8F0',
          100: '#FFF3E0',
          200: '#FFE0B2',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Barlow Condensed', 'Manrope', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%':      { transform: 'translate3d(0, -10px, 0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%':      { transform: 'translate3d(18px, -14px, 0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%':      { opacity: '0.95', transform: 'scale(1.08)' },
        },
        'progress-line': {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both',
        'slide-down': 'slide-down 0.25s ease-out both',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'float-soft': 'float-soft 4.6s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3.8s ease-in-out infinite',
        'progress-line': 'progress-line 5s linear infinite',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':       '0 2px 12px 0 rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px 0 rgba(233,78,27,0.16)',
        'cta':        '0 4px 20px 0 rgba(233,78,27,0.40)',
        'cta-hover':  '0 6px 28px 0 rgba(233,78,27,0.55)',
        'nav':        '0 1px 16px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
