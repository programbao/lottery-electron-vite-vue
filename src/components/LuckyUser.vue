<template>
  <div 
    id="lucky-user-box"
    :style="luckyUserBoxStyle"
    class="lucky-user-box">
    <canvas ref="confettiCanvasRef" class="confetti-canvas"></canvas>
    <div 
      :class="{
        'slide-in-right': basicData.isShowLuckyUser,
        'slide-out-left': !basicData.isShowLuckyUser
      }"
      class="lucky-content" 
      :style="lucksContentStyle"
      v-if="currentLuckys && currentLuckys.length">
      <!-- <div class="split-box"></div> -->
      <div 
        v-for="(lucky, index) in currentLuckys" 
        class="lucky-item element" 
        :style="{
          width: luckyCardConfigStyle.cardWidth,
          height: luckyCardConfigStyle.cardHeight,
        }"
        :key="index">
        <div 
          class="company"
          v-if="luckyCardConfigStyle.logo"
          :style="{
            top: luckyCardConfigStyle.companyTop,
            'font-size': luckyCardConfigStyle.companyFontSize
          }">
          <div class="image-text-container">
            <img 
              :src="luckyCardConfigStyle.logo" 
              :style="{
                width: luckyCardConfigStyle.imgWidth,
                height: luckyCardConfigStyle.imgHeight,
                objectFit: 'contain'
              }">
          </div>
        </div>
        <div 
          class="avatar"
          style="height: 100%;
            display: flex;
            position: relative;
            justify-content: center;
            align-items: center;
            z-index: -1">
          <div style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.1);position: absolute;top: 0;left:0;"></div>
        </div>
        <div 
          :style="{
            'width': '100%',
            'top': luckyCardConfigStyle.nameTop,
            'font-size': luckyCardConfigStyle.nameFontSize,
            'line-height': luckyCardConfigStyle.nameFontSize
          }" class="name">
          {{lucky[2]}}
        </div>
        <div 
          :style="{
            bottom: luckyCardConfigStyle.detailsBottom,
            fontSize: luckyCardConfigStyle.detailsFontSize,
            lineHeight: luckyCardConfigStyle.detailsFontSize
          }"
          class="details">
            <span class="cardIdTxt" :id="'card-' + lucky[0]">{{lucky[0]}}</span>
            <div :style="{height: 'calc(' + luckyCardConfigStyle.detailsFontSize + ' + -4px)'}"></div>
            <span id="user-dept">{{lucky[1]}}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="mark-operation">
          <div class="center-btn">
            <el-popconfirm 
              title="确认删除吗?" 
              confirm-button-type="danger"
              @confirm="deleteLucky(lucky)">
              <template #reference>
                <el-icon  size="30" color="#fff"><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
      <!-- <div class="split-box"></div> -->
    </div>
    <button 
      v-if="basicData.isShowLuckyUser"
      id="lucky-close-btn"
      class="btn closeBtn slide-in-bottom" 
      @click="closeBtn">
      Close
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
const confettiCanvasRef = ref();
const luckyCardConfigStyle = computed(() => {
  return basicData.luckyCardConfigStyle;
})

const luckysRowColObj = computed(() => {
  return basicData.luckysRowColObj;
});
const luckyUserBoxStyle = ref({
  'z-index': '-2',
})
const lucksContentStyle = computed(() => {
  let handleStyle = `
    display: grid;
    justify-content: center;
    margin-bottom: 8px;
    opacity: ${basicData.isShowLuckyUser ? '0': '1'};
    grid-row-gap: ${luckysRowColObj.value.rowGap};
    grid-column-gap: ${luckysRowColObj.value.columnGap};
    overflow: auto;
    padding: 2px;
    transition: opacity .3s ease-in-out;
    max-height: 100vh;
    max-width: 100vw;
  `;
  const type = luckysRowColObj.value.type;
  let rowCount = luckysRowColObj.value.rowCount;
  let columnCount = luckysRowColObj.value.columnCount;
  switch (type) {
    case 2:
      // rowCount = Math.ceil(currentLuckys.value.length / columnCount);
      columnCount = Math.ceil(currentLuckys.value.length / rowCount);
      if (columnCount > currentLuckys.value.length) {
        columnCount = currentLuckys.value.length
      }
      handleStyle += `grid-template-rows: repeat(${rowCount}, 1fr);grid-template-columns: repeat(${columnCount}, 1fr);`
      break;
    case 1:
      // columnCount = Math.ceil(currentLuckys.value.length / rowCount);
      if (columnCount > currentLuckys.value.length) {
        columnCount = currentLuckys.value.length
      }
      handleStyle += `grid-template-columns: repeat(${columnCount}, 1fr);`
      break;
    default:
      handleStyle += `grid-template-rows: repeat(${rowCount}, 1fr);grid-template-columns: repeat(${columnCount}, 1fr);`
      break;
  }
  return handleStyle
});
const currentLuckys = computed(() => {
  return basicData.currentLuckys;
});
let showTimer = null;
let isHandleDel = false
// 控制入场和退场动画
watch(
  () => basicData.isShowLuckyUser,
  () => {
    clearTimeout(showTimer);
    if (basicData.isShowLuckyUser) {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value['z-index'] = '400'
        $.confetti.setShowContentDom(confettiCanvasRef.value)
        $.confetti.restart();
      });
    } else {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value['z-index'] = '-2'
      }, 400);
    }
  }
)
let currentIndex = -1;
let lastIndex = -1;
const closeBtn = async () => {
  basicData.isShowLuckyUser = false;
  $.confetti.stop();
  if (isHandleDel) {
    let type = basicData.currentPrize.type;
    await myApi.saveOneRoundLuckyData(type, JSON.stringify(basicData.luckyUsers[type]));
    bus.emit('adjustCurrentPrize', {
      beforeModifyPrize: basicData.prizes[currentIndex],
      byIndexModifyPrize: basicData.prizes[lastIndex]
    });
    isHandleDel = false
    basicData.isNextPrize = false
    basicData.isContinueLottery = true
  }
}

const deleteLucky = (lucky) => {
  isHandleDel = true
  currentIndex = basicData.currentPrizeIndex
  lastIndex = basicData.lastTimePrizeIndex
  if (currentIndex !== lastIndex) {
    basicData.currentPrizeIndex = lastIndex;
    basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
  }
  let type = basicData.currentPrize.type;
  if (basicData.luckyUsers[type]) {
    basicData.currentLuckys = basicData.currentLuckys.filter(item => item[0] !== lucky[0]);
    basicData.luckyUsers[type] = basicData.luckyUsers[type].filter(user => lucky[0] !== user[0]);
  } 
}

</script>

<style lang="scss" scoped>
.lucky-user-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: -2;
  transition: all .2s;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: none; */
}
.lucky-content::-webkit-scrollbar {
  display: none;
}
.lucky-item {
  margin: 10px;
}
.lucky-item {
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95) !important;
  border: 1px solid rgba(253, 105, 0, 0.5) !important;
  background-color: rgba(0,127,127,0.5077637237470506) !important;
  position: relative;
  .mark-operation {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.3s;
    background-color: rgba(0, 0, 0, 0.5);
    .center-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      .el-icon {
        cursor: pointer;
      }
    }
  }
}
.lucky-item:hover {
  border: 1px solid rgba(253, 105, 0, 0.95) !important;
  .mark-operation {
    opacity: 1;
  }
}
.confetti-canvas {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.closeBtn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5vh;
  padding: 1vh 2vw;
  margin: 0;
}

.split-box {
  width: 100vw;
  height: 50px;
}
.slide-in-right {
	-webkit-animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
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
	-webkit-animation: slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	        animation: slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
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
.slide-in-bottom {
	-webkit-animation: slide-in-bottom 1.0s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-bottom 1.0s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
            transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}
</style>