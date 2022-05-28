const path = require("path");

module.exports = {
  mode: "development",
  watch: true,
  entry: "./src/public/js/app.js",
  output: {
    filename: "js/app.js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
