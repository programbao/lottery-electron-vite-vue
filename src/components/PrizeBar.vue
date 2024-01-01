<template>
  <div 
    id="prizeBar"  
    :class="{
        'slide-out-left': basicData.isEnterBgWall,
        'slide-in-left': !basicData.isEnterBgWall
      }">
    <div v-if="prizes.length" class="prize-mess">
      <label id="prizeType" class="prize-shine">{{currentPrize.name}}</label>
      <label id="prizeText" class="prize-shine">{{currentPrize.otherName}}</label>
      ，剩余<label id="prizeLeft" class="prize-shine">{{getItemPrizeConfig(currentPrize.type).surplusCount}}</label>个
    </div>
    <ul 
      class="prize-list" 
      :style="{
        width: prizesBarStyle.barBoxWidth
      }"
      ref="prizeList">
      <li 
        v-for="item in prizes"
        :key="item.type"
        :id="'prize-item-' + item.type" 
        :style="{
          width: prizesBarStyle.prizeBoxWidth,
          'min-height': prizesBarStyle.prizeBoxMinHeight,
          'margin-bottom': prizesBarStyle.prizeSpace,
          'z-index': item.type == currentPrize.type && getItemPrizeConfig(item.type).activeClassName != 'done' && getItemPrizeConfig(item.type).surplusCount ? 1 : 0,
          'transform': item.type == currentPrize.type && getItemPrizeConfig(item.type).activeClassName != 'done' && getItemPrizeConfig(item.type).surplusCount ? `scale(${prizesBarStyle.currentPrizeScale})` : 'scale(1)',
        }"
        :class="[
          'prize-item', 
          item.type == currentPrize.type && getItemPrizeConfig(item.type).activeClassName != 'done' && getItemPrizeConfig(item.type).surplusCount ? 'shine' : '',
          getItemPrizeConfig(item.type).activeClassName == 'done' || !getItemPrizeConfig(item.type).surplusCount ? 'done' : ''
        ]">
            <div 
              :style="{
                'width': prizesBarStyle.imgGutterWidth,
                'height': prizesBarStyle.imgGutterHeight
              }"
              class="prize-img">
                <img :src="item.img" :alt="item.otherName">
            </div>
            <div class="prize-text">
              <h5 
                :style="{
                  'font-size': prizesBarStyle.prizeFontSize
                }"
                class="prize-title">{{item.name}} {{item.otherName}}</h5>
                <div class="prize-count">
                    <div 
                      class="progress"
                      :style="{height: prizesBarStyle.progressHeight}">
                        <div 
                          :id="'prize-bar-' + item.type" 
                          class="progress-bar progress-bar-danger progress-bar-striped active" 
                          :style="{
                            width: (getItemPrizeConfig(item.type).surplusCount / item.count).toFixed(2) * 100 + '%',
                          }">
                        </div>
                    </div>
                    <div 
                      :id="'prize-count-' + item.type" 
                      :style="{'font-size': prizesBarStyle.progressFontSize}"
                      class="prize-count-left">
                        {{getItemPrizeConfig(item.type).surplusCount + "/" + item.count}}
                    </div>
                </div>
            </div>
        </li>`
    </ul>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onBeforeMount, onMounted, computed, nextTick, watch } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();

// console.log(lotteryData, 'lotteryDatalotteryData')
const prizeList = ref(null);
const prizesListConfig = ref({});
const prizes = computed(() => {
  return basicData.prizes;
});
const currentPrize = computed(() => {
  return basicData.prizes[basicData.currentPrizeIndex] || {
    type: -1,
    count: 0,
    name: "谢谢参与 undian telah selesai,terima kasih telah bergabung",
    otherName: "已结束",
    img: ""
  };
});
const prizesBarStyle  = computed(() => {
  return basicData.prizesBarStyle;
})
const getItemPrizeConfig = (type) => {
  let itemPrizeConfig = prizesListConfig.value[type];
  
  if (!itemPrizeConfig) {
    itemPrizeConfig = {};
  }
  return itemPrizeConfig;
}
let changeScrollStep = 0
// 监听奖项index变化
watch(() => basicData.currentPrizeIndex, () => {
  if (changeScrollStep >= 2) {
    nextTick(() => {
      scrollTop()
      changeScrollStep = 0
    })
  }
})
// 滑动到特定位置
const scrollTop = () => {
  nextTick(() => {
    if (!basicData.currentPrize) return
    const handleDom = prizeList.value;
    const oldScrollTop = handleDom.scrollTop
    const type = basicData.currentPrize.type
    const scrollTop = document.querySelector(`#prize-item-${type}`).getBoundingClientRect().top - document.documentElement.clientHeight * 10.8 / 100 - 40 - oldScrollTop;
    anime({
      targets: handleDom,
      scrollTop: [oldScrollTop, oldScrollTop + scrollTop],
      duration: 2000,
      easing: 'cubicBezier(0.17, 0.08, 0.25, 1.00)'
    })
  })
}
// 奖项配置
// 标题文本对象
// const titleTips = ref({});
const setPrizeData = ({currentPrizeIndex, count, isInit}) => {
  let currentPrize = basicData.prizes[currentPrizeIndex] ||  {
    type: -1,
    count: 0,
    name: "谢谢参与 undian telah selesai,terima kasih telah bergabung",
    otherName: "已结束",
    img: ""
  },
    type = currentPrize.type,
    totalCount = currentPrize.count;

  count = totalCount - count;
  count = count < 0 ? 0 : count;
  if (basicData.lasetPrizeIndex !== currentPrizeIndex) {
    const isCpThenLP = currentPrizeIndex > basicData.lasetPrizeIndex;
    let handleIndex = isCpThenLP ? currentPrizeIndex : basicData.lasetPrizeIndex;
    let lastPrize = basicData.prizes[handleIndex];
    let needHandlePrize;
    if (lastPrize) {
      needHandlePrize = prizesListConfig.value[lastPrize.type]
      needHandlePrize.activeClassName = "done"
      prizesListConfig.value[type] && (prizesListConfig.value[type].activeClassName = "shine");
      changeScrollStep += 1;
    }
   
    basicData.lasetPrizeIndex = currentPrizeIndex;
  }

  prizesListConfig.value[type] && (prizesListConfig.value[type].surplusCount = count);
  if (currentPrize.type === -1) {
    prizesListConfig.value[type] && (prizesListConfig.value[type].activeClassName = "done")
  }
  if (count !== totalCount && count !== 0) {
    basicData.isContinueLottery = true
  } else {
    basicData.isContinueLottery = false
  }
};
const changePrize = () => {
  let luckys = basicData.currentPrize ? basicData.luckyUsers[basicData.currentPrize.type] : null;
  let luckyCount = (luckys ? luckys.length : 0) + (basicData.currentPrizeIndex >= 0 ? basicData.eachCount[basicData.currentPrizeIndex] : 0);
  // 修改左侧prize的数目和百分比
  setPrizeData({currentPrizeIndex: basicData.currentPrizeIndex, count: luckyCount});
}
let isInitPrizeData = false
const initHandlePrizeData = (toInit = false) => {
    if (!toInit && (!basicData.prizes || isInitPrizeData)) return
    isInitPrizeData = true
    let totalPrizeLen = basicData.prizes.length - 1
    totalPrizeLen = totalPrizeLen < 0 ? 0 : totalPrizeLen
    const currentIndex = basicData.currentPrizeIndex
    let needCount = totalPrizeLen - currentIndex
    if (needCount > totalPrizeLen) {
      needCount = totalPrizeLen
    }
    let needChangeIndex = totalPrizeLen;
    const prizes = basicData.prizes 
    // 初始化奖项相关样式类名和数量配置
    prizes.forEach((item, index) => {
      const type = item.type;
      const surplusCount = item.count - (!basicData.luckyUsers[type] ? 0 : basicData.luckyUsers[type].length);
      prizesListConfig.value[type] = {
        totalCount: item.count,
        surplusCount: surplusCount,
        activeClassName: surplusCount <= 0 ? "done" : "",
        defaultClassName: "prize-item",
      }
    })
    if (needCount <= 0) return
    // 滚动位置
    !toInit && scrollTop();
    for (let i = 0; i < needCount + 1; i++) {
      let itemLucky = basicData.luckyUsers[prizes[needChangeIndex]["type"]]
      if (itemLucky === undefined) {
        setPrizeData({ currentPrizeIndex: needChangeIndex, count: 0, isInit: true })
        return
      }
      setPrizeData({ currentPrizeIndex: needChangeIndex, count: itemLucky.length })
      needChangeIndex -= 1
    }
    if (totalPrizeLen - currentIndex > totalPrizeLen) {
      setPrizeData({ currentPrizeIndex: -1, count: 0 })
    }
}
const resetPrizes = () => {
  const totalPrizeLen = basicData.prizes.length
  for (let i = 0; i < totalPrizeLen; i++) {
    let prize = basicData.prizes[i]
    const type = prize.type
    let elements = {
      box: document.querySelector(`#prize-item-${type}`),
      bar: document.querySelector(`#prize-bar-${type}`),
      text: document.querySelector(`#prize-count-${type}`)
    };
    elements.box.classList.remove("shine"); 
    elements.box.classList.remove("done"); 
    if (i === totalPrizeLen -1) {
      elements.box.classList.add("shine");
    }
    // 重置相关字段
    prizesListConfig.value[prize.type] = {
      totalCount: prize.count,
      surplusCount: prize.count,
      activeClassName: "",
      defaultClassName: "prize-item",
    }
    // elements.bar && (elements.bar.style.width = 100 + "%");
    // elements.text && (elements.text.textContent = count + "/" + count);
  }
  basicData.lasetPrizeIndex = basicData.prizes.length - 1;
}
// 监听数据
// bus.on('initConfigDataEnd', initHandlePrizeData)
onBeforeUnmount(() => {
  // bus.off('initConfigDataEnd', initHandlePrizeData)
  bus.on("resetPrizes", resetPrizes)
})
onBeforeMount(() => {
  initHandlePrizeData();
  // if (basicData.prizes.length - basicData.currentPrizeIndex >= 2) {
  //   scrollTop();
  // }
})
const adjustCurrentPrize = (data) => {
  let { beforeModifyPrize, byIndexModifyPrize, isReGet } = data
  if (isReGet) {
    initHandlePrizeData(true);
  } else {
    const modifyType = byIndexModifyPrize.type
    beforeModifyPrize && (prizesListConfig.value[beforeModifyPrize.type].activeClassName = '')
    const adjustPrizeConfig = prizesListConfig.value[modifyType]
    adjustPrizeConfig.activeClassName = 'shine'
    adjustPrizeConfig.surplusCount = byIndexModifyPrize.count - (!basicData.luckyUsers[modifyType] ? 0 : basicData.luckyUsers[modifyType].length);
  }
}
bus.on('adjustCurrentPrize', adjustCurrentPrize)
bus.on("resetPrizes", resetPrizes)
bus.on('changePrize', changePrize)
bus.on('setPrizeData', setPrizeData)
</script>

<style lang="scss" scoped>
#prizeBar {
  position: fixed;
  left: 0;
  padding-left: 1.2vh;
  top: 1.2vh;
  z-index: 4;
}

.prize-list {
  position: fixed;
  top: 10vh;
  left: 20px;
  height: 85vh;
  overflow-y: auto;
  width: 25vw;
  padding: 0;
  padding: 40px 0;
}
.prize-list::-webkit-scrollbar {
  display: none;
}
.prize-item {
  padding: 9px;
  // margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-wrap: nowrap;
  background-color: rgba(0, 127, 127, 0.37);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
  width: 20vw;
  min-height: 15vh;
  box-sizing: border-box;
  transition: transform 1s ease-in;
  position: relative;
  &:last-child {
    // margin-bottom: 40px;
  }
}

.prize-item .prize-img {
  width: 8vh;
  height: 8vh;
  margin-right: 1.2vh;
  border-radius: 50%;
  background-color: #fff;
  text-shadow: 0 0 1vh rgba(0, 255, 255, 0.95);
  overflow: hidden;
}
#prize-item-1, #prize-item-2, #prize-item-3 {
  /* display: none; */
}
.prize-img img {
  width: 90%;
  height: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.prize-text {
  flex: 1;
}

.prize-title {
  margin: 4px 0;
  font-size: 1vw;
}

.prize-count {
  padding: 4px 0;
  position: relative;
}

.prize-count .progress {
  height: 1.8vh;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px;
  overflow: visible;
  border-radius: 1vh;
}

.progress .progress-bar {
  border-radius: 1.8vh;
  position: relative;
  animation: animate-positive 2s;
  background-color: #d9534f;
  // height: 1.8vh;
  height: 100%;
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.progress-bar.active {
  animation: reverse progress-bar-stripes 0.4s linear infinite,
    animate-positive 2s;
}

.progress-bar-striped {
  background-image: -webkit-linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-image: -o-linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  -webkit-background-size: 8px 8px;
  background-size: 8px 8px;
}

@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}

@keyframes animate-positive {
  0% {
    width: 0;
  }
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@-o-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}


.prize-count-left {
  position: absolute;
  color: #fff;
  right: 9px;
  font-size: 1vw;
  line-height: 1.6vh;
  top: 50%;
  transform: translateY(-50%);
}

.shine {
  box-shadow: 0 0 15px 0 rgba(0, 255, 255, 0.5);
  transform: scale(1.2);
  transform-origin: left center;
  position: relative;
  overflow: hidden;
}

.done {
  position: relative;
}

.done:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
}


.shine span {
  position: absolute;
  display: block
}

.shine span:nth-child(1) {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: animate1 1s linear infinite
}

@keyframes animate1 {
  0% {
    left: -100%
  }

  50%,
  100% {
    left: 100%
  }
}

.shine span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: animate2 1s linear infinite;
  animation-delay: .25s
}

@keyframes animate2 {
  0% {
    top: -100%
  }

  50%,
  100% {
    top: 100%
  }
}

.shine span:nth-child(3) {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: animate3 1s linear infinite;
  animation-delay: .50s
}

@keyframes animate3 {
  0% {
    right: -100%
  }

  50%,
  100% {
    right: 100%
  }
}

.shine span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: animate4 1s linear infinite;
  animation-delay: .75s
}

@keyframes animate4 {
  0% {
    bottom: -100%
  }

  50%,
  100% {
    bottom: 100%
  }
}


.shine.prize-item {
  /* width: 24vh; */
  // margin: 1.8vh 0;
}

.prize-mess {
  color: #fff;
  line-height: 5vh;
  font-size: 1.6vh;
  margin: 2.4vh 0;
}

.prize-shine {
  font-size: 4vh;
  font-weight: bold;
  color: #db5c58;
  vertical-align: middle;
  padding: 0 6px;
}
</style>