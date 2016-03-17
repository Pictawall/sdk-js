'use strict';

const webpack = require('webpack');

const fs = require('fs');
const file = fs.readFileSync('./.babelrc');

//const babelConfig = require('./.babelrc');
const babelConfig = JSON.parse(file);

module.exports = {
  entry: {
    app: './src/app_webpack.js'
  },
  output: {
    path: './dist/dev',
    filename: 'pictawall.sdk.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'inline-source-map',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelConfig
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    loaders: []
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_VERSION: JSON.stringify(require('./package.json').version),
      BUILD_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  const loaders = module.exports.module.loaders;
  const plugins = module.exports.plugins;

  // remove log lines.
  loaders.push({
    test: /\.js$/,
    loader: 'strip-loader?strip[]=console.log'
  });

  module.exports.devtool = false;

  // minify.
  module.exports.output.path = './dist';
  module.exports.output.filename = 'pictawall.sdk.min.js';
  plugins.push(new webpack.optimize.UglifyJsPlugin({ comments: false }));
}
