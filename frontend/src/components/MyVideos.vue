<template>
  <div>
    <h1>自分の録画</h1>
    <div v-for="video in videos" :key="video.id">
      <p>{{ video.title }}</p>
      <button @click="toggleVisibility(video.id)">
        {{ video.isPublic ? '非公開にする' : '公開にする' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref} from 'vue';
import axios from 'axios';

type Video = {
  id: number;
  title: string;
  url: string;
  isPublic: boolean;
};

export default defineComponent({
  setup() {
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
      // /api/videos とかへのクエリ //
      try {
        videos.value = [
          { id: 1, title: '動画 1', url: 'url1', isPublic: true },
          { id: 2, title: '動画 2', url: 'url2', isPublic: false }
        ];
      } catch (err) {
        console.error(err)
      }
    };

    const toggleVisibility = async (id: number) => {
      // /api/visible とかへのクエリ //
      const video = videos.value.find(v => v.id === id);
      if (video) {
        video.isPublic = !video.isPublic;
      }
    };


    onMounted(() => {
      fetchVideos();
    });

    return { videos, toggleVisibility };
  }
});
</script>
