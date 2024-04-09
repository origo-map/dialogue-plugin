const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../../origo/plugins/dialogue`,
    publicPath: '/build/js',
    filename: 'dialogue.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Dialogue'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './',
    port: 9008,
    devMiddleware: {
      writeToDisk: true
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'resources/svg/material-icons.svg', to: 'material-icons.svg' }
      ]
    })
  ]
});
