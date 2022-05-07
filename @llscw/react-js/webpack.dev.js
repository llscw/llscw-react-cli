const webpack = require("webpack");
const path = require('path')
const ClearConsole = require('./plugins/clear_console')
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
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, mode: "development" }), {
  entry: {
    index: [
      "./index.jsx"
    ]
  },
  devtool: "source-map",
  output: {
    path: path.join(userFolder, 'dist'),
    publicPath: '/', // 服务器脚本会用到
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: ["style-loader", 'css-loader', 'less-loader']
      },
      {
        test: /index.jsx$/,
        include: /src/,
        exclude: /node_modules/,
        loader: path.resolve(__dirname,'loader/index.js')
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),  // 启动HMR
    new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new ClearConsole(),
    // new ESLintPlugin({
    //     fix: true, /* 自动帮助修复 */
    //     extensions: ['js', 'json', 'tsx', 'ts'],
    //     exclude: 'node_modules'
    // }),
  ]
}, webpackConfig)

module.exports = finalWebpackConfig