/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,vue,ts}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      "colors": {
        "primary": {
          50: "#E7FFE5",
          100: "#CFFFCC",
          200: "#A0FF99",
          300: "#70FF66",
          400: "#41FF33",
          500: "#12FF03",
          600: "#0ECC00",
          700: "#0A9900",
          800: "#076600",
          900: "#033300",
          950: "#021900"
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}