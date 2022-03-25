// 参考：https://www.cnblogs.com/yuanyiming/p/14800298.html
const fs = require('fs')
const {RawSource} = require('webpack-sources')

class ClearConsole {

  constructor(options) {
    let include = options && options.include;
    let removed = ['log']; // 默认清除的方法

    if (include) {
      if (!Array.isArray(include)) {
        console.error('options.include must be an Array.');
      } else if (include.includes('*')) {
        // 传入 * 表示清除所有 console 的方法
        removed = Object.keys(console).filter(fn => {
          return typeof console[fn] === 'function';
        })
      } else {
        removed = include; // 根据传入配置覆盖
      }
    }

    this.removed = removed;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ClearConsole', onClear)
    
    let assetsHandler = (assets, compilation) => {

      let removedStr = this.removed.reduce((a, b) => (a + '|' + b));

      let reDict = {
        1: [RegExp(`\\.console\\.(${removedStr})\\(\\)`, 'g'), ''],
        2: [RegExp(`\\.console\\.(${removedStr})\\(`, 'g'), ';('],
        3: [RegExp(`console\\.(${removedStr})\\(\\)`, 'g'), ''],
        4: [RegExp(`console\\.(${removedStr})\\(`, 'g'), '(']
      }

      Object.entries(assets).forEach(([filename, source]) => {
        if(/\.js$/.test(filename)) {
          let outputContent = source.source()
          Object.keys(reDict).forEach(i => {
            let [re, s] = reDict[i];
            outputContent = outputContent.replace(re, s);
          })
          compilation.assets[filename] = new RawSource(outputContent)
          // fs.writeFileSync('./test.js', compilation.assets[filename].source(), 'utf-8')
        }
      })
    }
    function onClear(compilation) {
      // Webpack 5
      if (compilation.hooks.processAssets) {
        compilation.hooks.processAssets.tap(
          { name: 'ClearConsole' },
          assets => assetsHandler(assets, compilation)
        );
      } else if (compilation.hooks.optimizeAssets) {
        // Webpack 4
        compilation.hooks.optimizeAssets.tap(
          'ClearConsole', 
          assets => assetsHandler(assets, compilation)
        );
      }
    }
  }
}

module.exports = ClearConsole