const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { typeDefs, resolvers } = require('./schema')
const { isProd } = require('../helpers')
const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = app=> {
    app.use('/graphql', graphqlExpress((req, res)=> ({
        schema,
        context: {
            req,
            res
        }
    })))
    if (!isProd) {
        app.use('/graphiql', graphiqlExpress((req)=> ({
            endpointURL: '/graphql',
            subscriptionsEndpoint: `ws://${req.headers.host}/subscriptions`
        })))
    }

    return server=> new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
        server,
        path: '/subscriptions'
    })
}
