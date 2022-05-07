const path = require('path');
const fs = require('fs')
const { Shell, getNpmName, formatArgs } = require('../lib/utils');
const { execSync } = require('child_process')

// node获取用户home目录 获取 桌面路径
const USER_HOME = process.env.HOME || process.env.USERPROFILE
const fse = require('fs-extra')
const chalk = require('chalk');
chalk.level = 2

const sh = new Shell()

// 目标文件夹 根路径
let targetRootPath = process.cwd();
// 脚手架模版文件 路径
let server_path = path.resolve(__dirname, '../server/server.js')

function init() {
  const customWebpackPath = path.resolve(targetRootPath, 'llscw.config.js')
  const llscwScaffold = require(customWebpackPath).llscwScaffold
  
  let llscwScaffoldName = getNpmName(llscwScaffold)
  
  // 本地调试 热更新
  const start_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/server.js`)
  // const start_path = path.resolve(USER_HOME, '.llscwScaffold/scaffold', `node_modules/${llscwScaffoldName}/server.js`)
  // 本地打包
  // const build_path = path.resolve(USER_HOME, '.llscwScaffold/scaffold', `node_modules/${llscwScaffoldName}`)
  const build_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.prod.js`)
  
  return {
    llscwScaffold,
    start_path,
    build_path
  }
}

function startProject(env) {
  const {
    start_path,
    build_path,
    llscwScaffold
  } = init()

  scaffoldInit(llscwScaffold)
  if(env === 'dev') {
    sh.exec(`node ${start_path} currentEnv=${env} userFolder=${targetRootPath}`)
  }else {
    sh.exec(`node ${build_path} userFolder=${targetRootPath}`)
  }
  
}

function scaffoldInit(name) {
  console.log(chalk.yellow('开始检测脚手架...'))
  // execSync(`npm i ${name} -D`)
  console.log(chalk.yellow('检测完成...'))
}

module.exports = startProject;
