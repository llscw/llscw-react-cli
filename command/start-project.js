const path = require('path');
const fs = require('fs');
const fse = require('fs-extra')
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const genConfig = require('../tpl/getConfig');
const { writeFileTree, resolveJson, travel, deleteFolderRecursive, Shell } = require('../lib/utils');

// 目标文件夹 根路径
let targetRootPath = process.cwd();
// 脚手架模版文件 路径
let server_path = path.resolve(__dirname, '../server/server.js')

const start_path = path.resolve(targetRootPath, 'node_modules/aaa-test/server.js')

function startProject(env) {
  console.log(start_path,'你好',env)
  const sh = new Shell()
  sh.exec(`node ${start_path} ${env}`)
}

module.exports = startProject;
