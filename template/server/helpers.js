{{#if_eq apollo true}}const { PubSub } = require('graphql-subscriptions')
{{/if_eq}}const path = require('path')
const express = require('express')

module.exports = {
    resolve: file=> path.resolve(__dirname, file),
    serve: (path, cache)=> express.static(module.exports.resolve(path), {
        maxAge: cache && module.exports.isProd ? 1000 * 60 * 60 * 24 * 30 : 0
    }),
    isProd: process.env.NODE_ENV === 'production'{{#if_eq apollo true}},
    pubsub: new PubSub(),
    isObject: (obj)=> obj !== null && typeof obj === 'object',
    mergeDeep: (target, source)=> {
        let {
            isObject,
            mergeDeep
        } = module.exports
        let output = Object.assign({}, target)
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key=> {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, {
                            [key]: source[key]
                        })
                    } else {
                        output[key] = mergeDeep(target[key], source[key])
                    }
                } else {
                    Object.assign(output, {
                        [key]: source[key]
                    })
                }
            })
        }
        return output
    },
    handleError: err=> {
        throw err instanceof Error ? err : new Error(err ? err : 'An unkown error occured')
    }{{/if_eq}}
}
