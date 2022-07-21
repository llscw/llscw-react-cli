const path = require('path')

module.exports = ({ userFolder, srcFolder, buildFolder, gitVersion, currentEnv, webpack, webpackDevServer }) => {
  return {
    // buildFolder, // 重置打包目录，默认隐藏

    commonJs: false,

    // debugPort: 9000, // 调试端口号，默认 9000
    px2rem: {
        open: false, // 如果要开启，需要设置为 true
        loader: 'px2rem-loader', // 开发者在当前目录需要自行安装 px2rem-loader: npm i px2rem-loader
        options:{
            remUni: 75
        }
    },

    webpackConfig: {
      // output: {
      //   path: path.resolve(__dirname, "build"),
      //   filename: "bundle.[chunkhash].js",
      //   publicPath: '/build', // 服务器脚本会用到
      // }
    },

    https:{
        domain:"h5.dev.llscw.com"
    }
  }
}

module.exports.llscwScaffold = 'llscw-react-js-ssr@0.0.1-beta2'