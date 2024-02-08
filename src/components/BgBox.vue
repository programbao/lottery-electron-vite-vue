<template>
  <div class="canvas-box">
    <!-- <canvas id="canvas">你的浏览器不支持canvas</canvas> -->
    <img 
      style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
      " 
      :src="bgImg.fileUrl" class="img-bg"/>
    <div style="
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;"
      class="mark"></div>
  </div>
  <!-- <img
    v-if="isShowScreenImg"
    class="screen-img slit-in-vertical"
    :src="screenImg.fileUrl" /> -->
</template>

<script setup>
import { computed, ref } from 'vue'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
const bgImg = computed(() => {
  return basicData.otherResource.bgImg
})


</script>

<style lang="scss" scoped>
.canvas-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  overflow: hidden;
}

</style>