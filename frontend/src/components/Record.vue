<template>
  <div class="pose-container">
    <video ref="videoElement" autoplay playsinline muted class="video" width="640" height="480"></video>
    <canvas ref="canvasElement" class="canvas" width="640" height="480"></canvas>
  </div>
  <div>
    <div class="controls">
      <button @click="startRecording" :disabled="isRecording">start recording</button>
      <button @click="stopRecording" :disabled="!isRecording">stop recording</button>
    </div>

    <video v-if="videoPreview" :src="videoPreview" controls class="preview"></video>
  
    <div v-if="videoPreview" class="upload-section">
      <label>
        公開設定: 
        <select v-model="isPublic">
          <option :value="true">公開</option>
          <option :value="false">非公開</option>
        </select>
      </label>
      <label>
        タイトル: 
        <input type="text" v-model="videoTitle" placeholder="pleass input title..." />
      </label>
      <br>
      <button @click="uploadVideo">upload video</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';

export default defineComponent({
  setup() {
    let pose: Pose | null = null;
    let stream: MediaStream | null = null;

    const videoElement = ref<HTMLVideoElement | null>(null);
    const canvasElement = ref<HTMLCanvasElement | null>(null);
    const mediaRecorder = ref<MediaRecorder | null>(null);
    const recordedChunks = ref<Blob[]>([]);
    const videoPreview = ref<string | null>(null);
    const isRecording = ref(false);
    const isPublic = ref(false); 
    const videoTitle = ref<string>("");
    const date = new Date();

    const setupCamera = async () => {
      if (!videoElement.value) return;

      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      videoElement.value.srcObject = stream;
      await new Promise((resolve) => {
        videoElement.value?.addEventListener('loadeddata', resolve);
      });
    };

    const setupPose = () => {
      pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1, // 高精度モデル
        smoothLandmarks: true, // ランドマークのスムージング
        enableSegmentation: false, // セグメンテーション無効
        minDetectionConfidence: 0.5, // 検出の最小信頼度
        minTrackingConfidence: 0.5, // トラッキングの最小信頼度
      });

      pose.onResults(onResults);
    };

    const onResults = (results: Results) => {
      const canvasCtx = canvasElement.value?.getContext('2d');
      if (!canvasCtx || !videoElement.value) return;
      // Canvas をクリア
      canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height);

      // Video フィードを描画
      canvasCtx.drawImage(
        videoElement.value,
        0,
        0,
        canvasElement.value.width,
        canvasElement.value.height
      );

      if (results.poseLandmarks) {
        // ランドマークを接続する線を描画
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 4,
        });

        // ランドマーク自体を描画
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: '#FF0000',
          lineWidth: 2,
        });
      }
    };

    const startPoseDetection = async () => {
      if (!videoElement.value || !pose) return;

      await pose.initialize();

      const detect = async () => {
        if (!pose || !videoElement.value) return;
        await pose.send({ image: videoElement.value });
        requestAnimationFrame(detect);
      };

      detect();
    };

    const getTime = () => {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds(); 
    };

    const startRecording = () => {
      if (!canvasElement.value) return;

      recordedChunks.value = [];
      videoTitle.value = getTime();

      const stream = canvasElement.value.captureStream(30); // 30fps
      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: 300000,
      });

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.value.push(event.data);
      };

      mediaRecorder.value.onstop = () => {
        const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
        videoPreview.value = URL.createObjectURL(blob);
      };

      mediaRecorder.value.start();
      isRecording.value = true;
    };

    const stopRecording = () => {
      if (!mediaRecorder.value) return;
      mediaRecorder.value.stop();
      isRecording.value = false;
    };

    // 入力されたファイル名のチェックを実装できていない
    const uploadVideo = async () => {
      if (recordedChunks.value.length === 0) return;
      const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
      const formData = new FormData();
      const filename = `recorded_${Date.now()}.webm`
      formData.append('video', blob, filename);
      formData.append('title', videoTitle.value);
      formData.append('isPublic', String(isPublic.value));

      try {
        await axios.post('http://localhost:3001/api/videos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        alert('upload video');
      } catch (error) {
        console.error(error);
        alert('upload failed');
      }
    };

    onMounted(async () => {
      await setupCamera();
      setupPose();
      startPoseDetection();
    });

    onBeforeUnmount(() => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());  // ストリームを停止
        stream = null;
      }
    });

    return {
      videoElement,
      canvasElement,
      startRecording,
      stopRecording,
      uploadVideo,
      videoPreview,
      isRecording,
      isPublic,
      videoTitle,
    };
  },
});
</script>

<style scoped>
.pose-container {
  position: relative;
  width: 640px;
  height: 480px;
}

.video,
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.controls, .upload-section {
  margin-top: 10px;
}

.preview {
  width: 100%;
  margin-top: 10px;
}
</style>
