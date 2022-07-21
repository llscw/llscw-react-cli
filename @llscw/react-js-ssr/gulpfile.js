const { watch, series } = require('gulp');
const path = require("path")
const rootPath = process.cwd()

module.exports = (callback) => {
  function clean(cb) {
    // body omitted
    cb();
  }
  
  function javascript(cb) {
    console.log('测试数据')
    callback()
    // execSync('pm2 restart index')
    // body omitted
    cb();
  }
  
  // 或者关联一个任务组合
  watch(path.join(rootPath, 'src/**'), { queue: true }, series(clean, javascript));
}