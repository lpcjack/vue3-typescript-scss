import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import login from '../views/login.vue'
//import sign from '../views/sign.vue'
// import home from '../views/home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: login
    },

    {
        path:'/sign',
        name:'sign',
        component: () => import('../views/sign.vue')
    },
    {
        path:'/revise',
        name:'revise',
        component: () => import('../views/revise.vue')
    },

    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home.vue')
    },

    // {
    //     path: '/',
    //     component: home
    // },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router