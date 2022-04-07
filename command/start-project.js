const path = require('path');
const { Shell } = require('../lib/utils');

// 目标文件夹 根路径
let targetRootPath = process.cwd();
// 脚手架模版文件 路径
let server_path = path.resolve(__dirname, '../server/server.js')

// 本地调试 热更新
const start_path = path.resolve(targetRootPath, 'node_modules/llscw-react-mechanic/server.js')
// 本地打包
const build_path = path.resolve(targetRootPath, 'node_modules/llscw-react-mechanic/webpack.common.js')
function startProject(env) {
  const sh = new Shell()
  if(env === 'dev') {
    sh.exec(`node ${start_path} ${env}`)
  }else {
    // sh.exec(`npx webpack --mode=production`)
    sh.exec(`npx webpack build --config ${build_path}`)
  }
  
}

module.exports = startProject;
