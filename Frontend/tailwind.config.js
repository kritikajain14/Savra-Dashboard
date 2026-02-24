/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B2621',
          light: '#5C3D35',
          dark: '#2A1B17',
        },
        secondary: {
          DEFAULT: '#3BC262',
          light: '#6BD489',
          dark: '#2E9E4E',
        }
      },
      backgroundColor: {
        primary: '#3B2621',
        secondary: '#3BC262',
      },
      textColor: {
        primary: '#3B2621',
        secondary: '#3BC262',
      },
      borderColor: {
        primary: '#3B2621',
        secondary: '#3BC262',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}