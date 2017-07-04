const base = require('./webpack.base.config')
const HTMLPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'

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
            name: 'app',
            async: 'vendor-async',
            minChunks(module, count) {
                return module.context && module.context.indexOf('node_modules') !== -1 && count >= 2
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new HTMLPlugin({
            template: 'client/index.template.html',
            inject: false,
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new VueSSRClientPlugin()
    ])
})

if (isProd) {
    config.plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'app-async',
            minChunks(module, count) {
                return count >= 2
            }
        }),
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

if (!isProd || process.env.STATS) {
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'stats.html',
            openAnalyzer: false
        })
    )
}

module.exports = config
