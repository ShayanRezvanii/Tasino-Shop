import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tasino: {
          blue: "#0057D9",
          "blue-dark": "#003B8D",
          "blue-deep": "#0D1B2A",
          yellow: "#FDB913",
          "yellow-dark": "#E5A60A",
          muted: "#F2F4F7",
          text: "#0D1B2A",
        },
      },
      fontFamily: {
        vazir: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(13, 27, 42, 0.08)",
        "card-hover": "0 10px 30px rgba(0, 87, 217, 0.14)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
