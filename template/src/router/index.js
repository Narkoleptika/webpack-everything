import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const splitPage = (page)=> process.BROWSER ? ()=> System.import(`pages/${page}`) : require(`pages/${page}`)

const Home = splitPage('Home')
const Test = splitPage('Test')

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/test',
        name: 'Test',
        component: Test
    }]
})
