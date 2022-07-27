const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const { isObjectLike } = require("./lib/util-type")


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

module.exports = ({userFolder, buildFolder, currentEnv, replace})=>(merge({
  context: path.join(userFolder, "src"),
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: false,
            }
          },
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
        },
      },
      isObjectLike(replace) ?
      {
        test: /\.[(js)(vue)(vuex)]*$/,
        enforce: "pre",
        loader: require('./lib/util-get-replace-loader')(replace, currentEnv),
        exclude: /node_modules/,
      } : {}
    ],
  } 
}, webpackConfig))