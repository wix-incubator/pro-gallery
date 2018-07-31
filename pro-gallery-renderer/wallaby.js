module.exports = function (wallaby) {
  const config = require('yoshi/config/wallaby-mocha')(wallaby);
  config.tests.push({
    pattern: 'test/e2e/*',
    ignore: true
  });
  return config;
};
