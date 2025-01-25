<template>
  <div>
    <h2>ログイン</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="メールアドレス" required />
      <input v-model="password" type="password" placeholder="パスワード" required />
      <button type="submit">ログイン</button>
    </form>
    <router-link to="/signup">新規登録はこちら</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

onMounted(async () => {
  try {
    await axios.get('http://localhost:3001/api/check', {
      withCredentials: true,
    });
    router.push('/mypage');
  } catch (error) {
    console.error('error:', error);
  }
});

const login = async () => {
  try {
    const body = {
        email: email.value,
        password: password.value,
    }
    const response = await axios.post('http://localhost:3001/api/login', body, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    alert(response.data.message);
    router.push('/mypage');
  } catch (error) {
    alert('ログインに失敗しました');
  }
};
</script>
