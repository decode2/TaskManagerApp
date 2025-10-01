/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'color-bg-primary': 'var(--bg-primary)',
        'color-bg-secondary': 'var(--bg-secondary)',
        'color-bg-tertiary': 'var(--bg-tertiary)',
        'color-bg-elevated': 'var(--bg-elevated)',
        'color-text-primary': 'var(--text-primary)',
        'color-text-secondary': 'var(--text-secondary)',
        'color-text-tertiary': 'var(--text-tertiary)',
        'color-border-light': 'var(--border-light)',
        'color-border-medium': 'var(--border-medium)',
        'color-border-strong': 'var(--border-strong)',
        'color-accent-primary': 'var(--accent-primary)',
        'color-accent-success': 'var(--accent-success)',
        'color-accent-warning': 'var(--accent-warning)',
        'color-accent-error': 'var(--accent-error)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
