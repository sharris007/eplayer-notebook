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
    filename: 'build/[name].bookshelf.js',
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
        test: /\.(woff|png|jpg|gif)$/, 
        loader: 'url-loader?limit=10000' 
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=image/svg+xml'
      }
    ]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  }
};
