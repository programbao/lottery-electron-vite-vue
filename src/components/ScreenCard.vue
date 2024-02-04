<template>
  <div class="card-box" v-if="!basicData.isEnterLottery">
    <div class="screen-card"
      :style="renderDomStyle"
      :class="{
        'slide-out-right': basicData.isEnterBgWall,
        'slide-in-right': !basicData.isEnterBgWall
      }"
     >
      <div 
        v-for="index in totalCard"
        :id="'card-' + index" 
        class="element" 
        :style="{
          width: cardConfigStyle.cardWidth,
          height: cardConfigStyle.cardHeight,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 120%',
          backgroundPosition: 'center center',
          backgroundColor: 'rgba(0,127,127,' + (Math.random() * 0.7 + 0.25) + ')'
        }">
        <div 
          class="company"
          v-if="cardConfigStyle.logo"
          :style="{
            top: cardConfigStyle.companyTop,
            'font-size': cardConfigStyle.companyFontSize
          }">
          <div class="image-text-container">
            <img 
              :src="cardConfigStyle.logo" 
              :style="{
                width: cardConfigStyle.imgWidth,
                height: cardConfigStyle.imgHeight,
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
            'top': cardConfigStyle.nameTop,
            'font-size': cardConfigStyle.nameFontSize,
            'line-height': cardConfigStyle.nameFontSize
          }" class="name">
          {{getUser(index)[2]}}
        </div>
        <div 
          :style="{
            bottom: cardConfigStyle.detailsBottom,
            fontSize: cardConfigStyle.detailsFontSize,
            lineHeight: cardConfigStyle.detailsFontSize
          }"
          class="details">
            <span class="cardIdTxt" :id="'card-' + getUser(index)[0]">{{getUser(index)[0]}}</span>
            <div :style="{height: 'calc(' + cardConfigStyle.detailsFontSize + ' + -4px)'}"></div>
            <span id="user-dept">{{getUser(index)[1]}}</span>
        </div>
      </div>
    </div>
  </div>
  <div 
    class="card-empty-tips" 
    v-show="basicData.prizes.length 
      && ((member.length <= 0 && currentPrize) || (!currentPrize && !basicData.isEnterLottery))">
    <span v-if="member.length <= 0 && currentPrize">奖项没有抽奖人员名单，请前往“名单设置”进行设置</span>
    <span v-if="!currentPrize">抽奖已结束，谢谢参与；如想添加抽奖奖项，请前往“奖项设置”进行设置</span>
  </div>
  <div class="prizes-empty-tips" v-if="!basicData.prizes.length">
    <span>暂无抽奖奖项，请前往“奖项设置”进行设置</span>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import bus from '../libs/bus'

// const isShowScreenCard = ref(true);
const currentPrize = computed(() => {
  return basicData.prizes[basicData.currentPrizeIndex];
});
const cardConfigStyle = computed(() => {
  return basicData.cardConfigStyle;
})
const member = computed(() => {
  // if (basicData.isEnterLottery) return []
  const memberListData = basicData.memberListData
  const currentLotteryGroup = basicData.currentLotteryGroup
  // console.log(memberListData, currentLotteryGroup)
  
  let resultMember = []
  if (currentLotteryGroup && currentLotteryGroup.group_identity) {
    resultMember = memberListData[currentLotteryGroup.group_identity] || []
  }
  // if (resultMember.length) {
  nextTick(() => {
    bus.emit('adjustShineUser')
  })
  // }
  return resultMember
})
const totalCard = computed(() => {
  if (basicData.isEnterLottery) return 0
  const { columnCount, rowCount } = basicData.beforeLotteryLayout
  let total = rowCount * columnCount; 
  if (member.value && total > member.value.length) {
    total = member.value.length
  }
  return total;
})

const renderDomStyle = computed(() => {
  if (basicData.isEnterLottery) return ''
  const { rowCount, columnCount, rowGap, columnGap, scale, top, left } = basicData.beforeLotteryLayout;
  return `
    grid-template-columns: repeat(${columnCount}, 1fr);
    grid-template-rows: repeat(${rowCount}, 1fr);  
    grid-row-gap: ${rowGap};
    grid-column-gap: ${columnGap};
    top: ${top};
    left: ${left};
    position: fixed;
    display: grid;
  `
})

const toAnimate = () => {
  if (basicData.isEnterLottery) return
  anime({
    targets: ".screen-card",
    scale: [0, basicData.beforeLotteryLayout.scale],
    easing: 'cubicBezier(0.250, 0.460, 0.450, 0.940)',
    duration: 400
  })
}
const getUser = (index) => {
  let user = {};
  const memberVal = member.value
  if (memberVal) user = memberVal[index % member.value.length] || {}
  return user
}
const adjuctScreenCardDisplay = (displayStr) => {
  if (basicData.isEnterLottery) return
  nextTick(() => {
    setTimeout(() => {
      document.querySelector('.screen-card') && (document.querySelector('.screen-card').style.display = displayStr)
    }, 100)
  })
}
const findCurrentLotteryGroup = () => {
  if (!basicData.currentPrize) return
  // 找到要展示的member
  const currentPrize = basicData.currentPrize;
  const userGroup = basicData.groupList.find(group => group.options.includes(currentPrize.type));
  if (!userGroup) {
    return;
  }
  return userGroup;
}
const groupListSetting = () => {
  if (basicData.isEnterLottery) return
  const userGroup = findCurrentLotteryGroup();
  if (userGroup) {
    const member = basicData.memberListData[userGroup.group_identity]
    if (!member || member.length <= 0) {
      document.querySelector('.card-empty-tips').style.display = 'grid'
      adjuctScreenCardDisplay('none')
    } else if (basicData.isEnterLottery) {
      document.querySelector('.card-empty-tips').style.display = 'none'
      adjuctScreenCardDisplay('none')
    } else if (!basicData.isEnterLottery) {
      document.querySelector('.card-empty-tips').style.display = 'none'
      adjuctScreenCardDisplay('grid')
    }
  } else if (basicData.prizes.length) {
    document.querySelector('.card-empty-tips').style.display = 'grid'
  }
}
bus.on('handleBeforeLotteryLayoutSetting', toAnimate)
bus.on('allStatusResetCompelted', toAnimate)
bus.on('groupListSetting', groupListSetting)
bus.on('adjuctScreenCardDisplay', adjuctScreenCardDisplay)
bus.on('adjuctUsersDataTips', groupListSetting)
onMounted(() => {
  nextTick(() => {
    toAnimate();
    groupListSetting();
  })
})
</script>

<style lang="scss" scoped>
.screen-card {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  .details {
    width: 100%;
  }
}
.card-empty-tips {
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 25px;
  color: orange;
  width: 40%;
}
.prizes-empty-tips {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 25px;
  color: orange;
}
</style>