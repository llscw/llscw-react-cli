const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')
const targetRootPath = process.cwd();

module.exports = {
  mode: 'production',
  entry: ["./index.tsx"],
  output: {
    path: path.resolve(targetRootPath, "dist"),
    filename: "bundle.[chunkhash].js",
    publicPath: '/dist', // 服务器脚本会用到
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new BundleAnalyzerPlugin()
  ],
}