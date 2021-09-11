const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@config": path.resolve(__dirname, "src/config/"),
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@shared": path.resolve(__dirname, "src/shared/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
    },
  },
};
