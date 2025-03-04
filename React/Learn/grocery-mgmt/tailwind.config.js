/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1890ff',
          dark: '#177ddc',
          DEFAULT: 'var(--primary-color)',
        },
        secondary: {
          light: '#52c41a',
          dark: '#49aa19',
          DEFAULT: 'var(--secondary-color)',
        },
        background: {
          light: '#f0f2f5',
          dark: '#141414',
          DEFAULT: 'var(--background-color)',
        },
        card: {
          light: '#ffffff',
          dark: '#1f1f1f',
          DEFAULT: 'var(--card-background)',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
          DEFAULT: 'var(--text-color)',
          secondary: 'var(--text-secondary)',
        },
      },
      boxShadow: {
        card: 'var(--box-shadow)',
        hover: 'var(--hover-shadow)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-speed)',
      },
    },
  },
  plugins: [],
};