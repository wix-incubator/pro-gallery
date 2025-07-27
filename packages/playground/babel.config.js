module.exports = function (api) {
  // Set default environment if not provided (fixes CI builds)
  const env = process.env.NODE_ENV || process.env.BABEL_ENV || 'production';
  
  // Cache based on the environment
  api.cache.using(() => env);

  return {
    presets: [
      ['react-app', { runtime: 'automatic' }]
    ],
    env: {
      development: {
        presets: [['react-app', { runtime: 'automatic' }]]
      },
      test: {
        presets: [['react-app', { runtime: 'automatic' }]]
      },
      production: {
        presets: [['react-app', { runtime: 'automatic' }]]
      }
    }
  };
}; 