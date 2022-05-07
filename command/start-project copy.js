/**
 * 桌面下新建文件夹 .llscwScaffold 存储对应脚手架
 * 存在问题：
 * webpack 的 部分 loader 对于路径存在要求，如：css-loader之类的，
 * 虽然把脚手架抽离到 新文件夹 中，但是对应使用到的 loader 文件，还是需要安装在需要运行的项目目录下的
 */ 


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
let cur_path = path.resolve(__dirname, 'engine.js')

function init() {
  const customWebpackPath = path.resolve(targetRootPath, 'llscw.config.js')
  const llscwScaffold = require(customWebpackPath).llscwScaffold
  
  let llscwScaffoldName = getNpmName(llscwScaffold)
  
  // 本地调试 热更新
  // const start_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/server.js`)
  const start_path = path.resolve(USER_HOME, '.llscwScaffold/scaffold', `node_modules/${llscwScaffoldName}/server.js`)
  // 本地打包
  const build_path = path.resolve(USER_HOME, '.llscwScaffold/scaffold', `node_modules/${llscwScaffoldName}`)
  // const build_path = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.prod.js`)
console.log(build_path,'你好呀大法师地方')
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

  if(env === 'dev') {
    sh.exec(`node ${start_path} currentEnv=${env} userFolder=${targetRootPath}`)
  }else {
    scaffoldInit(llscwScaffold)
    console.log(targetRootPath,'你好密密麻麻密密麻麻买买买')
    // sh.exec(`npx webpack --mode=production`)
    // execSync(`cd ${build_path}`)
    // sh.exec(`cd ${build_path}`)
    // console.log(build_path,'uuuuu',sh.exec('pwd'))
    sh.exec(`cd ${build_path} && pwd && node ./webpack.prod.js userFolder=${targetRootPath}`)
  }
  
}

function scaffoldInit(name) {
  // 需要在这里处理 llscwScaffold 
  const targetPath = path.join(USER_HOME, '.llscwScaffold/scaffold')
  fse.ensureDirSync(targetPath)
  const curPath = targetRootPath
  console.log(chalk.yellow('开始检测脚手架...'))
  if(fs.existsSync(path.join(targetPath, 'package.json'))) {
    const {
      dependencies
    } = require(path.join(targetPath, 'package.json'))
    const cli_name = getNpmName(name)
    const cli_version = name.split(cli_name+'@')[1]
    console.log(cli_name,'======',cli_version)
    if(dependencies[cli_name]) {
      if(dependencies[cli_name] !== cli_version) {
        execSync(`cd ${targetPath} && npm i ${name} && cd ${curPath}`)
      }else if(cli_version === 'latest') {
        execSync(`cd ${targetPath} && npm i ${name} && cd ${curPath}`)
      }
    }else {
      execSync(`cd ${targetPath} && npm i ${name} && cd ${curPath}`)
    }
  }else {
    execSync(`cd ${targetPath} && npm init -y && npm i ${name} && cd ${curPath}`)
  }
  // execSync(`cd ${targetPath} && cd ${curPath}`)
  console.log(chalk.yellow('检测完成...'))
}

module.exports = startProject;
