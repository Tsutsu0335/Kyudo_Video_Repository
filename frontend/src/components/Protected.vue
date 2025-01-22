<template>
  <div>
    <h1>保護されたページ</h1>
    <p>ログイン済みのユーザーのみが閲覧できます。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    onMounted(async () => {
      try {
        await axios.get('http://localhost:3001/protected/main', {
          withCredentials: true,
        });
      } catch (error) {
        console.error('認証エラー:', error);
        router.push('/'); // 認証されていない場合はログイン画面へ
      }
    });

    return {};
  },
});
</script>
