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

const backend_host = import.meta.env.VITE_BACKEND_HOST;
const backend_port = import.meta.env.VITE_BACKEND_PORT;
const backend_addr = `https://${backend_host}:${backend_port}`;

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
        const res = await axios.get(backend_addr + '/api/videos/publicvideos', {
          withCredentials: true,
        });
        videos.value = res.data;
        console.log(videos.value);
      } catch (err) {
        console.error(err)
      }
    };

    const getVideoURL = (id: string) => {
      return backend_addr + `/api/videos/${id}`;
    };

    onMounted(() => {
      fetchVideos();
    });

    return { videos, getVideoURL };
  }
});
</script>
