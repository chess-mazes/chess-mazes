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
    },
  },
  plugins: [],
};
