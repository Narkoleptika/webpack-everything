const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const isProd = process.env.NODE_ENV === 'production'
const config = {
    devtool: '#source-map',
    entry: {
        app: './src/client-entry.js',
        vendor: [
            'es6-promise',
            'vue',
            'vue-router',
            'vuex',
            'vuex-router-sync'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            public: path.resolve(__dirname, '../public'),
            components: path.resolve(__dirname, '../src/components'),
            pages: path.resolve(__dirname, '../src/pages'),
            assets: path.resolve(__dirname, '../src/assets'),
            img: path.resolve(__dirname, '../src/assets/img'),
            stylus: path.resolve(__dirname, '../src/assets/stylus')
        },
        extensions: ['.js', '.vue', '.styl']
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueConfig
        }, {
            test: /\.js$/,
            loader: 'buble-loader',
            exclude: /node_modules/,
            options: {
                objectAssign: 'Object.assign'
            }
        }, {
            test: /\.styl$/,
            loader: isProd ? ExtractTextPlugin.extract(['css-loader', 'stylus-loader']) : 'style-loader!css-loader!stylus-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            loaders: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            }, {
                loader: 'image-webpack-loader',
                query: {
                    progressive: true,
                    optimizationLevel: 7,
                    interlaced: false,
                    mozjpeg: {
                        quality: 65
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 1
                    },
                    svgo: {
                        plugins: [{
                            removeViewBox: true
                        }, {
                            removeEmptyAttrs: true
                        }]
                    }
                }
            }]
        }]
    },
    plugins: [],
    performance: false
}

if (isProd) {
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    )
}

module.exports = config
