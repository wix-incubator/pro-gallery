process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
  throw err;
});

const jest = require('jest');

require('../config/env');

const argv = process.argv.slice(2);

if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

if (process.env.CI) {
  argv.push('--runInBand');
}

jest.run(argv);
