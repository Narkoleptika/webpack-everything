import App from './App.vue';
import store from './store/index';
import router from './router/index';
import { sync } from 'vuex-router-sync';

sync(store, router);

const app = {
    router,
    store,
    ...App
};

export { app, router, store };
