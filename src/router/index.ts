import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import Home from '../components/Home.vue';
import Add from '../components/Add.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/add',
        name: 'add',
        component: Add,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
