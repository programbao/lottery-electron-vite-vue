<script setup>
import { onMounted, ref, nextTick } from 'vue'
import BgBox from './components/BgBox.vue'
import LotteryContainer from './components/LotteryContainer.vue'
import OperationBtn from './components/OperationBtn.vue'
import PrizeBar from './components/PrizeBar.vue'
import PrizeMark from './components/PrizeMark.vue'
import LuckyUser from './components/LuckyUser.vue'
import ShowAllLuckyUser from './components/ShowAllLuckyUser.vue'
import openHelp from './libs/help.js'
// import ConfigDialog from "./components/configWidget/index.vue"
import ScreenCard from './components/ScreenCard.vue'
// 引入store
import { lotteryDataStore } from './store'
const lotteryData = lotteryDataStore()
import GoDB from 'godb'
const operationDB = new GoDB('operationDB') // 连接数据库
window.operationLogTable = operationDB.table('operation_log') // 获取数据表
// console.log(window.operationLogTable.getAll(), 'window.operation_log')
// window.operationLogTable.getAll().then((res) => {
//         console.log(res, 'window.operationLogTable.getAll()window.operationLogTable.getAll()')
// })
// import introJs from 'intro.js'
const isLoadingFinish = ref(false)
onMounted(async () => {
  let basicData = await lotteryData.initConfigData()
  const loadingBoxDom = document.querySelector('.loading-box')
  // loadingBoxDom.style.opacity = 0.4
  loadingBoxDom.style.zIndex = -5
  setTimeout(() => {
    isLoadingFinish.value = true
    setTimeout(() => {
      // 新手指引
      nextTick(() => {
        let isIntroFirstScreen = localStorage.getItem("isIntroFirstScreen")
        if (isIntroFirstScreen && isIntroFirstScreen === "true") return
        openHelp(basicData);
      })
    }, 500)
  }, 500)
})
</script>

<template>
  <div v-if="isLoadingFinish">
    <LotteryContainer />
    <OperationBtn />
    <PrizeBar />
    <PrizeMark />
    <LuckyUser />
    <ShowAllLuckyUser />
    <!-- <ConfigDialog /> -->
    <ScreenCard />
    <BgBox />
    <!-- <button @click="importFile">导入</button> -->
  </div>
</template>

<style scoped>
html,
body {
  overflow: hidden;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
<style>
.el-dialog {
  max-width: 950px;
}
#lucky-close-icon {
  position: fixed;
  right: 20px;
  top: 20px;
  font-size: 2.5vh;
  padding: 1vh 2vw;
  margin: 0;
  color: rgba(127, 255, 255, 0.75);
  z-index: 1000;
}

.slide-out-top {
  -webkit-animation: slide-out-top 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-top 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-top {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-1000px);
    transform: translateY(-1000px);
    opacity: 0;
  }
}
.slide-out-left {
  -webkit-animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-left {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
}
.slide-out-right {
  -webkit-animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-right {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
}
.slide-out-bottom {
  -webkit-animation: slide-out-bottom 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-bottom 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-bottom {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }
}

.slide-in-top {
  -webkit-animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-top {
  0% {
    -webkit-transform: translateY(-1000px);
    transform: translateY(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in-right {
  -webkit-animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-left {
  -webkit-animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-bottom {
  -webkit-animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0) translateX(-30%);
    opacity: 1;
  }
}

.slit-in-diagonal-1 {
  -webkit-animation: slit-in-diagonal-1 0.45s ease-out both;
  animation: slit-in-diagonal-1 0.45s ease-out both;
}
@keyframes slit-in-diagonal-1 {
  0% {
    -webkit-transform: translateZ(-800px) rotate3d(1, 1, 0, 90deg);
    transform: translateZ(-800px) rotate3d(1, 1, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  54% {
    -webkit-transform: translateZ(-160px) rotate3d(1, 1, 0, 87deg);
    transform: translateZ(-160px) rotate3d(1, 1, 0, 87deg);
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    opacity: 1;
  }
  100% {
    -webkit-transform: translateZ(0) rotate3d(1, 1, 0, 0);
    transform: translateZ(0) rotate3d(1, 1, 0, 0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
.swing-out-top-bck {
  -webkit-animation: swing-out-top-bck 0.45s
    cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
  animation: swing-out-top-bck 0.45s cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
}
@keyframes swing-out-top-bck {
  0% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateX(-100deg);
    transform: rotateX(-100deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 0;
  }
}

.bounce-top {
  -webkit-animation: bounce-top 1s 3 both;
  animation: bounce-top 1s 3 both;
}
@keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}

.bounce-top-infinite {
  -webkit-animation: bounce-top-infinite 4s infinite alternate both;
  animation: bounce-top-infinite 4s infinite alternate both;
}
@keyframes bounce-top-infinite {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
</style>
