// webpack.config.js
// 引入插件
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// webpack配置就是对象{}
const path = require("path")
module.exports = {
    // 定义入口
    entry: './src/index.js',
    // 输出结构
    output: {
        // 输出路径
        path: path.resolve(__dirname, 'dist'),
        // 输出文件名称
        filename: 'main.js'
    },
    // 打包模式，是生产环境还是开发环境
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 8081,
        open: true,
        hotOnly: true,
        proxy: {
            '/api': {
                target: "http://localhost:9092"
            }
        }
    },
    // 模块解析
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                // loader是有先后顺序的，从后向前
                // use: 'file-loader'
                use: {
                    loader: 'url-loader',
                    // loader可以配置参数
                    options: {
                        // name: 'pic.png',
                        // 占位符
                        name: '[name]_[hash:8].[ext]',
                        outputPath: 'images/',
                        // 当图片小于limit尺寸会被转为base64，大于才会生成文件
                        // limit: 2048
                        limit: 10
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/,
                use: 'file-loader'
            },
            // 当webpack遇到不认识的模块需要应用相对应的loader
            {
                test: /\.css$/,
                // loader是有先后顺序的，从后向前
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                // loader是有先后顺序的，从后向前
                use: [
                    // 'style-loader', 
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    {
                        loader: 'postcss-loader',
                        options:{
                            plugins: [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 versions','>1%']
                                })
                            ]
                        }
                    }, 
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env',{
                            targets: {
                                chrome: '67',
                                firefox: '60'
                            },
                            corejs:2, // 新版本需要指定核心库版本
                            useBuiltIns: 'usage' // 按需注入
                        }], '@babel/preset-react'],
                        // plugins: [[
                        //     '@babel/plugin-transform-runtime',
                        //     {
                        //         "absoluteRuntime": false,
                        //         // "corejs": 2, 不建议用，要装对应的核心库
                        //         "corejs": false,
                        //         "helpers": true,
                        //         "regenerator": true,
                        //         "useESModules": false 
                        //     }
                        // ]]
                    }
                }
            }
        ]
    },
    // 插件扩展配置
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "webpack 首页",
            filename: 'index.html',
            template: './src/index.html',
            // inject: 'head'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}