/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-warm': '#F5F1E8',
        'surface': '#FFFDF7',
        'alt-bg': '#E9E4D8',
        'ink': '#24302B',
        'muted-text': '#5C665F',
        'line-border': '#D4CEC0',
        'forest-green': '#176B4D',
        'green-soft': '#D8E8DD',
        'terracotta': '#C96B3C',
        'terracotta-soft': '#F0D4C3',
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
        heading: ['"Noto Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
