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
          bg: "#121212",
          surface: "#1E1E24",
          border: "#2D2D36",
          blue: "#4A90E2",
          "blue-hover": "#3A7BD5",
          "blue-muted": "rgba(74,144,226,0.15)",
          text: "#E0E0E0",
          muted: "#A0A0A0",
          success: "#4CAF50",
          error: "#FF5252",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.3)",
        "card-hover": "0 8px 20px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-blue": "pulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flip-in": "flipIn 0.4s ease-out",
        "fade-up": "fadeUp 0.3s ease-out",
      },
      keyframes: {
        pulseBlue: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5", backgroundColor: "#4A90E2" },
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
