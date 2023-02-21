var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ({userFolder, buildFolder, currentEnv, mode, replace})=>({
    mode,
    context: path.join(userFolder, "src"),
    resolve: {
        extensions: [".js", ".jsx", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.esm-browser.js'
        }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
                loader: 'file-loader',
                options: {
                    outputPath: (url, resourcePath, context) => {
                      return `static/img/${url}`;
                    },
                    // publicPath: 'https://assets.pre.geilicdn.com/weidian-pc/pc-auto-print/0.0.1/',
                    name: '[name].[ext]?[hash]',
                    esModule: false
                }
            }
          ],
        },
        {
          test: /\.[(js)(vue)(vuex)]*$/,
          enforce: "pre",
          use: [require('./lib/util-get-replace-loader')(replace, currentEnv)],
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: "pages/index.html", //Name of file in ./build/
        template: "index.html", //Name of template in ./src
        hash: false,
      }),
    ]
})