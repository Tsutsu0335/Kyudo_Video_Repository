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

// 認証済みかの確認 (beforeCreate)
(async () => {
  try {
    await axios.get('http://localhost:3001/auth/check', {
      withCredentials: true,
    });

    const response = await axios.get('http://localhost:3001/api/user', { withCredentials: true });
    userEmail.value = response.data.email;
  } catch (error) {
    console.error('error:', error);
    router.push('/');
  }
})();

const logout = async () => {
  try {
    await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
    router.push('/');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
</script>
