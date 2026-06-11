/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./HomePage.jsx",
    "./CateringPage.jsx",
    "./MenuPage.jsx",
    "./index.jsx",
    "./components/**/*.jsx",
    "./hooks/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c60909',
          dark: '#8f0606',
          light: '#ef4444',
        },
        ruby: {
          50:  '#fff1f1',
          100: '#ffe3e3',
          200: '#ffc9c9',
          400: '#ef4444',
          500: '#c60909',
          600: '#a80707',
          700: '#7f0505',
        },
        coal: {
          50:  '#f6f3ef',
          100: '#e8e0d6',
          200: '#c9b9a5',
          500: '#6c6258',
          700: '#231f1d',
          800: '#151312',
          900: '#0b0b0b',
          950: '#050505',
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
        'card':       '0 18px 50px 0 rgba(5,5,5,0.10)',
        'card-hover': '0 24px 70px 0 rgba(198,9,9,0.18)',
        'cta':        '0 14px 34px 0 rgba(198,9,9,0.34)',
        'cta-hover':  '0 18px 42px 0 rgba(198,9,9,0.48)',
        'nav':        '0 16px 45px 0 rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
