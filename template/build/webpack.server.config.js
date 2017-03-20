const webpack = require('webpack')
const base = require('./webpack.base.config')
const VueSSRWebpackPlugin = require('vue-ssr-webpack-plugin')

module.exports = Object.assign({}, base, {
    target: 'node',
    entry: './src/entry-server.js',
    output: Object.assign({}, base.output, {
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    }),
    externals: Object.keys(require('../package.json').dependencies),
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRWebpackPlugin()
    ])
})
