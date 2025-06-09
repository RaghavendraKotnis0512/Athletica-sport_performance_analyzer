module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
      // Add this if using custom files
    ],
    theme: {
      extend: {
        backgroundClip: {
          text: "text", // Ensures that text clipping works with gradients
        },
      },
    },
    plugins: [],
  };
  