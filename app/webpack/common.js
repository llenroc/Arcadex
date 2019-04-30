const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, '..', 'src')
const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const ASSETS_DIR = path.resolve(SRC_DIR, 'assets')

module.exports = {
  entry: path.resolve(SRC_DIR, 'index.jsx'),
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': SRC_DIR,
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'ArcadeX',
      favicon: path.resolve(ASSETS_DIR, 'favicon.ico'),
      meta: {
        description: 'Decentralized arcades on DEXON',
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new AssetsPlugin({
      prettyPrint: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /.*\.(gif|png|jpe?g|svg|ico)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '/[folder]_[name]_[hash:7].[ext]',
          outputPath: 'assets'
        }
      },
    ]
  }
}
