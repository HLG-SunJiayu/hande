2019/7/26
# webpack
## 一、html中js、css的自动插入
1.安装HtmlWebpackPlugin插件
  ```npm install --save-dev html-webpack-plugin```
2.在webpack.config.js中配置
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
         app: './src/index.js'
         
       },
  plugins: [//插件
             new HtmlWebpackPlugin({
               
             }),
  ]
```
## 二、处理less/scss文件
1.安装less-loader
  ```npm i less-loader -D```
  安装less依赖
  ```npm i less -D```
2.在webpack.config.js中配置
```
{
              test: /\.less$/,
              use: [
                'style-loader',
                'css-loader',
                'less-loader'
              ]
            }
```
3.安装scss-loader
  ```npm i scss-loader -D```
  安装less依赖
  ```npm i node-scss -D```
4.在webpack.config.js中配置
```
{
              test: /\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                'scss-loader'
              ]
            }
```
## 三、css的抽取剥离
1.安装插件
```min-css-extract-plugin```
2.在webpack.config.js中配置
```
const MiniCssPlugin = require("mini-css-extract-plugin");


 {
      test:/\.css$/,
      use:[MiniCssPlugin.loader,'css-loader']
    }


new MiniCssPlugin({
    filename:'./css/[name].css'
  })
```
## 四、js压缩
在webpack.config.js中配置
```
const uglify = require('uglifyjs-webpack-plugin');


plugins:[
        new uglify()
    ]
```
## 五、代码拆分
1.安装Bundle Loader
```npm i --save bundle-loader```
2.在webpack.config.js中配置
```
let chatChunk = require("bundle-loader?lazy!./components/chat");


chatChunk(function(file) {

  someOperate(file);

});
```