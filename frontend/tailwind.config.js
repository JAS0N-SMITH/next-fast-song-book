/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1b1e',
          card: '#2c2e33',
          border: '#3a3d44',
          text: '#e1e1e1',
          'text-secondary': '#a0a0a0',
          primary: '#6366f1',
          'primary-hover': '#4f46e5',
        },
      },
    },
  },
  plugins: [],
} 