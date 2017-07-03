import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import createStore from './store/index'
import createRouter from './router/index'

export default ()=> {
    const store = createStore()
    const router = createRouter()

    sync(store, router)

    const app = new Vue({
        router,
        store,
        ...App
    })

    return { app, router, store }
}
