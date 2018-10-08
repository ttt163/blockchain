const {resolve} = require('path')
const fs = require('fs')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = require('./config.js')

const ROOT_PATH = resolve(process.cwd())
const SRC_PATH = resolve(ROOT_PATH, 'assets')
const JS_PATH = resolve(SRC_PATH, 'js')
const PUBLIC_PATH = resolve(ROOT_PATH, 'public')

// 获取多页面的每个入口文件，用于配置中的entry
const getEntry = () => {
    let dirs = fs.readdirSync(JS_PATH)
    let matchs = []
    let files = {}
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/)
        if (matchs) {
            files[matchs[1]] = resolve(SRC_PATH, 'js', item)
        }
    })
    return files
}

const devJs = () => {
    let devJsArr = {}
    config.devJs.map(function (item, index) {
        let fileName = item
        if (item.indexOf('/') > -1) {
            fileName = item.split('/')[0]
        }
        devJsArr[fileName] = resolve(SRC_PATH, 'js', item + '.js')
    })

    return devJsArr
}

let entryFiles = {}

if (config.devJs.length !== 0) {
    if (config.vendors.length !== 0) {
        entryFiles = Object.assign(devJs(), {
            vendors: config.vendors
        })
    } else {
        entryFiles = devJs()
    }
} else {
    if (config.vendors.length !== 0) {
        entryFiles = Object.assign(getEntry(), {
            vendors: config.vendors
        })
    } else {
        entryFiles = getEntry()
    }
}

const webpackConfig = {
    devtool: false,
    entry: entryFiles,
    output: {
        path: PUBLIC_PATH,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '../'
    },
    module: {
        rules: [
            {
                test: /\.(js)?$/,
                include: SRC_PATH,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }, {
                test: /\.(css)?$/,
                include: ROOT_PATH,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|svgz)?$/,
                include: ROOT_PATH,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.scss']
    },
    externals: {
        zepto: '$',
        jquery: '$'
    }
}
const env = process.env.NODE_ENV

if (env === 'development') {
    module.exports = Object.assign(webpackConfig, {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'zepto' || 'jquery',
                zepto: 'zepto',
                jQuery: 'jquery',
                'window.zepto': 'zepto',
                'window.jQuery': 'jquery'
            })
        ]
    })
} else if (env === 'production' || env === 'test') {
    module.exports = Object.assign(webpackConfig, {
        plugins: [
            new UglifyJsPlugin({
                test: /\.js($|\?)/i,
                sourceMap: true,
                uglifyOptions: {
                    mangle: {
                        keep_fnames: true
                    },
                    compress: {
                        warnings: false
                    },
                    output: {
                        beautify: false
                    }
                }
            }),
            new webpack.ProvidePlugin({
                $: 'zepto' || 'jquery',
                zepto: 'zepto',
                jQuery: 'jquery',
                'window.zepto': 'zepto',
                'window.jQuery': 'jquery'
            }),

            // 打包单独不需要提取公共部分JS时注释掉此插件，如：jquery.lk.js
            new webpack.optimize.CommonsChunkPlugin({
                filename: 'js/[name].js',
                names: ['vendors']
            })
        ]
    })
}
