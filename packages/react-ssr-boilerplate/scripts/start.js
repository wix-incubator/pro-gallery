/* eslint-disable no-console */
process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

require('@babel/register')({
  plugins: [
    [
      'css-modules-transform',
      {
        camelCase: true,
        extensions: ['.css', '.scss'],
        generateScopedName: '[hash:base64]'
      }
    ],
    'dynamic-import-node'
  ]
});

const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const express = require('express');
const openBrowser = require('react-dev-utils/openBrowser');
const path = require('path');
const {
  choosePort,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils');

const { applyDevMiddleware } = require('./utils/devMiddleware');
const { purgeCacheOnChange } = require('./utils/purgeCacheOnChange');

process.on('unhandledRejection', err => {
  throw err;
});

const DEFAULT_PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const isInteractive = process.stdout.isTTY;
const server = express();

// We need to "inject" the dev middleware higher up in the stack of middlewares,
// so applyDevMiddleware needs to happen before server.use()
applyDevMiddleware(server);

server.use((req, res) => {
  // We use "require" inside this function
  // so that when purgeCacheOnChange() runs we pull in the most recent code.
  // https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e
  const { app } = require('../server/app');
  app(req, res);
});

choosePort(HOST, DEFAULT_PORT).then(port => {
  if (!port) {
    return;
  }

  const urls = prepareUrls('http', HOST, port);

  server.listen(port, HOST, err => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }

    console.log(chalk.white('\n\tStarting dev server...'));

    openBrowser(urls.localUrlForBrowser);

    purgeCacheOnChange(path.resolve(__dirname, '../'));

    console.log(
      chalk.blue(`
        Running locally at ${urls.localUrlForBrowser}
        Running on your network at ${urls.lanUrlForConfig}:${port}
      `)
    );
  });
});
