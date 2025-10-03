export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unity: {
          dark: '#1e1e1e',
          darker: '#0d0d0d',
          gray: '#323232',
          blue: '#4c9aff',
          green: '#00ff88',
          orange: '#ff9933',
        }
      }
    },
  },
  plugins: [],
}
