<template>
  <div>
    <h1>Welcome, {{ userEmail }}</h1>
    <button @click="logout">Logout</button>
    <nav>
      <router-link to="/record">Record Posture</router-link><br>
      <router-link to="/public-videos">Public Videos</router-link><br>
      <router-link to="/my-recordings">My Recordings</router-link><br>
      <router-link to="/real-time-posture">Real-Time Posture</router-link><br>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();
const userEmail = ref('');

onMounted(async () => {
  try {
    await axios.get('http://localhost:3001/api/check', {
      withCredentials: true,
    });

    const response = await axios.get('http://localhost:3001/api/user', { withCredentials: true });
    userEmail.value = response.data.email;
  } catch (error) {
    console.error('error:', error);
    router.push('/'); // 認証されていない場合はログイン画面へ
  }
});

const logout = async () => {
  try {
    await axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true });
    router.push('/');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
</script>
