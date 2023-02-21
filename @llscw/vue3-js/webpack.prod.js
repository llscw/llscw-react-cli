const webpack = require('webpack')
const path = require('path')
const logUtil = require('./lib/util-log')
const fs = require('fs')
const gulpFunc = require('./gulpfile')

const rootPath = process.cwd()

const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { formatArgs, travel, getGitVersion } = require('./lib/utils')
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
    replace,
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, replace, mode: "production" }), {
    entry: {
        index: ["./index.js"]
    },
    output: {
        path: path.resolve(userFolder, "build"),
        filename: "static/index/[name].js",
        publicPath: '../', // 服务器脚本会用到
        // library: '[name]_[hash]',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "static/index/style.css"
        }),
        new BundleAnalyzerPlugin(
            Object.assign({
                analyzerMode: 'disabled'
            }, bundleAnalyzerOptions)
        ),
    ]
}, webpackConfig)

const currentTime = Date.now()
logUtil.pass("webpack: Compiling...")
webpack(finalWebpackConfig, async (err, stats) => {
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
    }

    let gitVersion = await getGitVersion()

    logUtil.pass("Compilication done.")

    const time = (new Date(Date.now() - currentTime)).getSeconds()
    logUtil.pass("打包共花费：" + time + 's')
    let fileSize = 0
    travel(path.join(rootPath, 'build'), (pathname) => {
        fs.stat(pathname, 'utf-8', (err, stats) => {
            if (err) return console.error(err)
            if (stats.size / 1000000 > 1) {
                logUtil.error('BigFile：' + pathname + '：' + (stats.size / 1000000).toFixed(2) + 'MB')
            }
            fileSize += stats.size
        })
    })

    setTimeout(() => logUtil.pass('打包产物大小：' + (fileSize / 1000000).toFixed(2) + 'MB'))
})
