import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          dark: "#0B1120",
        },
        sage: {
          DEFAULT: "#334155",
          light: "#475569",
          dark: "#1E293B",
        },
        cream: {
          DEFAULT: "#FAF8F4",
          dark: "#F1EEE6",
        },
        stone: {
          DEFAULT: "#E5E7EB",
          dark: "#D1D5DB",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#DEBE5C",
          dark: "#A3801F",
        },
        graphite: {
          DEFAULT: "#0B1120",
          light: "#1E293B",
        },
      },
      fontFamily: {
        heading: ["'Cormorant Garamond'", "serif"],
        subheading: ["'DM Serif Display'", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        700: "700ms",
        900: "900ms",
        1200: "1200ms",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 900ms cubic-bezier(0.22,1,0.36,1) both",
        riseIn: "riseIn 900ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
