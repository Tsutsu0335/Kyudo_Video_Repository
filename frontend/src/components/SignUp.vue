<template>
  <div>
    <h2>新規登録</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="メールアドレス" required />
      <input v-model="password" type="password" placeholder="パスワード" required />
      <button type="submit">登録</button>
    </form>
    <router-link to="/">ログインはこちら</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const backend_host = import.meta.env.VITE_BACKEND_HOST;
const backend_port = import.meta.env.VITE_BACKEND_PORT;
const backend_addr = `https://${backend_host}:${backend_port}`;

// 認証済みかの確認
(async () => {
  try {
    await axios.get(backend_addr + '/auth/check', {
      withCredentials: true,
    });
    router.push('/mypage');
  } catch (error) {
    console.error('error:', error);
  }
})();

const signup = async () => {
  try {
    const body = {
      email: email.value,
      password: password.value,
    }
    const response = await axios.post(backend_addr + '/auth/signup', body, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    alert(response.data.message);
    router.push('/mypage');
  } catch (error) {
    alert('登録に失敗しました');
  }
};
</script>
