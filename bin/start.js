#!/usr/bin/env node
const program = require('commander');
const startProject = require('../command/start-project');

program
  .command('run [env]')
  .description('启动 llscw 脚手架')
  .option('-d, --debug', 'output extra debugging')
  .option('-c, --cur', 'clone in current dir')
  .action(function(env, cmd){
    startProject(env);
  });

program.parse(process.argv);