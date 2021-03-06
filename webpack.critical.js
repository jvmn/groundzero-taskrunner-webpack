const path = require('path')
const globby = require('globby')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageJson = require(path.resolve(process.env.PROJECT_CWD + '/package.json'))
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const srcPath = path.join(process.env.PROJECT_CWD, './src')

const criticalEntries = () => globby.sync(srcPath + '/**/*.critical.scss').reduce((modules, path) => {
  const name = path.split('\\').pop().split('/').pop().replace('.critical.scss', '')
  modules[name] = path
  return modules
}, {})

const aliasEntries = () => {
  const aliases = projectPath.webpackAlias
  const paths = {}
  for (const key in aliases) {
    paths[key] = path.resolve(process.env.PROJECT_CWD, aliases[key])
  }
  return paths
}
/**
 * Resources for lazy loading:
 * https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234
 * https://webpack.js.org/guides/public-path/
 */

module.exports = {
  context: srcPath,
  mode: 'production',
  entry: {
    ...criticalEntries(),
  },
  output: {
    path: process.env.MODE === 'production' ? projectPath.criticalProd : projectPath.criticalDev,
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.scss'],
    alias: { ...aliasEntries() }
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      // clean web-ui output folder before watch and build
      cleanAfterEveryBuildPatterns: ['*']
    }),
    new MiniCssExtractPlugin({
      filename: '../[name].css',
      chunkFilename: '../[name].css'
    })
  ],
  module: {
    rules: [
      // handle critical css
      {
        test: /\.critical\.scss$/,
        loader: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            },
          },
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              url: false, // use relative urls to to the css folder
              modules: false,
              sourceMap: true
            }
          },
          // Add autoprefixer to css
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: () => {
                // we include the src (/src/assets) path as our base url for file imports in the scss files
                // any url() imports in the css should be set relative to the assets folder  
                return {
                  includePaths: [srcPath + '/']
                }
              },
              additionalData: (content) => {
                // Inject package version
                const versionString = '/*! @preserve: Version: '+packageJson.version+', Build date: '+ new Date().toISOString() + ' */\n\n'
                return `${versionString} ${content}`
              },
              sourceMap: true
            }
          },
        ]
      },
    ]
  },
  stats: {
    // assets: false,
    excludeAssets: (assetName) => assetName.includes('js') || assetName.includes('ts'),
    modules: false,
    chunks: false,
    cached: false,
    cachedAssets: false,
    entrypoints: false,
    hash: false,
    children: false,
    reasons: false,
    version: false,
    outputPath: false,
    chunkOrigins: false,
    colors: true
  },
}
