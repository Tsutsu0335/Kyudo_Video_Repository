import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Protected from '../components/Protected.vue';

const routes = [
    { path: "/", component: Login},
    { path: "/signup", component: Signup },
    { path: "/protected", component: Protected},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;