/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: "var(--sentinel-bg, #080c14)",
          surface: "var(--sentinel-surface, #0f172a)",
          card: "var(--sentinel-card, #131d31)",
          border: "var(--sentinel-border, #1e293b)",
          highlight: "var(--sentinel-highlight, #2d3748)",
          emerald: "#10b981",
          crimson: "#ef4444",
          amber: "#f59e0b",
          cyan: "var(--sentinel-accent, #06b6d4)",
          purple: "var(--sentinel-purple, #8b5cf6)",
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
