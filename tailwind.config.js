// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",    // Scans your main HTML file
    "./js/**/*.js",    // Scans all .js files within the 'js' folder and its subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
