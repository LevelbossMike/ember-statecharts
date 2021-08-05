module.exports = {
  mode: 'jit',
  purge: [
    './tests/dummy/app/index.html',
    './tests/dummy/app/**/*.{hbs,js}',
    './tests/dummy/public/**/*.svg',
    './docs/**/*.md',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ember: '#e04e39',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
