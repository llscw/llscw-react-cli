const path = require("path");

module.exports = ({userFolder, buildFolder, currentEnv, favicon})=>({
  context: path.join(userFolder, "src"),
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: false,
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
        },
      },
    ],
  } 
})