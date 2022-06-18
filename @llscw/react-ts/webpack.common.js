const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// const ESLintPlugin = require('eslint-webpack-plugin');
/**
 * mini-css-extract-plugin 为link引入css
 * style-loader 为插入<style></style>
 * 开发模式采用 style-loader，生产模式采用 mini-css-extract-plugin
 * 注：
 * 推荐 production 环境的构建将 CSS 从你的 bundle 中分离出来，这样可以使用 CSS/JS 文件的并行加载。
 * 这可以通过使用 mini-css-extract-plugin 来实现，因为它可以创建单独的 CSS 文件。
 * 对于 development 模式（包括 webpack-dev-server），你可以使用 style-loader，
 * 因为它可以使用多个 标签将 CSS 插入到 DOM 中，并且反应会更快。
 * https://webpack.docschina.org/plugins/mini-css-extract-plugin/
 */

module.exports = ({userFolder, buildFolder, currentEnv, mode})=>({
    mode,
    context: path.join(userFolder, "src"),
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    
    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                include: path.resolve(userFolder, 'src'),
                loader: "ts-loader" 
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "assets/img/[name].[ext]?[hash]",
                    esModule: false,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html", //Name of file in ./dist/
            template: "index.html", //Name of template in ./src
            hash: true,
        }),
        // new ESLintPlugin({
        //     fix: true, /* 自动帮助修复 */
        //     extensions: ['js', 'json', 'tsx', 'ts'],
        //     exclude: 'node_modules'
        // }),
    ]
})

