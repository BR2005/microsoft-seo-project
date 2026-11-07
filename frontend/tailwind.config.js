/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          accent: "#38bdf8",
        },
        navy: {
          800: "#131b2e",
          900: "#0b0f19",
          950: "#070a12",
        },
        surface: {
          DEFAULT: "#0f172a",
          card: "#0d1322",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "#141c2e",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

