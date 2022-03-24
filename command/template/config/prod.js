const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require('path')

module.exports = {
  entry: ["./index.tsx"],
  output: {
    path: path.resolve(__dirname, "../dist"),
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
    new webpack.HotModuleReplacementPlugin(),  // 启动HMR
    new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    })
  ],
}