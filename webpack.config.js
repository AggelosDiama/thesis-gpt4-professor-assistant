import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    login: path.resolve(__dirname, "src/login.js"),
    register: path.resolve(__dirname, "src/register.js"),
    main: path.resolve(__dirname, "src/main.js"),
    chat: path.resolve(__dirname, "src/chat.js"),
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),
  ],
};
