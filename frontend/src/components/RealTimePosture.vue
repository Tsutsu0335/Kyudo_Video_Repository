<template>
  <div class="pose-container">
    <video ref="videoElement" autoplay playsinline muted class="video" width="640" height="480"></video>
    <canvas ref="canvasElement" class="canvas" width="640" height="480"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import type { Results } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export default defineComponent({
  setup() {
    const videoElement = ref<HTMLVideoElement | null>(null);
    const canvasElement = ref<HTMLCanvasElement | null>(null);
    let pose: Pose | null = null;
    let stream: MediaStream | null = null;

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
          `/@mediapipe/pose/${file}`,
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

      const canvas_width = canvasElement.value ? canvasElement.value.width : 0;
      const canvas_height = canvasElement.value ? canvasElement.value.height : 0;

      // Canvas をクリア
      canvasCtx.clearRect(0, 0, canvas_width, canvas_height);

      // Video フィードを描画
      canvasCtx.drawImage(
        videoElement.value,
        0,
        0,
        canvas_width,
        canvas_height
      );

      // ランドマークと骨格を描画
      if (results.poseLandmarks) {
        // ランドマークを接続する線（骨格）を描画
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#00FF00', // 緑色
          lineWidth: 4, // 線の太さ
        });

        // ランドマーク自体を描画
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: '#FF0000', // 赤色
          lineWidth: 2, // ポイントの太さ
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
</style>
