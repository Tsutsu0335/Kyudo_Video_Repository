<template>
  <div>
    <h2>ログイン中のユーザー: {{ userEmail }}</h2>
    <button @click="logout">Logout</button>
    <nav>
      <router-link to="/mypage/record">Record Posture</router-link><br>
      <router-link to="/mypage/public-videos">Public Videos</router-link><br>
      <router-link to="/mypage/my-videos">My Recordings</router-link><br>
      <router-link to="/mypage/real-time-posture">Real-Time Posture</router-link><br>
    </nav>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const userEmail = ref('');

const backend_host = import.meta.env.VITE_BACKEND_HOST;
const backend_port = import.meta.env.VITE_BACKEND_PORT;
const backend_addr = `https://${backend_host}:${backend_port}`;

// 認証済みかの確認 (beforeCreate)
(async () => {
  try {
    await axios.get(backend_addr + `/auth/check`, {
      withCredentials: true,
    });

    const response = await axios.get(backend_addr + `/api/user`, { withCredentials: true });
    userEmail.value = response.data.email;
  } catch (error) {
    console.error('error:', error);
    router.push('/');
  }
})();

const logout = async () => {
  try {
    await axios.post(backend_addr + `/auth/logout`, {}, { withCredentials: true });
    router.push('/');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
</script>
