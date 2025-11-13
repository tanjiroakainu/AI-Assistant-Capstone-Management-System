/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ruby Flame – black base with red-glow hover states
        ruby: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        flame: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#f83e3e',
          600: '#e51e1e',
          700: '#c11414',
          800: '#a01414',
          900: '#841818',
          950: '#000000',
        },
      },
      boxShadow: {
        'ruby-glow': '0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(239, 68, 68, 0.4)',
        'flame-glow': '0 0 25px rgba(239, 68, 68, 0.7), 0 0 50px rgba(220, 38, 38, 0.5)',
      },
    },
  },
  plugins: [],
}

