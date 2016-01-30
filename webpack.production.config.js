var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'web'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!react-native-code-push)/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['', '.web.js', '.js', '.jsx'],
    alias: {
      "react-native": "react-native-web",
      "ReactNativeART": "react-art"
    }
  },
  plugins: [
      new webpack.DefinePlugin({
          "process.env": {NODE_ENV: JSON.stringify("production")}
      }),
  ],
};

module.exports = config;