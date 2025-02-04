<template>
  <div>
    <h1>自分の録画</h1>
    <div v-for="video in videos" :key="video.id">
      <hr>
      <p>{{ video.title }}</p>
      <video :src="getVideoURL(video.id)" controls width="320"></video>
      <br>
      <button @click="toggleVisibility(video.id)">
        {{ video.isPublic ? '非公開にする' : '公開にする' }}
      </button>
      <button @click="deleteVideo(video.id)">
        Delete
      </button>
      <br>
      <label>
        edit title:
        <input type="text" v-model="video.newTitle" placeholder="pleass input new title..." />
        <button @click="editVideoTitle(video.id)">
          Apply
        </button>
      </label>

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
  newTitle: string;
  isPublic: boolean;
};

export default defineComponent({
  setup() {
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/videos/myvideos', {
          withCredentials: true,
        });
        videos.value = res.data;
        console.log(videos.value);
      } catch (err) {
        console.error(err)
      }
    };

    const toggleVisibility = async (id: number) => {
      const video = videos.value.find(v => v.id === id);
      if (video === undefined) {
        console.log("target video is not found");
        return;
      }

      const body = {
        videoId: video.id,
        isPublic: !video.isPublic,
      };

      try {
        const res = await axios.post("http://localhost:3001/api/videos/setvisibility", body, {
          withCredentials: true,
        });
        video.isPublic = res.data.result;
      } catch (err) {
        console.error(err);
      }
    };

    // 入力されたファイル名のチェックを実装できていない
    const editVideoTitle = async (id: number) => {
      const video = videos.value.find(v => v.id === id);
      if (video === undefined) {
        console.log("target video is not found");
        return;
      }

      const body = {
        videoId: video.id,
        newTitle: video.newTitle,
      };

      try {
        const res = await axios.post("http://localhost:3001/api/videos/edittitle", body, {
          withCredentials: true,
        });
        fetchVideos();
      } catch (err) {
        console.error(err);
      }
    }

    const deleteVideo = async (id: number) => {
      const video = videos.value.find(v => v.id === id);
      if (video === undefined) {
        return;
      }

      try {
        const body = {
          videoId: video.id,
        };

        axios.post("http://localhost:3001/api/videos/delete", body, {
          withCredentials: true,
        }).then(() => {
          fetchVideos();
        });
      } catch (err) {
        console.error(err);
      }
    };



    const getVideoURL = (id: string) => {
      return `http://localhost:3001/api/videos/${id}`;
    };

    onMounted(() => {
      fetchVideos();
    });

    return { videos, toggleVisibility, getVideoURL, deleteVideo, editVideoTitle };
  }
});
</script>
