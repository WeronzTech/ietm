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
        "vector-bg": "#0B0E11",
        "vector-panel": "#161B22",
        "vector-accent": "#00F5D4",
        "vector-text": "#FFFFFF",
        "vector-text-muted": "#8B949E",
        "vector-danger": "#FF4D4D",
        "vector-success": "#4ADE80",
      },
    },
  },
  plugins: [],
};
