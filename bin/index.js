#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const initial = require('../command/initial');
const generate = require('../command/generator');

const pkg = require('../package.json')

let config = {};
// 配置文件如果存在则读取
if(fs.existsSync(path.resolve('llscw.config.js'))){
  config = require(path.resolve('llscw.config.js'));
}

program
  .version(pkg.version,'-v, --version')
  .command('init')
  .description('初始化 llscw config 配置文件')
  .action(initial);

program
  .command('create [template]')
  .description('生成 llscw 模板')
  .action(function(template){
    generate(template);
  });

program.parse(process.argv);