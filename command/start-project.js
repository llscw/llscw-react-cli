const path = require('path');
const fs = require('fs')
const { Shell, getNpmPackageMessage, formatArgs } = require('../lib/utils');
const { execSync } = require('child_process')

// node获取用户home目录 获取 桌面路径
const USER_HOME = process.env.HOME || process.env.USERPROFILE
const fse = require('fs-extra')
const logUtil = require('../lib/util-log')

const sh = new Shell()

// 目标文件夹 根路径
let targetRootPath = process.cwd();
// 脚手架模版文件 路径
// let server_path = path.resolve(__dirname, '../server/server.js')

function init() {
  const customWebpackPath = path.resolve(targetRootPath, 'llscw.config.js')
  const llscwScaffold = require(customWebpackPath).llscwScaffold
  let llscwScaffoldName = getNpmPackageMessage(llscwScaffold).name

  // 本地调试 热更新
  const server_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/server.js`)
  const dev_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.dev.js`)
  let start_path = ''
  try {
    let fileFlag = fs.statSync(server_path).isFile()
    start_path = fileFlag ? server_path : dev_path
  }catch(err) {
    start_path = dev_path
  }

  // 本地打包
  const build_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.prod.js`)
  
  return {
    llscwScaffold,
    start_path,
    build_path
  }
}

async function startProject(env) {
  const {
    start_path,
    build_path,
    llscwScaffold
  } = init()
  await scaffoldInit(llscwScaffold)
  if(env === 'dev-prod') {
    sh.exec(`node ${start_path} currentEnv=${env} userFolder=${targetRootPath}`, false)
  }else {
    sh.exec(`node ${build_path} currentEnv=${env} userFolder=${targetRootPath}`, false)
  }
  
}

async function scaffoldInit(name) {
  logUtil.warn('开始检测脚手架...')
  if(fs.existsSync(path.join(targetRootPath,'package.json'))) {
    const config = JSON.parse(fs.readFileSync(path.join(targetRootPath,'package.json'), 'utf-8'))
    const {name: llscwScaffoldName, version: llscwScaffoldVersion} = getNpmPackageMessage(name)
    if(!(config.devDependencies[llscwScaffoldName] || config.dependencies[llscwScaffoldName])) {
      logUtil.warn(`安装脚手架[${name}]...`)
      await sh.exec(`npm i ${name} -D --save-exact`)
    } else if (
      (config.devDependencies[llscwScaffoldName] && (llscwScaffoldVersion !== config.devDependencies[llscwScaffoldName])) ||
       config.dependencies[llscwScaffoldName] && (llscwScaffoldVersion !== config.dependencies[llscwScaffoldName])) {
      logUtil.warn(`更新脚手架[${name}]...`)
      await sh.exec(`npm i ${name} -D --save-exact`)
    }
  }
  logUtil.warn('检测完成...')
}

module.exports = startProject;
