/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0faf4',
          100: '#d8f3dc',
          200: '#b7e4c7',
          300: '#74c69d',
          400: '#52b788',
          500: '#40916c',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#143326',
          900: '#0a2016',
        },
        earth: {
          50:  '#fdf8f0',
          100: '#f9edd8',
          200: '#f4d9a8',
          300: '#edc06a',
          400: '#e8a838',
          500: '#d4890f',
          600: '#b3700c',
          700: '#8f560d',
          800: '#6d4011',
          900: '#4a2c0c',
        },
        danger: '#e63946',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-farm': "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&auto=format&fit=crop')",
        'mesh-green': 'radial-gradient(at 40% 20%, #52b788 0px, transparent 50%), radial-gradient(at 80% 0%, #2d6a4f 0px, transparent 50%), radial-gradient(at 0% 50%, #1b4332 0px, transparent 50%)',
      },
      animation: {
        'fade-up':   'fadeUp .5s ease both',
        'fade-in':   'fadeIn .4s ease both',
        'slide-in':  'slideIn .4s ease both',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:  { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'none' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: .4 } },
      },
    },
  },
  plugins: [],
}
