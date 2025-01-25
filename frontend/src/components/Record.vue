<template>
  <div>
    <h1>映像の撮影</h1>
    <video autoplay muted></video>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {

    const startRecording = () => {
      // 録画機能の実装 //
      console.log("Recording start");
    };

    const stopRecording = () => {
      // 録画機能の実装 //
      console.log("Recording stop");
    };

    return {startRecording, stopRecording};
  },
});
</script>
