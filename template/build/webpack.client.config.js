const base = require('./webpack.base.config')
const HTMLPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const webpack = require('webpack')

const config = Object.assign({}, base, {
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new HTMLPlugin({
            template: 'src/index.template.html',
            minify: {
                collapseWhitespace: true
            }
        })
    ])
})

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new SWPrecacheWebpackPlugin({
            cacheId: '{{ name }}',
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
