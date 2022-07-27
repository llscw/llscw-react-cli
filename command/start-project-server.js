/**
 * 待处理：
 * output目录 自动读取对应webpack设置
 */

const path = require('path');
const fs = require('fs')
const { Shell, getNpmPackageMessage, formatArgs } = require('../lib/utils');

// node获取用户home目录 获取 桌面路径
const logUtil = require('../lib/util-log')

const sh = new Shell()

// 目标文件夹 根路径
let targetRootPath = process.cwd();

function init() {
  const customWebpackPath = path.resolve(targetRootPath, 'llscw.config.js')
  const llscwScaffold = require(customWebpackPath).llscwScaffold
  console.log(llscwScaffold,'???Xxxaaa')
  
  let llscwScaffoldName = getNpmPackageMessage(llscwScaffold).name
  console.log(llscwScaffoldName,'???Xxxaaa---')
  
  // 本地调试 热更新
  const start_path_csr = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.csr.dev.js`)
  const start_path_ssr = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.ssr.dev.js`)

  const build_path_csr = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.csr.prod.js`)
  const build_path_ssr = path.resolve(targetRootPath, `node_modules/${llscwScaffoldName}/webpack.ssr.prod.js`)
  
  return {
    llscwScaffold,
    start_path_csr,
    start_path_ssr,
    build_path_csr,
    build_path_ssr
  }
}

async function startProject(env) {
  const {
    start_path_csr,
    start_path_ssr,
    build_path_csr,
    build_path_ssr,
    llscwScaffold
  } = init()

  await scaffoldInit(llscwScaffold)
  if(env === 's:dev-prod') {
    const build = path.join(targetRootPath, '/dist')
    console.log(path.resolve(targetRootPath, '/dist'),'=====',path.resolve(targetRootPath, 'dist'))
    sh.exec(`concurrently \"node ${start_path_csr} currentEnv=${env} userFolder=${targetRootPath}\" \"node ${start_path_ssr} currentEnv=${env} userFolder=${targetRootPath}\" \"npx serve -d ${build} -p 3059\"`, false)
  }else {
    sh.exec(`node ${build_path_csr} currentEnv=${env} userFolder=${targetRootPath} && node ${build_path_ssr} currentEnv=${env} userFolder=${targetRootPath}`, false)
  }
  
}

async function scaffoldInit(name) {
  logUtil.warn('开始检测脚手架...')
  if(fs.existsSync(path.join(targetRootPath,'package.json'))) {
    const config = JSON.parse(fs.readFileSync(path.join(targetRootPath,'package.json'), 'utf-8'))
    const {name: llscwScaffoldName, version: llscwScaffoldVersion} = getNpmPackageMessage(name)
    if(!(config.devDependencies[llscwScaffoldName] || config.dependencies[llscwScaffoldName])) {
      logUtil.warn(`安装脚手架[${name}]...`)
      await sh.exec(`npm i ${name} -D`)
    } else if (
      (config.devDependencies[llscwScaffoldName] && (llscwScaffoldVersion !== config.devDependencies[llscwScaffoldName])) ||
       config.dependencies[llscwScaffoldName] && (llscwScaffoldVersion !== config.dependencies[llscwScaffoldName])) {
      logUtil.warn(`更新脚手架[${name}]...`)
      await sh.exec(`npm i ${name} -D`)
    }
  }
  logUtil.warn('检测完成...')
}

module.exports = startProject;
