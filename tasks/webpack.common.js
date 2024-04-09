module.exports = {
  entry: [
    './dialogue.js'
  ],
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/
    }]
  },
  externals: ['Origo'],
  resolve: {
    extensions: ['.*', '.js', '.scss']
  }
};
