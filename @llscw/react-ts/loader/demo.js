

module.exports = function(source) {
  const USER_HOME = process.env.HOME || process.env.USERPROFILE
  const TARGET_PKG_NAME = path.resolve(USER_HOME, '.llscwScaffold/scaffold', 'node_modules/webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=20000&reload=true')
  return `
    import ${TARGET_PKG_NAME};
    if (module.hot) {
      module.hot.accept();
    };
  ` + source
}