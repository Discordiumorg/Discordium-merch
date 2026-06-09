/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#9333ea',
          violet: '#7c3aed',
          pink: '#f43f8e',
          rose: '#ec4899',
          dark: '#07060f',
          card: '#120f22',
          surface: '#1c1635',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7c3aed 0%, #f43f8e 100%)',
        'gradient-aura': 'linear-gradient(135deg, #6d28d9 0%, #9333ea 40%, #f43f8e 100%)',
        'gradient-dark': 'linear-gradient(180deg, #07060f 0%, #120f22 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(7,6,15,0.97) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'aura': 'aura-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'aura-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
      boxShadow: {
        'aura': '0 0 20px rgba(147,51,234,0.4), 0 0 60px rgba(147,51,234,0.15)',
        'aura-lg': '0 0 40px rgba(147,51,234,0.5), 0 0 80px rgba(244,63,142,0.2)',
        'button': '0 4px 24px rgba(124,58,237,0.5), 0 2px 8px rgba(244,63,142,0.3)',
      },
    },
  },
  plugins: [],
}
