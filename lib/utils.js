const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const readPkg = require('read-pkg');
const { execSync } = require('child_process');
const sh = require('shelljs');
var _undefined = void 0

function getNpmName(name) {
  let llscwScaffoldName = name
  if(llscwScaffoldName.match(/\d+(.\d+){0,2}|@latest/)) {
      let tmp = llscwScaffoldName.split('@')
      tmp.pop()
      llscwScaffoldName = tmp.join('@')
  }
  return llscwScaffoldName
}

async function writeFileTree (dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name)
    fsExtra.ensureDirSync(path.dirname(filePath))
    fsExtra.writeFileSync(filePath, files[name])
  })
}


function resolveJson (context, name = 'package.json') {
  if (fs.existsSync(path.join(context, name))) {
    return readPkg.sync({
      cwd: context
    })
  }
  return {}
}

function pusBranch() {
  try {
    execSync(`git add . && git commit -m 'release project' && git push`);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 遍历目录，回调函数中 执行对应操作
 * @param {string} dir - 路径
 * @param {string} dir_name - 需要切割的路径名称
 * @param {function} callback 
 *  (
 *    args[0]: string, - 不包含文件名的路径
 *    args[1]: string, - 项目中 完整路径
 *    args[2]: string, - 项目跟目录
 *  ) => (?void)
 */
async function travel(dir, dir_name, callback) {
  fs.readdirSync(dir).forEach((file) => {
      var pathname = path.join(dir, file)
      if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, dir_name, callback)
      } else if (fs.statSync(pathname).isFile()) {
          callback(pathname.split(dir_name)[1], pathname, dir)
      }
  })
}

/**
 * 递归删除文件和文件夹
 * @param {string} path 
 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

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
            console.log(stdout,'====asdfasdf')
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
  writeFileTree,
  resolveJson,
  pusBranch,
  travel,
  deleteFolderRecursive,
  getNpmName,
  formatArgs,
  Shell,
}
