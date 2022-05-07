const webpack = require('webpack')
const path = require('path')
const chalk = require('chalk')
chalk.level = 2

const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { formatArgs } = require('./lib/utils')
const finalConfig = formatArgs(process.argv)
const {
  userFolder,
  buildFolder,
  currentEnv
} = finalConfig

const customWebpackPath = path.resolve(userFolder, 'llscw.config.js')
const customWebpackConfig = require(customWebpackPath)({ userFolder, buildFolder, currentEnv })

const {
  bundleAnalyzerOptions,
  webpackConfig,
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, mode: "production" }), {
  entry: ["./index.tsx"],
  output: {
    path: path.resolve(userFolder, "dist"),
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
    new BundleAnalyzerPlugin(
      Object.assign({
        analyzerMode: 'disabled'
      }, bundleAnalyzerOptions)
    )
  ]
}, webpackConfig)

console.log(chalk.green("webpack: Compiling..."));
webpack(finalWebpackConfig, (err, stats) => {
  if (err) {
    console.log(chalk.red("Compilication failed."));
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(1);
    return;
  }
  console.log(chalk.green("Compilication done."));
})