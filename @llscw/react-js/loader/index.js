/**
 * 实现如下方法：
 * 导入webpack-hot-middleware中间件，同时写入模块热更新处理函数
 * if (module.hot) {
 *   module.hot.accept();
 * }
 * 
 * 工具：
 * 1. https://astexplorer.net/
 * 
 * 参考文档：
 * 1. https://babeljs.io/docs/en/babel-types
 * 2. https://juejin.cn/post/6844903731088064525#heading-1
 * 3. https://juejin.cn/post/6844903746804137991
 */
const babel = require('@babel/core')
const t = require('@babel/types')
const path = require('path')
const USER_HOME = process.env.HOME || process.env.USERPROFILE

module.exports = function (code) {
  // 注：路径错误，应该是 process.cwd() + node_modules/webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=20000&reload=true
  // const TARGET_PKG_NAME = path.resolve(USER_HOME, '.llscwScaffold/scaffold', 'node_modules/webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=20000&reload=true')
  const isTrueRequire = node => {
    const { callee, arguments } = node;
    return callee.name === 'require' && arguments.some(item => item.value === TARGET_PKG_NAME);
  };

  const visitor = {

    // 注：插入自定义import语句
    Program(path) {
      const bodyPath = path.get('body')
      // 判断是否已经导入对应的 模块，防止死循环（不加这个判断，每次都会插入我们自定义的新import语句，因为新加了，然后又会多循环一次，循环的这一次没判断是否存在，所以又加了条语句，死循环啦～）
      const hasRequireOrImport = () => {
        return bodyPath.some((nodePath) => {
          // 判断是否是 import b from 'b'; 语句
          if (nodePath.isImportDeclaration()) {
            return nodePath.get('source').isStringLiteral() && nodePath.get('source').node.value === TARGET_PKG_NAME;
          }
          // 判断是否是 const a = require('a'); 语句
          if (nodePath.isVariableDeclaration()) {
            const declaration = nodePath.get('declarations')[0];
            return t.isCallExpression(declaration.get('init')) && isTrueRequire(declaration.get('init').node);
          }
          // 判断是否是 require('c'); 语句
          if (nodePath.isExpressionStatement()) {
            return isTrueRequire(nodePath.get('expression').node);
          }
        })
      }
      if (!hasRequireOrImport()) {
        const importDeclaration = t.ImportDeclaration([], t.StringLiteral(TARGET_PKG_NAME));
        path.get('body')[0].insertBefore(importDeclaration);
      }

      const hasDefined = bodyPath.some(nodePath=>{
        if(t.isIfStatement(nodePath)) {
          return t.isMemberExpression(nodePath.get('test')) && nodePath.get('test').node.object.name === 'module'
        }
      })

      if(!hasDefined) {
        const Expression = t.MemberExpression(t.Identifier('module'), t.Identifier('hot'))
        const CallExpression = t.CallExpression(
          t.MemberExpression(
            t.MemberExpression(t.Identifier('module'), t.Identifier('hot')),
            t.Identifier('accept')
        ), [])
        const Statement = t.BlockStatement([t.ExpressionStatement(CallExpression)])
        const IfStatement = t.IfStatement(Expression,Statement)
        const len = path.get('body').length
        path.get('body')[len - 1].insertAfter(IfStatement)
      }
    },
  }

  const res = babel.transform(code, {
    plugins: [
      {
        visitor: visitor
      }
    ]
  })
  // console.log(res.code,'======')
  return res.code
}