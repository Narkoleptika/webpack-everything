const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const config = {
    devtool: '#eval-source-map',
    entry: {
        app: './src/entry-client.js'
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
            {{ preprocessor }}: path.resolve(__dirname, '../src/assets/{{ preprocessor }}'),
            helpers: path.resolve(__dirname, '../src/helpers')
        },
        extensions: ['.js', '.vue', '.{{ preprocessorExtension }}']
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [{
            test: /\.vue$/,
            use: {
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
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
                    name: 'img/[name].[hash:7].[ext]'
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
        })
    {{/if_eq}}],
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
