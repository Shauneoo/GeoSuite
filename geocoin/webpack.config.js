var path = require('path');
var srcPath = path.join(__dirname, './src/');
var buildPath = path.join(__dirname, '/public');

module.exports = {
  context: srcPath,
  entry: path.join(srcPath, 'index.js'),
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  }
};
