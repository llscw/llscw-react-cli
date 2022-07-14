const webpack = require('webpack')
const path = require('path')
const logUtil = require('./lib/util-log')
const fs = require('fs')

const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { formatArgs, travel } = require('./lib/utils')
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
  favicon
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, favicon }), {
  mode: "production",
  entry: ["./index.jsx"],
  output: {
    path: path.resolve(userFolder, "dist"),
    filename: "index.js",
    publicPath: '/', // 服务器脚本会用到
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

const currentTime = Date.now()
logUtil.pass("webpack: Compiling...")
webpack(finalWebpackConfig, (err, stats) => {
  if (err) {
    logUtil.error("Compilication failed.")
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
      logUtil.error("Compilication failed.")
      console.log(info.errors);

      process.exit(1);
    }
  }
  if (stats.hasWarnings()) {
    // logUtil.warn(info.warnings)
    // console.warn(info.warnings);
  }
  logUtil.pass("Compilication done.")

  const time = (new Date(Date.now() - currentTime)).getSeconds()
  logUtil.pass("打包共花费：" + time + 's')
  let fileSize = 0
  travel(path.join(userFolder, 'dist'), (pathname)=>{
    fs.stat(pathname,'utf-8', (err,stats)=>{
      if(err) return console.error(err)
      if(stats.size / 1000000 > 1) {
        logUtil.error('BigFile：' + pathname + '：' + (stats.size / 1000000).toFixed(2) + 'MB')
      }
      fileSize += stats.size
    })
  })
  
  setTimeout(()=>logUtil.pass('打包产物大小：' + (fileSize/1000000).toFixed(2) + 'MB'))
})