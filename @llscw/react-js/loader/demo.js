

module.exports = function(source) {
  console.log(source,'====')
  return `
    import 'webpack-hot-middleware/client?hot=true&path=/__webpack_hmr&timeout=20000&reload=true';
    if (module.hot) {
      module.hot.accept();
    };
  ` + source
}