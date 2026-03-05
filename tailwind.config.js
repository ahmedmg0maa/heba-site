/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf0',
          100: '#faf5d0',
          200: '#f4e99a',
          300: '#edd85f',
          400: '#e5c533',
          500: '#d4a017',
          600: '#b8810f',
          700: '#94620e',
          800: '#7a4f11',
          900: '#674213',
        },
        dark: {
          50: '#f5f5f0',
          100: '#e8e6de',
          200: '#d1cec0',
          300: '#b5b09a',
          400: '#9a9378',
          500: '#857d62',
          600: '#6e6751',
          700: '#595244',
          800: '#4a453a',
          900: '#3e3a32',
          950: '#1a1814',
        },
        cream: '#f9f5ee',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'var(--font-cormorant)', 'serif'],
        display: ['var(--font-cormorant)', 'serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
        body: ['var(--font-eb-garamond)', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #d4a017 0%, #f4e99a 50%, #d4a017 100%)',
        'noise': "url('/images/noise.svg')",
      },
    },
  },
  plugins: [],
};
