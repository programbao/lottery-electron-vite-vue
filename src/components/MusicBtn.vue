<template>
  <div
    class="music"
  >
    <audio
      ref="music"
      id="music"
      :src="musicFile.fileUrl"
      class="music-item"
      loop
    ></audio>
    <div
      @click="musicBoxClick"
      id="musicBox"
      ref="musicBox"
      class="music-box"
      title="播放/暂停背景音乐"
    >
      Music
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useToast } from "vue-toastification";
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
const musicFile = computed(() => {
  return basicData.otherResource.musicFile
})
const toast = useToast();
const musicBox = ref(null)
const music = ref(null)
let rotated = 0,
  stopAnimate = false;
const animate = () => {
  requestAnimationFrame(function () {
    if (stopAnimate) {
      return
    }
    rotated = rotated % 360
    musicBox.value.style.transform = 'rotate(' + rotated + 'deg)'
    rotated += 1
    animate()
  })
}
const musicBoxClick = (e) => {
  if (music.value.paused) {
    music.value.play().then(
      () => {
        stopAnimate = false
        animate()
      },
      () => {
        toast.error("I'm a toast!");
      }
    )
  } else {
    music.value.pause()
    stopAnimate = true
  }
}
onMounted(() => {
  setTimeout(function () {
    // musicBoxClick()
  }, 1000)
})
</script>

<style lang="scss" scoped>
// .music {
//   position: fixed;
//   top: 10vh;
//   right: 4vh;
//   z-index: 5;
// }
.music {
  margin: 0 10px
}
.music-item {
  display: block !important;
  opacity: 0;
}

.music-box {
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  text-align: center;
  line-height: 5vh;
  font-size: 1.4vh;
  color: #fff;
  cursor: pointer;
  background-color: rgba(253, 105, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
