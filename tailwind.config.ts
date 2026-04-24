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
        // Background layer
        "bg-base": "var(--bg-base)",
        "bg-surface-1": "var(--bg-surface-1)",
        "bg-surface-2": "var(--bg-surface-2)",
        "bg-surface-3": "var(--bg-surface-3)",
        "bg-overlay": "var(--bg-overlay)",
        // Border layer
        "border-subtle": "var(--border-subtle)",
        "border-default": "var(--border-default)",
        "border-strong": "var(--border-strong)",
        // Text layer
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-disabled": "var(--text-disabled)",
        // Accent — Electric Indigo
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-dim": "var(--accent-dim)",
        // Status
        "status-idle": "var(--status-idle)",
        "status-queued": "var(--status-queued)",
        "status-running": "var(--accent)",
        "status-done": "var(--status-done)",
        "status-error": "var(--status-error)",
        // Data viz
        "data-a": "var(--data-a)",
        "data-b": "var(--data-b)",
        "data-c": "var(--data-c)",
        "data-d": "var(--data-d)",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.625rem" }],
        "5xl": ["3rem", { lineHeight: "3.25rem" }],
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "10px",
      },
      transitionTimingFunction: {
        // Expo out — the ONE easing curve
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.4, 0, 1, 1)",
      },
      transitionDuration: {
        "120": "120ms",
      },
      animation: {
        "glow-rotate": "glow-rotate 4s linear infinite",
        "cursor-blink": "cursor-blink 1.2s step-end infinite",
      },
      keyframes: {
        "glow-rotate": {
          from: { "--glow-angle": "0deg" } as Record<string, string>,
          to: { "--glow-angle": "360deg" } as Record<string, string>,
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
