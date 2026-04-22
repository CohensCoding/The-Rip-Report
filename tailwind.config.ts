import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sans is the default, driven by next/font CSS variables.
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Fraunces", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        sport: {
          football: "#9A1B2F",
          basketball: "#E06A17",
          baseball: "#0C2340",
          hockey: "#4A90B8",
          soccer: "#046A38",
          racing: "#004225",
          ufc: "#B45309",
          wrestling: "#7C3AED",
          "multi-sport": "#64748B",
          "non-sport": "#52525B",
        },
        ink: "#0A0A0B",
        paper: "#F5F5F4",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

