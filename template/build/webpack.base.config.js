const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const config = {
    devtool: '#eval-source-map',
    entry: {
        app: './client/entry-client.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js',
        chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js'
    },
    resolve: {
        alias: {
            public: path.resolve(__dirname, '../public'),
            components: path.resolve(__dirname, '../client/components'),
            pages: path.resolve(__dirname, '../client/pages'),
            assets: path.resolve(__dirname, '../client/assets'),
            img: path.resolve(__dirname, '../client/assets/img'),
            {{ preprocessor }}: path.resolve(__dirname, '../client/assets/{{ preprocessor }}'),
            helpers: path.resolve(__dirname, '../client/helpers')
        },
        extensions: ['.js', '.vue', '.{{ preprocessorExtension }}']
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [{{#if_eq eslint true}}{
            test: /\.js|vue$/,
            use: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
        }, {{/if_eq}}{
            test: /\.vue$/,
            use: {
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 1 versions']
                        })
                    ],
                    buble: {
                        objectAssign: 'Object.assign'
                    }{{#if_eq preprocessor 'scss'}},
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader'
                    }{{/if_eq}}
                }
            }
        }, {
            test: /\.js$/,
            use: {
                loader: 'buble-loader',
                options: {
                    objectAssign: 'Object.assign'
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: isProd ? 'img/[name].[hash:7].[ext]' : 'img/[name].[ext]'
                }
            }, {
                loader: 'image-webpack-loader',
                query: {
                    progressive: true,
                    mozjpeg: {
                        quality: 65
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    optipng: {
                        optimizationLevel: 7
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
    plugins: [{{#if_eq preprocessor 'stylus'}}
        new webpack.LoaderOptionsPlugin({
            test: /\.(vue|styl)(\?.*)?$/,
            stylus: {
                default: {
                    use: [require('nib')()],
                    import: ['~nib/lib/nib/index.styl']
                }
            }
        }){{/if_eq}}],
    performance: false
}

if (isProd) {
    config.devtool = '#source-map'
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    )
}

module.exports = config
