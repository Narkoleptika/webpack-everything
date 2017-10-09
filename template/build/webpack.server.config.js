const webpack = require('webpack')
const base = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = Object.assign({}, base, {
    target: 'node',
    entry: './client/entry-server.js',
    output: Object.assign({}, base.output, {
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    }),
    externals: [
        ...Object.keys(require('../package.json').dependencies),
        ...Object.keys(require('../package.json').devDependencies)
    ],
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'{{#if_eq apollo true}},
            'process.env.ORIGIN': JSON.stringify(process.env.ORIGIN || 'localhost'),
            'process.env.API_PORT': JSON.stringify(process.env.API_PORT || '3002'),
            'process.env.API_SSL': JSON.stringify(process.env.API_SSL || '3003'){{/if_eq}}
        }),
        new VueSSRServerPlugin()
    ])
})
