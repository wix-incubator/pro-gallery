const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { getAppEnv } = require('./env');

const env = getAppEnv();
const { PUBLIC_URL = '' } = env.raw;

const resolvePath = relativePath => path.resolve(__dirname, relativePath);

/**
 * This function generates a webpack config object for the client-side bundle.
 */
module.exports = function(envType) {
  const IS_DEV = envType === 'development';
  const IS_PROD = envType === 'production';
  const config = {};

  config.mode = envType;

  config.devtool = IS_DEV ? 'cheap-module-source-map' : 'source-map';

  config.entry = IS_DEV
    ? [
        'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
        resolvePath('../src/index.js')
      ]
    : {
        polyfills: resolvePath('../src/polyfills.js'),
        main: resolvePath('../src/index.js')
      };

  config.output = IS_DEV
    ? {
        path: resolvePath('../build'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: PUBLIC_URL + '/'
      }
    : {
        path: resolvePath('../build'),
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: PUBLIC_URL + '/'
      };

  config.module = {
    rules: [
      // ESLint
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter
            },
            loader: 'eslint-loader'
          }
        ],
        include: resolvePath('../src')
      },

      // Babel
      {
        test: /\.(js|jsx)$/,
        include: resolvePath('../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: IS_DEV,
          compact: IS_PROD
        }
      },

      // CSS Modules
      {
        test: /\.module\.s?css$/,
        include: [resolvePath('../src')],
        use: [
          IS_DEV && 'style-loader',
          IS_PROD && MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'sass-loader',
          'import-glob-loader'
        ].filter(Boolean)
      },

      // CSS
      {
        test: /\.s?css$/,
        include: [resolvePath('../src')],
        exclude: [/\.module\.s?css$/],
        use: [
          IS_DEV && 'style-loader',
          IS_PROD && MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'sass-loader',
          'import-glob-loader'
        ].filter(Boolean)
      }
    ].filter(Boolean)
  };

  config.optimization = IS_DEV
    ? {}
    : {
        minimizer: [
          new UglifyJsPlugin({
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
              output: {
                comments: false
              }
            }
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      };

  config.plugins = [
    new webpack.DefinePlugin(env.forWebpackDefinePlugin),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new LodashModuleReplacementPlugin(),
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    IS_DEV && new CaseSensitivePathsPlugin(),
    IS_DEV && new ErrorOverlayPlugin(),
    IS_PROD &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css'
      }),
    IS_PROD &&
      new ManifestPlugin({
        fileName: 'asset-manifest.json'
      }),
    new ReactLoadablePlugin({
      filename: 'build/react-loadable.json'
    })
  ].filter(Boolean);

  config.node = {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  };

  return config;
};
