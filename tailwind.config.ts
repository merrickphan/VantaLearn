import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vanta: {
          bg: "var(--vanta-bg)",
          surface: "var(--vanta-surface)",
          "surface-elevated": "var(--vanta-surface-elevated)",
          "surface-hover": "var(--vanta-surface-hover)",
          border: "var(--vanta-border)",
          blue: "var(--vanta-blue)",
          "blue-hover": "var(--vanta-blue-hover)",
          "blue-muted": "var(--vanta-blue-muted)",
          text: "var(--vanta-text)",
          muted: "var(--vanta-muted)",
          success: "var(--vanta-success)",
          error: "var(--vanta-error)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-orbitron)", "var(--font-geist-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "var(--vanta-shadow-card)",
        "card-hover": "var(--vanta-shadow-card-hover)",
        glow: "var(--vanta-shadow-glow)",
      },
      animation: {
        "pulse-blue": "pulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flip-in": "flipIn 0.4s ease-out",
        "fade-up": "fadeUp 0.3s ease-out",
      },
      keyframes: {
        pulseBlue: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5", backgroundColor: "#38bdf8" },
        },
        flipIn: {
          "0%": { transform: "rotateY(90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
