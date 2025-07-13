module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBg: "#e5f3fb", // 전체적인 배경색
        brandAccent: "#b6e9f9", // 선택된 버튼 강조색
      },
    },
  },
  plugins: [],
};
