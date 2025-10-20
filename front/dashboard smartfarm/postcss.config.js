const { join } = require("path");

module.exports = {
  plugins: [
    require("tailwindcss")(join(__dirname, "tailwind.config.js")),
    require("autoprefixer"),
  ],
};
