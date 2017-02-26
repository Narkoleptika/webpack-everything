const base = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const vueConfig = require('./vue-loader.config')
const webpack = require('webpack')

const config = Object.assign({}, base, {
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
            'process.BROWSER': true
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.(vue|styl)(\?.*)?$/,
            stylus: {
                default: {
                    use: [require('nib')()],
                    import: ['~nib/lib/nib/index.styl']
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        new HTMLPlugin({
            template: 'src/index.template.html',
            inject: process.env.NODE_ENV === 'production' ? false : 'body',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            },
            environment: process.env.NODE_ENV
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ])
})

if (process.env.NODE_ENV === 'production') {
    vueConfig.loaders = Object.assign({}, vueConfig.loaders, {
        stylus: ExtractTextPlugin.extract({
            loader: 'css-loader!stylus-loader',
            fallbackLoader: 'vue-style-loader'
        })
    })
    config.plugins.push(
        new ExtractTextPlugin({
            filename: 'styles.[contenthash].css',
            allChunks: true
        }),
        new SWPrecacheWebpackPlugin({
            cacheId: 'project',
            filename: 'sw.js',
            runtimeCaching: [{
                urlPattern: '/*',
                handler: 'cacheFirst'
            }],
            staticFileGlobs: [
                'dist/**.css',
                'dist/img/**.*',
                'dist/**.js'
            ]
        })
    )
}

module.exports = config
