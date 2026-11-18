/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cix: {
          bg: '#0E0E12',
          surface: '#17171D',
          raised: '#1F1F27',
          line: '#2A2A34',
          text: '#F2F2F5',
          muted: '#9A9AA8',
          accent: '#E8333C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
