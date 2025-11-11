/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E91E63',
        secondary: '#F8BBD9',
        accent: '#212121',
        background: '#FAFAFA',
        success: '#4CAF50',
        warning: '#FF9800',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accentText: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
