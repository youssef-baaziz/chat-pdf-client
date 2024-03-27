import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ErrorView from '../views/ErrorView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/:notFound', component: ErrorView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router