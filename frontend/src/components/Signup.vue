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

const signup = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/signup', {
      email: email.value,
      password: password.value,
      withCredentials: true,
    });
    alert(response.data.message);
    router.push('/protected');
  } catch (error) {
    alert('登録に失敗しました');
  }
};
</script>
