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
          bg: "#f1f5f9",
          surface: "#ffffff",
          "surface-hover": "#f8fafc",
          border: "#e2e8f0",
          blue: "#2563eb",
          "blue-hover": "#1d4ed8",
          "blue-muted": "rgba(37, 99, 235, 0.12)",
          text: "#0f172a",
          muted: "#64748b",
          success: "#15803d",
          error: "#dc2626",
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
        card: "0 4px 14px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 10px 28px rgba(15, 23, 42, 0.12)",
      },
      animation: {
        "pulse-blue": "pulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flip-in": "flipIn 0.4s ease-out",
        "fade-up": "fadeUp 0.3s ease-out",
      },
      keyframes: {
        pulseBlue: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5", backgroundColor: "#2563eb" },
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
