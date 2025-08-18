module.exports = {
  plugins: {
    // Use the TailwindCSS PostCSS plugin directly to avoid native lightningcss binding issues on Windows
    tailwindcss: {},
    autoprefixer: {},
  },
};
