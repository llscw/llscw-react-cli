const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const rootPath = process.cwd()
const gulpFunc = require('./gulpfile')

const { formatArgs } = require('./lib/utils')
const finalConfig = formatArgs(process.argv)
const {
  userFolder,
  buildFolder,
  currentEnv
} = finalConfig

const customWebpackPath = path.resolve(userFolder, 'llscw.config.js')
const customWebpackConfig = require(customWebpackPath).csr({ userFolder, buildFolder, currentEnv })

const {
  webpackConfig,
  replace
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, replace }), {
  mode: "development",
  entry: ['./client/index.jsx'],
  output: {
    path: path.resolve(rootPath, "dist"),
    filename: "client.js",
    publicPath: '/', // 服务器脚本会用到
  },
  plugins: []
}, webpackConfig)

gulpFunc(() =>
  webpack(finalWebpackConfig,(err, stats)=>{
    if (err) {
      console.error("Compilication failed.")
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
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
        // logUtil.error("Compilication failed.")
        console.log(info.errors);
  
      }
    }
    if (stats.hasWarnings()) {
      // logUtil.warn(info.warnings)
      console.warn(info.warnings);
    }
  })
)