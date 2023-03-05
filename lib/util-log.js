const chalk = require('chalk');
chalk.level = 2

module.exports = {
  log(content) {
    console.log(content)
  },
  warn(content) {
    console.log(chalk.yellow(content))
  },
  error(content) {
    console.log(chalk.red(content))
  }
}