var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = ({userFolder, buildFolder, currentEnv, mode, replace})=>({
    mode,
    context: path.join(userFolder, "src"),
    resolve: {
        extensions: [".js", ".jsx", ".vue"],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
              cacheDirectory: true,
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            esModule: false
          }
        },
        // {
        //   test: /\.[(js)(vue)(vuex)]*$/,
        //   loader: 'string-replace-loader',
        //   exclude: /node_modules/,
        //   options: {
        //     multiple: require('./lib/util-get-replace-loader')(replace, currentEnv),
        //   }
        // },
        {
          test: /\.[(js)(vue)(vuex)]*$/,
          enforce: "pre",
          loader: require('./lib/util-get-replace-loader2')(replace, currentEnv),
          exclude: /node_modules/,
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devtool: '#eval-source-map',
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
          filename: "index.html", //Name of file in ./dist/
          template: "index.html", //Name of template in ./src
          hash: true,
          favicon: "favicon.ico"
      }),
    ]
})