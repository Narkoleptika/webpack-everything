import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import createStore from './store/index'
import createRouter from './router/index'{{#if_eq apollo true}}
import createApolloProvider from './apollo'{{/if_eq}}

export default ()=> {
    const store = createStore()
    const router = createRouter(){{#if_eq apollo true}}
    const apolloProvider = createApolloProvider(){{/if_eq}}

    sync(store, router)

    const app = new Vue({
        router,
        store,{{#if_eq apollo true}}
        apolloProvider,{{/if_eq}}
        ...App
    })

    return { app, router, store{{#if_eq apollo true}}, apolloProvider{{/if_eq}} }
}
