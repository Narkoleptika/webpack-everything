import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const loadPage = name=> ()=> import(`pages/${name}`)

const pages = [
    'Home',
    'Test',
    'NotFound'{{#if_eq apollo true}},
    'Apollo'{{/if_eq}}
]
    .map(page=> ({ name: page, component: loadPage(page) }))
    .reduce((sum, { name, component })=> ({...sum, [name]: component}), {})

const options = {
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        let ret = { x: 0, y: 0 }
        if (to.hash) {
            ret = {selector: to.hash}
        } else if (savedPosition) {
            ret = savedPosition
        }
        return ret
    },
    routes: [{
        path: '/',
        name: 'Home',
        component: pages.Home
    }, {
        path: '/test',
        name: 'Test',
        component: pages.Test
    }, {{#if_eq apollo true}}{
        path: '/apollo',
        name: 'Apollo',
        component: pages.Apollo
    }, {{/if_eq}}{
        path: '*',
        name: 'NotFound',
        component: pages.NotFound
    }]
}

export default ()=> new Router(options)
