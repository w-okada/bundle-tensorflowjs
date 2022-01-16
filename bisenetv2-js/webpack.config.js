const path = require("path");
const webpack = require("webpack");

const manager = {
  mode: "production",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      os: false,
      buffer: require.resolve("buffer"),
    },
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /resources\/.*\.bin/, type: "asset/inline" },
      { test: /resources\/.*\.json/, type: "asset/source" },
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    // https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};

module.exports = [manager];
