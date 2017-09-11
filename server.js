/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

const path = require('path');
const webpack = require('webpack');
const express = require('express');

const WebpackDevServer = require('webpack-dev-server');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    path.resolve(__dirname, 'example/index.js'),
    path.resolve(__dirname, 'example/app.scss')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', ['css?sourceMap', 'sass?sourceMap'])
    }, {
      test: /\.(woff|ttf|eot|svg|gif|jpeg|jpg|png)([\?]?.*)$/,
      loader: 'file',
      include: path.resolve(__dirname, 'node_modules'),
    }]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'example/index.html'),
      title: 'GitHub Bot UI'
    })
  ]
};

const webpackServer = new WebpackDevServer(webpack(config), {
  contentBase: 'build',
  inline: true,
  historyApiFallback: true,
  proxy: {
    '/api/*': {
      target: 'http://localhost:8081'
    }
  },
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunkModules: false,
    chunkOrigins: false,
    chunks: false,
    colors: true,
    errorDetails: true,
    hash: true,
    modules: true,
    reasons: false,
    source: false,
    timings: true,
    version: false
  }
});

const api = express();

api.get('/api/auth/github', (req, res) => {
  res.redirect('/login?code=beefcafe&state=deadbeef');
});

api.get('/api/auth/github/token', (req, res) => {
  res.json({
    token: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'eyJzdWIiOiJvY3RvY2F0IiwiaXNzIjoiZ2l0aHViLWJvdC11aSIsInN1YmlkIjoxLCJ2IjoxfQ',
      'JIkgB-cpRxkUwR26giNBUwlpzY-BnCLqdyDafVC0qik'
    ].join('.')
  });
});

const repositories = [
  {id: 1, owner: 'awesome', name: 'bulldozer', isEnabled: false, isUserAdmin: true},
  {id: 2, owner: 'awesome', name: 'github-bot-ui', isEnabled: true, isUserAdmin: true, enabledBy: 'octocat', enabledAt: new Date(2016, 3, 1)},
  {id: 3, owner: 'palantir', name: 'example-repo', isEnabled: false, isUserAdmin: true},
  {id: 4, owner: 'octocat', name: 'octodog', isEnabled: false, isUserAdmin: false},
  {id: 5, owner: 'error', name: 'error', isEnabled: false, isUserAdmin: true}
]

api.get('/api/user/repos', (req, res) => {
  setTimeout(() => res.json(repositories), 500);
});

api.route('/api/repo/:owner/:name')
  .post((req, res) => {
    const owner = req.params.owner, name = req.params.name;
    setTimeout(() => {
      if (owner === 'error' && name === 'error') {
        res.sendStatus(409);
      } else {
        const repo = repositories.find((r) => r.owner === owner && r.name === name);
        repo.isEnabled = true;
        repo.enabledBy = 'octocat';
        repo.enabledAt = new Date();
        res.status(200).json(repo);
      }
    }, 1000);
  })
  .delete((req, res) => {
    const owner = req.params.owner, name = req.params.name;
    setTimeout(() => {
      const repo = repositories.find((r) => r.owner === owner && r.name === name);
      repo.isEnabled = false;
      res.sendStatus(204);
    }, 1000);
  });

webpackServer.listen(8080, '0.0.0.0', () => {
  console.log('webpack server listening on 8080');
});

api.listen(8081, () => {
  console.log('api server listening on 8081');
});
