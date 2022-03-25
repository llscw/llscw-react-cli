const path = require('path');
const { Shell } = require('../lib/utils');

// 目标文件夹 根路径
let targetRootPath = process.cwd();
// 脚手架模版文件 路径
let server_path = path.resolve(__dirname, '../server/server.js')

const start_path = path.resolve(targetRootPath, 'node_modules/llscw-react-mechanic/server.js')
function startProject(env) {
  const sh = new Shell()
  if(env === 'dev') {
    sh.exec(`node ${start_path} ${env}`)
  }else {
    sh.exec(`npx webpack --mode=production`)
  }
  
}

module.exports = startProject;
