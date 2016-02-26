#!/usr/bin/env node

var resolvePath = require('path').resolve

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

// returns a Compiler instance
var compiler = webpack({
  entry: [
    './navigable-table.js',
    './navigable-table.css'
  ],
  output: {
    path: resolvePath(__dirname, '../dist'),
    filename: 'navigable-table.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        // loader: 'style-loader!css-loader'
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  modulesDirectories: [
    'node_modules'
  ],
  plugins: [
    new ExtractTextPlugin('navigable-table.css')
  ]
})

compiler.run(function (error, stats) {
  if (error) {
    throw error
  }
})
