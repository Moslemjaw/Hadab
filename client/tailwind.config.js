/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        cream: {
          50: '#FAF6F0',
          100: '#F7EFE6',
          200: '#F2E8DD', // Base neutral / Primary background
          300: '#E4D3C1',
          400: '#CEB8A0',
        },
        brown: {
          100: '#EDE7E2',
          200: '#D5C7BD',
          300: '#B09C8F',
          500: '#6C5446',
          700: '#4A382F', // Primary text / Brand wordmark
          800: '#3D2D25',
          900: '#2E221B',
        },
        blush: {
          50: '#FAF2F2',
          100: '#F3DFDE',
          200: '#E7C9C8', // Secondary soft accent
          300: '#D4A4A3',
          400: '#BE7D7B',
        },
        burgundy: {
          100: '#F1D5DC',
          300: '#B82850',
          500: '#610C25', // Rich accent, call-to-action
          600: '#50081D',
          700: '#3D0414',
        },
        sage: {
          100: '#E5E8DD',
          200: '#C7CDC5',
          400: '#949B74',
          500: '#7A8060', // Earthy accent
          600: '#63694C',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(74, 56, 47, 0.06)',
        'warm': '0 8px 24px -4px rgba(74, 56, 47, 0.08)',
        'warm-lg': '0 16px 36px -6px rgba(74, 56, 47, 0.12)',
      },
      borderRadius: {
        'organic': '24px 16px 28px 18px',
        'organic-soft': '18px 24px 16px 22px',
      },
    },
  },
  plugins: [],
}
