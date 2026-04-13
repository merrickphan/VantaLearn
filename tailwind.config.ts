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
          bg: "#05070a",
          surface: "#0b0f14",
          "surface-elevated": "#111822",
          "surface-hover": "#141b27",
          border: "#1e293b",
          blue: "#38bdf8",
          "blue-hover": "#7dd3fc",
          "blue-muted": "rgba(56, 189, 248, 0.12)",
          text: "#f1f5f9",
          muted: "#94a3b8",
          success: "#4ade80",
          error: "#f87171",
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
        card: "0 4px 24px rgba(0, 0, 0, 0.45)",
        "card-hover": "0 8px 32px rgba(56, 189, 248, 0.08)",
        glow: "0 0 40px rgba(56, 189, 248, 0.15)",
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
