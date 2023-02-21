const sh = require('shelljs');
const fs = require('fs')
const path = require('path')
const logUtil = require('./util-log')

var _undefined = void 0

function formatArgs(argv) {
  var obj = {}

  for (var i = 0, len = argv.length; i < len; i++) {
    if (/\=/.test(argv[i])) {
      var subArr = argv[i].split('=');

      if (subArr[1] !== _undefined && subArr[1] !== 'undefined') {
        obj[subArr[0]] = subArr[1]
      }
    }
  }

  return obj
}

function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
      var pathname = path.join(dir, file)
      if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback)
      } else if (fs.statSync(pathname).isFile()) {
          callback(pathname)
      }
  })
}

async function getGitVersion() {
  let gitVersion = undefined
  const sh = new Shell()
  const res = await sh.exec(`git symbolic-ref --short HEAD`);
  const data = res.split('/');
  if (data[0] !== 'publish') {
    logUtil.warn('注意: git分支名称不符合规范，参考: publish/0.0.1');
    return undefined;
  }
  if (!(data[1] && /^\d+\.\d+\.\d+$/.test(data[1]))) {
    logUtil.warn('注意: git分支名称不符合规范，参考: publish/0.0.1');
    return undefined;
  }
  gitVersion = data[1];
  return gitVersion;
}

class Shell {
  constructor() {
    this.shell = sh;
  }
  exec(command) {
    return new Promise((resolve, reject) => {
      sh.exec(
        command,
        {
          async: true,
          silent: false  // 不将程序输出回显到控制台
        },
        (code, stdout, stderr) => {
          stdout = stdout.toString().trim();
          if (code === 0) {
            if (stderr) {
              console.error(stderr.toString().trim());
            }
            resolve(stdout);
          } else {
            if (stdout && stderr) {
              console.error(`\n${stdout}`);
            }
            reject(new Error(stderr || stdout));
          }
        }
      );
    });
  }
}

module.exports = {
  formatArgs,
  Shell,
  travel,
  getGitVersion
}
