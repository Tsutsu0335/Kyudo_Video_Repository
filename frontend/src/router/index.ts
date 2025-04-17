import { createRouter, createWebHistory } from 'vue-router';
import Login from '@components/Login.vue';
import SignUp from '@components/SignUp.vue';
import MainPage from '@components/MainPage.vue';
import Record from '@components/Record.vue';
import PublicVideos from '@components/PublicVideos.vue';
import MyVideos from '@components/MyVideos.vue';
import RealTimePosture from '@components/RealTimePosture.vue';

const routes = [
    { path: "/", name: "Login", component: Login },
    { path: "/signup", name: "SignUp", component: SignUp },
    {
        path: "/mypage", name: "MyPage", component: MainPage,
        children: [
            { path: "record", component: Record },
            { path: "public-videos", component: PublicVideos },
            { path: "my-videos", component: MyVideos },
            { path: "real-time-posture", component: RealTimePosture },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;