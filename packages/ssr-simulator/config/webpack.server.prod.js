const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { getAppEnv } = require('./env');

const env = getAppEnv();
const { PUBLIC_URL = '' } = env.raw;

const resolvePath = relativePath => path.resolve(__dirname, relativePath);

if (env.raw.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
  mode: 'production',
  target: 'node',
  node: {
    __dirname: true
  },
  entry: './server/app.js',
  output: {
    path: resolvePath('../build'),
    filename: 'server.js',
    publicPath: PUBLIC_URL + '/',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'css-modules-transform',
              {
                camelCase: true,
                extensions: ['.css', '.scss'],
                generateScopedName: '[hash:base64]',
                ignore: 'src/styles'
              }
            ],
            'dynamic-import-node'
          ]
        }
      },
      {
        test: /\.s?css$/,
        exclude: [resolvePath('../src/styles')],
        use: [
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: true
            }
          },
          'sass-loader',
          'import-glob-loader'
        ]
      }
    ]
  },
  externals: [nodeExternals()]
};
