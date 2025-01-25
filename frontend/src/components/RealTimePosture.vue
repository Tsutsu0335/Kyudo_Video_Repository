<template>
  <div>
    <h1>リアルタイム確認</h1>
    <video ref="videoElement" autoplay></video>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue';
import axios from 'axios';

export default defineComponent({
  setup() {
    const videoElement = ref<HTMLVideoElement | null>(null);
    let stream: MediaStream | null = null;

    const startVideoStream = () => {
      if (videoElement.value) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((s) => {
            stream = s;
            videoElement.value!.srcObject = stream;
          })
          .catch((err) => {
            console.error('Error accessing the camera: ', err);
          });
      }
    };

    onMounted(() => {
      startVideoStream();
    });

    onBeforeUnmount(() => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());  // ストリームを停止
      }
    });

    return {
      videoElement
    };
  },
});
</script>
