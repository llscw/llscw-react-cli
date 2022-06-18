const webpack = require("webpack");
const path = require('path')
const { merge } = require('webpack-merge')

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
  webpackConfig,
  replace
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, replace, mode: "development" }), {
  entry: ["./index.js"],
  devtool: "source-map",
  output: {
    path: path.join(userFolder, 'dist'),
    publicPath: '/', // 服务器脚本会用到
    filename: 'index.js'
  },
  stats: {
    assets: false,
    colors: true,
    errors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    errorDetails: false,
    warnings: false,
    version: false,
    moduleTrace: false,
    modules: false,
    hash: false,
    timings: true,
    reasons: false,
    publicPath: false,
    chunkOrigins: false,
    depth: false
  },
  module: {
    rules: [
      {
        test: /index.js$/,
        include: /src/,
        exclude: /node_modules/,
        loader: path.resolve(__dirname,'loader/hot/index.js')
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),  // 启动HMR
    new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    // new ESLintPlugin({
    //     fix: true, /* 自动帮助修复 */
    //     extensions: ['js', 'json', 'tsx', 'ts'],
    //     exclude: 'node_modules'
    // }),
  ]
}, webpackConfig)

module.exports = finalWebpackConfig