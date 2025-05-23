<template>
  <div
    :style="luckyUserBoxStyle"
    ref="allLuckyUserBoxRef"
    class="all-lucky-user-box"
  >
    <!-- <canvas ref="confettiCanvasRef" class="confetti-canvas"></canvas> -->
    <canvas id="fireworks_all" class="fireworks-canvas"></canvas>

    <div
      :class="{
        'slide-in-right': basicData.isShowAllLuckyUser,
        'slide-out-left': !basicData.isShowAllLuckyUser,
      }"
      class="prize-list-box-title"
    >
      🎉 感谢大家的热情参与，本次活动幸运儿已全部揭晓！名单如下：
    </div>
    <div
      :class="{
        'slide-in-right': basicData.isShowAllLuckyUser,
        'slide-out-left': !basicData.isShowAllLuckyUser,
      }"
      v-for="(currentLuckys, key) in allLuckyUsers"
      :key="key"
    >
      <div class="prize-type-title">
        {{
          prizeTypeObjectMap[key] ? "👉" + prizeTypeObjectMap[key]["name"] : ""
        }}
        {{
          prizeTypeObjectMap[key] && prizeTypeObjectMap[key]["otherName"]
            ? ", " + prizeTypeObjectMap[key]["otherName"]
            : ""
        }}
      </div>
      <div class="lucky-content" :style="lucksContentStyle(currentLuckys)">
        <div
          v-for="(lucky, index) in currentLuckys"
          class="lucky-item element"
          :style="{
            width: luckyCardConfigStyle.cardWidth,
            height: luckyCardConfigStyle.cardHeight,
          }"
          :key="index"
        >
          <div
            class="company"
            v-if="luckyCardConfigStyle.logo"
            :style="{
              top: luckyCardConfigStyle.companyTop,
              'font-size': luckyCardConfigStyle.companyFontSize,
            }"
          >
            <div class="image-text-container">
              <img
                :src="luckyCardConfigStyle.logo"
                :style="{
                  width: luckyCardConfigStyle.imgWidth,
                  height: luckyCardConfigStyle.imgHeight,
                  objectFit: 'contain',
                }"
              />
            </div>
          </div>
          <div
            class="avatar"
            style="
              height: 100%;
              display: flex;
              position: relative;
              justify-content: center;
              align-items: center;
              z-index: -1;
            "
          >
            <div
              style="
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.1);
                position: absolute;
                top: 0;
                left: 0;
              "
            ></div>
          </div>
          <div
            :style="{
              width: '100%',
              top: luckyCardConfigStyle.nameTop,
              'font-size': luckyCardConfigStyle.nameFontSize,
              'line-height': luckyCardConfigStyle.nameFontSize,
            }"
            class="name"
          >
            {{ lucky[2] }}
          </div>
          <div
            :style="{
              bottom: luckyCardConfigStyle.detailsBottom,
              fontSize: luckyCardConfigStyle.detailsFontSize,
              lineHeight: luckyCardConfigStyle.detailsFontSize,
            }"
            class="details"
          >
            <span class="cardIdTxt" :id="'card-' + lucky[0]">{{
              lucky[0]
            }}</span>
            <div
              :style="{
                height:
                  'calc(' + luckyCardConfigStyle.detailsFontSize + ' + -4px)',
              }"
            ></div>
            <span id="user-dept">{{ lucky[1] }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-icon class="close-icon" :size="30" @click="closeBtn"><Close /></el-icon>
  </div>
</template>

<script setup>
// import { ipcRenderer  } from 'electron'
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { lotteryDataStore } from "../store";
import bus from "../libs/bus";
import { canvasFireworks,clearCanvas } from '../libs/fireworks.js'
const basicData = lotteryDataStore();
const allLuckyUserBoxRef = ref();
const luckyCardConfigStyle = ref({});
const confettiCanvasRef = ref();
const luckysRowColObj = ref({});
const allLuckyUsers = ref({});
const luckyUserBoxStyle = ref({
  "z-index": "-2",
});
let showTimer = null;
const prizeTypeObjectMap = {};
let autoScrollTimer = null;
// const luckyCardConfigStyle = coumputed(() => {
//   return basicData.luckyCardConfigStyle
// })
// 控制入场和退场动画
watch(
  () => basicData.isShowAllLuckyUser,
  () => {
    clearTimeout(showTimer);
    cancelAnimationFrame(autoScrollTimer);
    // clearInterval(autoScrollTimer);
    if (basicData.isShowAllLuckyUser) {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value["z-index"] = "400";
        basicData.prizes.forEach((item) => {
          prizeTypeObjectMap[item.type] = item;
        });
        let filtLuckyUsers = {};
        Object.keys(basicData.luckyUsers).forEach((key) => {
          if (prizeTypeObjectMap[key]) {
            filtLuckyUsers[key] = basicData.luckyUsers[key];
          }
        });
        allLuckyUsers.value = JSON.parse(JSON.stringify(filtLuckyUsers));
        filtLuckyUsers = null;
        luckysRowColObj.value = basicData.luckysRowColObj;
        luckyCardConfigStyle.value = basicData.luckyCardConfigStyle;
        // $.confetti.setShowContentDom(confettiCanvasRef.value)
        // $.confetti.restart();
        setTimeout(() => {
          autoScrollFn();
        }, 1000);
      });
    } else {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value["z-index"] = "-2";
      }, 400);
    }
  }
);
const lucksContentStyle = (currentLuckys) => {
  let handleStyle = `
    display: grid;
    justify-content: center;
    margin-bottom: 8px;
    opacity: ${basicData.isShowAllLuckyUser ? "1" : "0"};
    grid-row-gap: ${luckysRowColObj.value.rowGap};
    grid-column-gap: ${luckysRowColObj.value.columnGap};
    overflow: auto;
    padding: 2px;
    transition: opacity .3s ease-in-out;
  `;
  const type = luckysRowColObj.value.type;
  let rowCount = luckysRowColObj.value.rowCount;
  let columnCount = luckysRowColObj.value.columnCount;
  switch (type) {
    case 2:
      // rowCount = Math.ceil(currentLuckys.value.length / columnCount);
      columnCount = Math.ceil(currentLuckys.value.length / rowCount);
      handleStyle += `grid-template-rows: repeat(${rowCount}, 1fr);grid-template-columns: repeat(${columnCount}, 1fr);`;
      break;
    case 1:
      // columnCount = Math.ceil(currentLuckys.value.length / rowCount);
      handleStyle += `grid-template-columns: repeat(${columnCount}, 1fr);`;
      break;
    default:
      handleStyle += `grid-template-rows: repeat(${rowCount}, 1fr);grid-template-columns: repeat(${columnCount}, 1fr);`;
      break;
  }
  return handleStyle;
};
const closeBtn = () => {
  basicData.isShowAllLuckyUser = false;
  // $.confetti.stop();
};
// 自动滚动
const autoScrollFn = (params) => {
  // 获取滚动容器和内容
  const scrollContainer = allLuckyUserBoxRef.value;

  const scrollSpeed = 2;
  const scrollDirection = "down";

  let scrolling = true;
  console.log(
    scrollContainer.scrollTop + scrollContainer.clientHeight <
      scrollContainer.scrollHeight,
    scrollContainer.scrollTop,
    scrollContainer.clientHeight,
    scrollContainer.scrollHeight
  );
  function canScroll() {
    return scrollDirection === "down"
      ? scrollContainer.scrollTop + scrollContainer.clientHeight <
          scrollContainer.scrollHeight
      : scrollContainer.scrollTop > 0;
  }
  function autoScroll() {
    console.log("autoScroll");
    autoScrollTimer = requestAnimationFrame(function () {
      if (scrolling) {
        if (scrollDirection === "up") {
          scrollContainer.scrollTop -= scrollSpeed;
        } else {
          scrollContainer.scrollTop += scrollSpeed;
        }

        // 如果滚动到底部，回到顶部
        if (scrollDirection === "up" && scrollContainer.scrollTop <= 0) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else if (
          scrollDirection === "down" &&
          scrollContainer.scrollTop >=
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 20
        ) {
          scrollContainer.scrollTop = 0;
        }
      }
      autoScroll();
    });
  }

  if (canScroll()) {
    autoScroll();
  }
};

onMounted(() => {
     //烟花效果
  const canvas = document.getElementById("fireworks_all");
  const fireworks =  canvasFireworks(canvas);
  fireworks.start();
  luckyCardConfigStyle.value = basicData.luckyCardConfigStyle;
  bus.on("luckyCardConfigStyleSetting", () => {
    setTimeout(() => {
      luckyCardConfigStyle.value = basicData.luckyCardConfigStyle;
    }, 1100);
  });
  // 在销毁时停止烟花和清理
  onBeforeUnmount(() => {
    // if (stopFireworks) stopFireworks(); // 停止动画
    if (fireworks) fireworks.stop(); // 停止动画
    clearCanvas(canvas); // 清理 canvas
  });

  // Listen for app focus and blur events
  window.ipcRenderer.on('app-focus', (_event, ...args) => {
    console.log('[fireworks.start]:', ...args)
    fireworks.start();
  })
  window.ipcRenderer.on('app-blur', (_event, ...args) => {
    console.log('[fireworks.stop]:', ...args)
    fireworks.stop();
  })
});
</script>

<style lang="scss" scoped>
.fireworks-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 位于背景层 */
  pointer-events: none; /* 不影响其他操作 */
}
.all-lucky-user-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: -2;
  transition: all 0.2s;
  max-height: 100vh;
  overflow-y: auto;
  padding: 30vh 4vw 50vh;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    // background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  .prize-list-box-title,
  .prize-type-title {
    font-size: 5vh;
    color: rgb(255, 215, 11);
    text-align: center;
    font-weight: 700;
    margin-top: 60px;
    margin-bottom: 20px;
  }
  .prize-type-title {
    font-size: 4vh;
  }
  .lucky-item {
    margin: 10px;
  }
  .lucky-item {
    box-shadow: 0 0 12px rgba(148, 121, 2, 0.95) !important;
    background-color: rgba(255, 215, 11, 0.75) !important;
    // box-shadow: 0 0 12px rgba(253, 105, 0, 0.95) !important;
    // border: 1px solid rgba(253, 105, 0, 0.5) !important;
    // background-color: rgba(0,127,127,0.5077637237470506) !important;
  }
  .details {
    color: rgba(153, 15, 15, 0.75);
    font-size: 26px;
  }
  .lucky-item:hover {
    box-shadow: 0 0 12px rgba(253, 105, 0, 0.95) !important;
  }
  .confetti-canvas {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
  .close-icon {
    position: fixed;
    right: 20px;
    top: 20px;
    font-size: 1.5vh;
    padding: 1vh 2vw;
    margin: 0;
    font-weight: bold;
    color: rgba(255, 215, 11);
    cursor: pointer;
  }

  .split-box {
    width: 100vw;
    height: 50px;
  }
}

.slide-in-right {
  -webkit-animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@-webkit-keyframes slide-in-right {
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
.slide-out-left {
  -webkit-animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@-webkit-keyframes slide-out-left {
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
</style>
