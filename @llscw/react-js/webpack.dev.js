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
    shared: ['webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=10000&reload=true'],
    home: {
      import: './index.jsx',
      dependOn: 'shared'
    }
  },
  devtool: "source-map",
  output: {
    path: path.join(userFolder, 'dist'),
    publicPath: '/', // 服务器脚本会用到
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