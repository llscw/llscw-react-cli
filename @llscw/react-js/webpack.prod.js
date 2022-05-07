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
  entry: ["./index.jsx"],
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
  const info = stats.toJson();
  if (stats.hasErrors()) {
    let hasBuildError = false;

    // 只要有一个不是来自 uglify 的问题
    for (let i = 0, len = info.errors.length; i < len; i++) {
      if (!/from\s*UglifyJs/i.test(info.errors[i])) {
        hasBuildError = true;
        break;
      }
    }
    if (hasBuildError) {
      console.log(chalk.red("Compilication failed."));
      // for (let i = 0, len = info.errors.length; i < len; i++) {
      //     console.error(i, /UglifyJs/i.test(info.errors[i]));
      // }

      console.log(info.errors);
      // console.error(info.errors.length);
      process.exit(1);
    }
  }
  if (stats.hasWarnings()) {
    // console.warn(info.warnings);
  }
  console.log(chalk.green("Compilication done."));
})