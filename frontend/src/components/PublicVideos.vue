<template>
  <div>
    <h1>公開されている動画</h1>
    <div v-for="video in videos" :key="video.id">
      <hr>
      <p>title: {{ video.title }}</p>
      <p>user: {{ video.userId }}</p>
      <video :src="getVideoURL(video.id)" controls width="320"></video>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';

type Video = {
  id: number;
  userId: string;
  title: string;
  isPublic: boolean;
};

export default defineComponent({
  setup() {
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/videos/publicvideos', {
          withCredentials: true,
        });
        videos.value = res.data;
        console.log(videos.value);
      } catch (err) {
        console.error(err)
      }
    };

    const getVideoURL = (id: string) => {
      return `http://localhost:3001/api/videos/${id}`;
    };

    onMounted(() => {
      fetchVideos();
    });

    return { videos, getVideoURL };
  }
});
</script>
