import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'

const ORIGIN = process.env.ORIGIN
const API_PORT = process.env.API_PORT
const API_SSL = process.env.API_SSL
const NODE_ENV = process.env.NODE_ENV

const isProd = NODE_ENV === 'production'

const baseUrl = `${ORIGIN}:${isProd ? API_SSL : API_PORT}`
const apiUrl = `http${isProd ? 's' : ''}://${baseUrl}`
const wsUrl = `ws${isProd ? 's' : ''}://${baseUrl}`

Vue.use(VueApollo)

export default ()=> {
    let ssr = process.env.VUE_ENV === 'server'
    let link

    const httpLink = new HttpLink({
        uri: `${apiUrl}/graphql`
    })

    const cache = new InMemoryCache()

    if (!ssr && typeof window !== 'undefined') {
        const state = window.__APOLLO_STATE__
        if (state) {
            cache.restore(state.defaultClient)
        }
        // Create the subscription websocket client
        const wsLink = new WebSocketLink({
            uri: `${wsUrl}/subscriptions`,
            options: {
                reconnect: true,
                lazy: true
            }
        })
        link = split(
            ({ query })=> {
                const { kind, operation } = getMainDefinition(query)
                return kind === 'OperationDefinition' &&
                    operation === 'subscription'
            },
            wsLink,
            httpLink
        )
    } else {
        link = httpLink
    }

    const apolloClient = new ApolloClient({
        link,
        cache,
        queryDeduplication: true,
        ...(ssr ? {
            ssrMode: true
        } : {
            ssrForceFetchDelay: 100,
            connectToDevTools: true
        })
    })

    return new VueApollo({
        defaultClient: apolloClient
    })
}
