module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBg: "#C14C21", // 전체적인 배경색
        brandAccent: "#407AAC", // 선택된 버튼 강조색
      },
    },
  },
  plugins: [],
};
