const webpack = require("webpack");
const path = require('path')
const ClearConsole = require('./plugins/clear_console')
const targetRootPath = process.cwd();

module.exports = {
  mode: 'development',
  entry: {
    index: [
      'webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=20000&reload=true',
      "./index.tsx"
    ]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(targetRootPath, 'dist'),
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
        test: /index.tsx$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
            loader: path.resolve(__dirname,'loader/index.js')
        }
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
}