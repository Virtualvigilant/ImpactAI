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
        // Impact360 brand palette
        brand: {
          blue:      '#306CEC',
          'blue-dim': 'rgba(48,108,236,0.12)',
          'off-white': '#FFFEF9',
          black:     '#000000',
          dark:      '#06090F',
          card:      '#0A0F1C',
        },
      },
      fontFamily: {
        spartan: ['var(--font-spartan)', 'sans-serif'],
        sans:    ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'bop':        'bop 1.2s ease-in-out infinite',
        'bop-2':      'bop 1.2s ease-in-out 0.2s infinite',
        'bop-3':      'bop 1.2s ease-in-out 0.4s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bop:     { '0%,60%,100%': { transform: 'translateY(0)', opacity: '0.4' }, '30%': { transform: 'translateY(-4px)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
