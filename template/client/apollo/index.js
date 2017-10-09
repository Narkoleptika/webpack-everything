import Vue from 'vue'
import {
    ApolloClient,
    createBatchingNetworkInterface
} from 'apollo-client'
import {
    SubscriptionClient,
    addGraphQLSubscriptions
} from 'subscriptions-transport-ws'
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
    let networkInterface
    let initialState

    const batchingInterface = createBatchingNetworkInterface({
        uri: `${apiUrl}/graphql`
    })

    if (!ssr && typeof window !== 'undefined') {
        const state = window.__APOLLO_STATE__

        if (state) {
            initialState = state.defaultClient
        }

        // Create the subscription websocket client
        const wsClient = new SubscriptionClient(`${wsUrl}/subscriptions`, {
            reconnect: true,
            lazy: true
        })

        networkInterface = addGraphQLSubscriptions(batchingInterface, wsClient)
    } else {
        networkInterface = batchingInterface
    }

    const apolloClient = new ApolloClient({
        networkInterface,
        ...(ssr ? {
            ssrMode: true
        } : {
            initialState,
            ssrForceFetchDelay: 100,
            connectToDevTools: true
        })
    })

    return new VueApollo({
        defaultClient: apolloClient
    })
}
