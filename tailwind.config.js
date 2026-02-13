/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- This line is critical
  ],
  theme: {
    extend: {
      // Add custom military colors here for your IETM
      colors: {
        "defense-dark": "#1e1e1e",
        "defense-panel": "#252526",
        "defense-accent": "#0078d4",
        "defense-text": "#e0e0e0",
      },
    },
  },
  plugins: [],
};
