/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1e88e5',
        secondary: '#8e24aa',
        accent: '#e74c3c',
        success: '#2ecc71',
        warning: '#f39c12',
        danger: '#e74c3c',
        origin: {
          50: '#fff3e6',
          100: '#ffe0bf',
          200: '#ffc180',
          300: '#ffa040',
          400: '#ff880d',
          500: '#e06f04',
          600: '#b35703',
          700: '#864102',
          800: '#592b01',
          900: '#2d1600',
        },
        whites: {
          50: 'rgb(255 255 255 / 1)',
          100: 'rgb(255 255 255 / 0.9)',
          200: 'rgb(255 255 255 / 0.8)',
          300: 'rgb(255 255 255 / 0.7)',
          400: 'rgb(255 255 255 / 0.6)',
          500: 'rgb(255 255 255 / 0.5)',
          600: 'rgb(255 255 255 / 0.4)',
          700: 'rgb(255 255 255 / 0.3)',
          800: 'rgb(255 255 255 / 0.2)',
          900: 'rgb(255 255 255 / 0.1)',
        },
        'dark-bg': '#121212',
        'light-card': '#ffffff',
        'dark-card': '#1e1e1e',
        'light-text': '#333333',
        'dark-text': '#f5f5f5',
        'light-border': '#e0e0e0',
        'dark-border': '#333333',
      },
      fontFamily: {
        sans: ['NotoSansSC', 'sans-serif'],
      },
      spacing: {
        sidebar: '280px',
        header: '80px',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        rgbFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        pulse: 'pulse 1.5s infinite',
        'rgb-flow': 'rgbFlow 3s linear infinite',
      },
    },
  },

  plugins: [],
};
