const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssPlugin = require("mini-css-extract-plugin");
const uglify = require('uglifyjs-webpack-plugin');
let chatChunk = require("bundle-loader?lazy!./components/chat");
chatChunk(function(file) {

  someOperate(file);

});
module.exports = {
  mode: 'development',
  entry: {
         app: './src/index.js'
         
       },
  devtool: 'inline-source-map',
  devServer: {
             contentBase: './dist',
             hot: true
           },
  plugins: [//插件
             new HtmlWebpackPlugin({
               title: '管理输出'
             }),
             new webpack.HotModuleReplacementPlugin(),
             new MiniCssPlugin({
              filename:'./css/[name].css'
            }),
             new uglify()
           ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
         rules: [//第三方加载程序规则
           {
             test: /\.css$/,
             use: [
               'style-loader',
               'css-loader'
             ]
           },
           {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                       'file-loader'
              ]
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: [
                        'file-loader'
              ]
            },
            {
              test: /\.(csv|tsv)$/,
              use: [
                        'csv-loader'
              ]
            },
            {
              test: /\.xml$/,
              use: [
                        'xml-loader'
              ]
            },
            {
              test: /\.less$/,
              use: [
                'style-loader',
                'css-loader',
                'less-loader'
              ]
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                'scss-loader'
              ]
            },
            {
              test:/\.css$/,
              use:[
                 MiniCssPlugin.loader,
                 'css-loader']
            }
         ],
         
       }
};