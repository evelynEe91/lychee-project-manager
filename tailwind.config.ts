import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        muted: "#65758B",
        line: "#D8DEE8",
        panel: "#F7F9FC",
        brand: "#2563EB",
        ok: "#0F766E",
        warn: "#B45309",
        danger: "#B91C1C"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 23, 42, 0.06)"
      },
      spacing: {
        "68": "17rem"
      }
    }
  },
  plugins: []
};

export default config;
