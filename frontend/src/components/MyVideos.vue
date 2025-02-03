<template>
  <div>
    <h1>自分の録画</h1>
    <div v-for="video in videos" :key="video.id">
      <p>{{ video.title }}</p>
      <video :src="getVideoURL(video.filename)" controls width="320"></video>
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
  userId: string;
  title: string;
  filename: string;
  isPublic: boolean;
};

export default defineComponent({
  setup() {
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/myvideos', {
          withCredentials: true,
        });
        videos.value = res.data;
        console.log(videos.value);
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

    const getVideoURL = (filename: string) => {
      return `http://localhost:3001/api/videos/${filename}`;
    };


    onMounted(() => {
      fetchVideos();
    });

    return { videos, toggleVisibility, getVideoURL };
  }
});
</script>
