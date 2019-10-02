const dotenvVars = require('dotenv').config().parsed;

const packageJson = require('../package.json');
process.env.VERSION = packageJson.version;

const BAKED_IN_ENV_VARS = ['NODE_ENV', 'PUBLIC_URL', 'VERSION'];

function getAppEnv() {
  const raw = Object.keys(dotenvVars || {}).reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      NODE_ENV: process.env.NODE_ENV,
      PUBLIC_URL: process.env.PUBLIC_URL,
      VERSION: process.env.VERSION
    }
  );

  const forWebpackDefinePlugin = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      if (BAKED_IN_ENV_VARS.includes(key)) {
        env[key] = JSON.stringify(raw[key]);
      } else {
        env[key] = `process.env.${key}`;
      }
      return env;
    }, {})
  };

  const forIndexHtml = JSON.stringify({
    env: raw
  });

  return { raw, forIndexHtml, forWebpackDefinePlugin };
}

module.exports = {
  getAppEnv
};
