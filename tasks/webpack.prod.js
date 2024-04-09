const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const AggressiveMergingPlugin = require('webpack').optimize.AggressiveMergingPlugin;
const common = require('./webpack.common.js');

module.exports = merge(common, {
  optimization: {
    nodeEnv: 'production',
    minimize: true
  },
  performance: {
    hints: false
  },
  output: {
    path: `${__dirname}/../build/js`,
    filename: 'dialogue.min.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Dialogue'
  },
  devtool: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }
        ]
      }
    ]
  },
  plugins: [
    new AggressiveMergingPlugin(),
    new MiniCssExtractPlugin({
      filename: '../css/dialogue.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'resources/svg/material-icons.svg', to: '../svg/material-icons.svg' }
      ]
    })
  ]
});
