/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all relevant files
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
      colors: {
        calendar: {
          light: '#ffffff',
          dark: '#1e293b', // slate-800
        },
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // for better form styling
    require('@tailwindcss/typography'), // optional: for blog-style content
  ],
};
