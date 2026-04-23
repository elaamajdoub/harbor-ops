/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        harbor: {
          900: '#040d1a',
          800: '#071428',
          700: '#0a1e3d',
          600: '#0e2a52',
          500: '#0f3460',
          accent: '#00d4ff',
          gold: '#f4a61d',
          danger: '#ff4757',
          success: '#2ed573',
          warn: '#ffa502',
        }
      }
    }
  },
  plugins: []
}
