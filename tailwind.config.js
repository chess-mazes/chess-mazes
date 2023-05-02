export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'chess-dark': 'var(--chess-dark)',
        'chess-light': 'var(--chess-light)',
        text: 'var(--text)',
        background1: 'var(--background1)',
        background2: 'var(--background2)',
        background3: 'var(--background3)',
        background4: 'var(--background4)',
        background5: 'var(--background5)',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'chess-move': '0.4s ease-in fade-in backwards',
      },
    },
  },
  plugins: [],
};
