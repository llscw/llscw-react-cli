const express = require('express');
const webpack = require('webpack');
const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const targetRootPath = process.cwd();
const app = express();
// const config = require(path.join(targetRootPath, 'webpack.config.js')); // 引入配置文件
const config = require('./webpack.dev.js'); // 引入配置文件
const compiler = webpack(config); // 初始化编译器

// 使用webpack-dev-middleware中间件
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// 使用webpack-hot-middleware中间件，配置在console台输出日志
app.use(webpackHotMiddleware(compiler));

// 使用静态资源目录，才能访问到/dist/index.html
// app.use(express.static(config.output.path))

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
