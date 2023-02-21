const webpack = require('webpack')
const path = require('path')
const logUtil = require('./lib/util-log')
const gulpFunc = require('./gulpfile')

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
    replace,
} = customWebpackConfig

const finalWebpackConfig = merge(require("./webpack.common")({ ...finalConfig, replace, mode: "development" }), {
    entry: {
        index: ["./index.js"]
    },
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(userFolder, "build"),
        filename: "static/index/[name].js",
        publicPath: '../', // 服务器脚本会用到
        // library: '[name]_[hash]',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                  'vue-style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ],
    },
}, webpackConfig)

gulpFunc(() => {
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

        logUtil.pass("Compilication done.")

        const time = (new Date(Date.now() - currentTime)).getSeconds()
        logUtil.pass("构建共花费：" + time + 's')

        // logUtil.scaffold('[0] http://h5.dev.weidian.com:3023/pages')
        // logUtil.scaffold('建议将 localhost 绑定到域名 h5.dev.weidian.com, 防止接口请求时出现跨域问题\n')
    })
})
