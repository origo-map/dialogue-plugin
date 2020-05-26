const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../../origo_v2/plugins/dialogue`,
    publicPath: '/build/js',
    filename: 'dialogue.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Dialogue'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'sass-loader'
        }
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'inline-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new WriteFilePlugin()
  ],
  devServer: {
    contentBase: './',
    port: 9008
  }
});
