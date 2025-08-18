/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--tk-primary))',
        accent: 'hsl(var(--tk-accent))',
        surface: 'hsl(var(--tk-surface))',
        text: 'hsl(var(--tk-text))',
      },
      borderRadius: { bubble: '14px' },
      boxShadow: { stage: '0 10px 30px rgba(0,0,0,.25)' }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};