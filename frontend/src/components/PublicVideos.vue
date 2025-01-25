<template>
  <div>
    <h1>公開されている動画</h1>

    <div v-for="video in videos" :key="video.id">
      <p>{{ video.title }}</p>
      <!-- 動画の再生部分を実装 -->
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

type Video = {
  id: number;
  title: string;
  url: string;
};

export default defineComponent({
  setup() {
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
      // /api/videos とかへのクエリ //
      try {
        videos.value = [
          { id: 1, title: '動画 1', url: 'url1' },
          { id: 2, title: '動画 2', url: 'url2' }
        ];
      } catch (err) {
        console.error(err)
      }
    };

    onMounted(() => {
      fetchVideos();
    });

    return { videos };
  }
});
</script>
