// For output.filename configuration:
//
// Change "component-name" in this file to your real component name!
// DO NOT CHANGE "[name]", which denotes the entry property names that webpack automatically inserts for you!

module.exports = {
  entry: {
    dev: ['webpack/hot/dev-server', './main.js', './demo/demo.js'],
    dist: ['./main.js']
  },
  output: {
    path: './',
    filename: 'build/[name].pageviewer.js',
    libraryTarget: 'umd'
  },
  contentBase: './demo', // for webpack dev server
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass' // sass -> css -> javascript -> inline style
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      { 
        test: /\.(jpg|gif)$/, 
        loader: 'url-loader?limit=10000' 
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=image/png'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=build/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  }
};