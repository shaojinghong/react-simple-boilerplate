const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WebpackBar = require('webpackbar');

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const resolve = absolutePath => path.resolve((process.cwd(), absolutePath));

const config = {
  mode: NODE_ENV,

  // devtool: 'cheap-module-eval-source-map',
  
  devtool: 'eval-source-map',

  // entry: './src/main.js',
  entry: [
    // 'react-hot-loader/patch',
    './src/main.js',
    'webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&noInfo=true&reload=true'
  ],

  output: {
    publicPath: '/hot-update/',
    filename: 'js/[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  },

  module: {
    rules: [
      {
        // test: /\.js(x)$/ 无效
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\/src\/(scss|components|widgets)\/(.*)\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [resolve('src/scss')],
            }
          }
        ]
      },
      // src/modules下的scss启用css modules
      {
        test: /\/src\/modules\/(.*)\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
                hashPrefix: 'hash',
              }
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader'
            // options: {
            //   includePaths: [resolve('src/scss')],
            // }
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new WebpackBar({
    //   name: NODE_ENV,
    //   color: 'green',
    //   profile: !isDev,
    // })
  ]
}

const compiler = webpack(config);

const app = express();

app.all('*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
})

app.use(webpackDevMiddleware(compiler, {
  // 生成的新文件所指向的路径和内存中采用的文件存储write path需要一致
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

// 访问http://localhost:4000/static/js/main.js即可看到打包后的文件
app.listen(4000, () => console.log('webpack hot module replace is listening 4000'));
