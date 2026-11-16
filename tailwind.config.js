/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "vector-bg": "#090D16",
        "vector-panel": "#111827",
        "vector-panel-light": "#1E293B",
        "vector-accent": "#0284C7",
        "vector-accent-hover": "#0369A1",
        "vector-text": "#F8FAFC",
        "vector-text-muted": "#94A3B8",
        "vector-danger": "#EF4444",
        "vector-success": "#10B981",
        "vector-warning": "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "Consolas", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
