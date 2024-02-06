<template>
  <div id="menu">
    <div 
      v-show="noHideBtn" 
      :class="{
        'slide-out-bottom': basicData.isEnterBgWall,
        'slide-in-bottom': !basicData.isEnterBgWall
      }"
      class="lottery-operation-btn"
      :style="operationBtnStyle">
      <div class="begin-lottery">
        <button class="btn" id="enter"  v-if="noBeginLottery" @click="(e) => enterLottery(e)">
          {{ textMappingConfig.enter.chineseText }}
          <span v-if="textMappingConfig.enter.otherLanguagesText">
            <br/>
            {{ textMappingConfig.enter.otherLanguagesText }}
          </span>
        </button>
        <button 
          class="btn"
          id="showPrize" 
          @click="(e) => showPrize(e)" 
          v-if="!noBeginLottery && isNextPrize && currentPrize">
          <div v-html="currentPrize.name">
          </div>
          <!-- <br/>奖项 undian selanjutnya -->
        </button>
        <button 
          class="btn" 
          id="lottery" 
          v-show="!noBeginLottery && !isNextPrize" 
          @click="(e) => beginLottery(e, isLotting ? textMappingConfig.lotteryEnd.chineseText : isContinueLottery ?  textMappingConfig.continueLottery.chineseText : textMappingConfig.lottery.chineseText)">
          {{ isLotting ? textMappingConfig.lotteryEnd.chineseText : isContinueLottery ?  textMappingConfig.continueLottery.chineseText : textMappingConfig.lottery.chineseText }}
          <span v-if="textMappingConfig.lotteryEnd.otherLanguagesText && isLotting">
            <br/>
            {{ textMappingConfig.lotteryEnd.otherLanguagesText }}
          </span>
          <span v-if="textMappingConfig.continueLottery.otherLanguagesText && isContinueLottery && !isLotting">
            <br/>
            {{ textMappingConfig.continueLottery.otherLanguagesText }}
          </span>
          <span v-if="textMappingConfig.lottery.otherLanguagesText && !isContinueLottery && !isLotting">
            <br/>
            {{ textMappingConfig.lottery.otherLanguagesText }}
          </span>
        </button>
      </div>
      <button 
        class="btn"
        id="reLottery"
        @click="(e) => reLottery(e)"
        v-show="!noBeginLottery 
          && !isResetCurrentPrize
          && basicData.currentLuckys.length
          && !isShowAllLuckys
          && !isLotting
          && !isFirstPrize">
          {{ (isNextPrize || isShowPrizeMark) ? textMappingConfig.lastRoundLottery.chineseText : textMappingConfig.reLottery.chineseText }}
          <!-- {{ (isNextPrize || isShowPrizeMark) ? 'Gambar ulang putaran sebelumnya' : 'Gambar ulang' }} -->
          <span v-if="textMappingConfig.lastRoundLottery.otherLanguagesText && (isNextPrize || isShowPrizeMark)">
            <br/>
            {{ textMappingConfig.lastRoundLottery.otherLanguagesText }}
          </span>
          <span v-if="textMappingConfig.reLottery.otherLanguagesText && !(isNextPrize || isShowPrizeMark)">
            <br/>
            {{ textMappingConfig.reLottery.otherLanguagesText }}
          </span>
      </button>
      <button 
        id="showAllLucks" 
        class="btn" 
        v-if="!currentPrize"
        @click="(e) => showAllLuckyUser('showAllLuckys', e)">
        {{ textMappingConfig.showAllLucks.chineseText }}
          <span v-if="textMappingConfig.showAllLucks.otherLanguagesText">
            <br/>
            {{ textMappingConfig.showAllLucks.otherLanguagesText }}
          </span>
      </button>
    </div>

    <!-- <button class="btn" id="configBtn" @click="toggleConfig">系统配置</button> -->
    <!-- 屏幕墙 -->
    <img
      class="screen-img"
      :style="{
        'z-index': isShowScreenImg ? 0 : -1
      }"
      :src="screenImg.fileUrl"
      :class="{
        'slit-in-diagonal-1': isShowScreenImg,
        'swing-out-top-bck': !isShowScreenImg
      }"/>
    <div 
      v-if="isTipsBottomBar" 
      @click="isTipsBottomBar = false"
      class="tips-bottom bounce-top-infinite">
      <span>
        {{ textMappingConfig.clickHidden.chineseText }}
          <span v-if="textMappingConfig.clickHidden.otherLanguagesText">
            <br/>
            {{ textMappingConfig.clickHidden.otherLanguagesText }}
          </span>
      </span>
      <el-icon :size="40"><CaretBottom /></el-icon>
    </div>
    <div
      ref="bottomBar"
      :class="{
        'to-long-show': isTipsBottomBar
      }"
      class="bottom-bar">
      <div class="quick-operation">
        <button class="btn" @click="(e) => bgWallClick(e)">
          {{ textMappingConfig.bgWallClick.chineseText }}
          <span v-if="textMappingConfig.bgWallClick.otherLanguagesText">
            <br/>
            {{ textMappingConfig.bgWallClick.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="(e) => toggleScreenImg(e)">
          {{ textMappingConfig.toggleScreenImg.chineseText }}
          <span v-if="textMappingConfig.toggleScreenImg.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleScreenImg.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="(e) => showLotteryClick(e)">
          {{ textMappingConfig.showLotteryClick.chineseText }}
          <span v-if="textMappingConfig.showLotteryClick.otherLanguagesText">
            <br/>
            {{ textMappingConfig.showLotteryClick.otherLanguagesText }}
          </span>
        </button>
      </div>
      <div class="setting">
        <button class="btn" @click="(e) => toggleSetting('prizeSetting', e)">
          {{ textMappingConfig.toggleSettingPrizeSetting.chineseText }}
          <span v-if="textMappingConfig.toggleSettingPrizeSetting.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingPrizeSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="(e) => toggleSetting('usersSetting', e)">
          {{ textMappingConfig.toggleSettingUsersSetting.chineseText }}
          <span v-if="textMappingConfig.toggleSettingUsersSetting.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingUsersSetting.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="(e) => toggleSetting('cardSetting', e)">
          {{ textMappingConfig.toggleSettingCardSetting.chineseText }}
          <span v-if="textMappingConfig.toggleSettingCardSetting.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingCardSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="(e) => toggleSetting('ballSetting', e)">
          {{ textMappingConfig.toggleSettingBallSetting.chineseText }}
          <span v-if="textMappingConfig.toggleSettingBallSetting.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingBallSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="(e) => toggleSetting('textMappingConfig', e)">
          {{ textMappingConfig.toggleSettingTextMappingConfig.chineseText }}
          <span v-if="textMappingConfig.toggleSettingTextMappingConfig.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingTextMappingConfig.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="(e) => toggleSetting('otherResourceSetting', e)">
          {{ textMappingConfig.toggleSettingOtherResourceSetting.chineseText }}
          <span v-if="textMappingConfig.toggleSettingOtherResourceSetting.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingOtherResourceSetting.otherLanguagesText }}
          </span>
       </button>
       <button class="btn" @click="(e) => toggleSetting('operationLog', e)">
          {{ textMappingConfig.operationLog.chineseText }}
          <span v-if="textMappingConfig.operationLog.otherLanguagesText">
            <br/>
            {{ textMappingConfig.operationLog.otherLanguagesText }}
          </span>
       </button>
        <button class="btn lock-btn" @click="(e) => toggleSetting('secretSetting', e)"><el-icon :size="30"><Lock /></el-icon></button>
        <button class="btn lock-btn" @click="(e) => toggleSetting('openDevTools', e)"><el-icon :size="30"><SetUp /></el-icon></button>
      </div>
      <div class="other">
        <button :key="tipsOpenFileKey" class="btn bounce-top" @click="(e) => toggleSetting('checkFileList', e)">
          {{ textMappingConfig.toggleSettingCheckFileList.chineseText }}
          <span v-if="textMappingConfig.toggleSettingCheckFileList.otherLanguagesText">
            <br/>
            {{ textMappingConfig.toggleSettingCheckFileList.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="(e) => showAllLuckyUser(null, e)">
          {{ textMappingConfig.showAllLuckyUser.chineseText }}
          <span v-if="textMappingConfig.showAllLuckyUser.otherLanguagesText">
            <br/>
            {{ textMappingConfig.showAllLuckyUser.otherLanguagesText }}
          </span>
       </button>
        <button id="save" class="fixed-btn btn" @click="(e) => exportData(e)">
          {{ textMappingConfig.exportData.chineseText }}
          <span v-if="textMappingConfig.exportData.otherLanguagesText">
            <br/>
            {{ textMappingConfig.exportData.otherLanguagesText }}
          </span>
       </button>
        <button id="reset" class="fixed-btn btn" @click="(e) => resetCurrentPrizeBtnClick(e)">
          {{ textMappingConfig.resetCurrentPrizeBtnClick.chineseText }}
          <span v-if="textMappingConfig.resetCurrentPrizeBtnClick.otherLanguagesText">
            <br/>
            {{ textMappingConfig.resetCurrentPrizeBtnClick.otherLanguagesText }}
          </span>
       </button>
        <button id="reset" class="fixed-btn btn" @click="(e) => resetBtnClick(e)">
          {{ textMappingConfig.resetBtnClick.chineseText }}
          <span v-if="textMappingConfig.resetBtnClick.otherLanguagesText">
            <br/>
            {{ textMappingConfig.resetBtnClick.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" id="fullScreen" @click="(e) => toggleFullScreen(e)">
          {{ isFullScreen ? textMappingConfig.quitFullScreen.chineseText : textMappingConfig.enterFullScreen.chineseText }}
          <span v-if="textMappingConfig.quitFullScreen.otherLanguagesText && isFullScreen">
            <br/>
            {{ textMappingConfig.quitFullScreen.otherLanguagesText }}
          </span>
          <span v-if="textMappingConfig.enterFullScreen.otherLanguagesText && !isFullScreen">
            <br/>
            {{ textMappingConfig.enterFullScreen.otherLanguagesText }}
          </span>
        </button>
        <MusicBtn />
      </div>
      <div class="help">
        <button class="btn bounce-top" @click="(e) => helpClick(e)">
          {{ textMappingConfig.help.chineseText }}
          <span v-if="textMappingConfig.help.otherLanguagesText">
            <br/>
            {{ textMappingConfig.help.otherLanguagesText }}
          </span>
       </button>
      </div>
    </div>

    <usersSettingDialog ref="usersSettingDialogRef" />
    <prizeSettingDialog ref="prizeSettingDialogRef" />
    <cardSettingDialog ref="cardSettingDialogRef" />
    <otherResourceSettingDialog ref="otherResourceSettingDialogRef" />
    <secretSettingDialog ref="secretSettingDialogRef" />
    <ballSettingDialog ref="ballSettingDialogRef" />
    <checkFileListDialog ref="checkFileListDialogRef" />
    <textMappingConfigDialog ref="textMappingConfigDialogRef" />
    <operationLogDialog ref="operationLogRef" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MusicBtn from "./MusicBtn.vue";
import bus from '../libs/bus'
import { useToast } from "vue-toastification";
const toast = useToast();
import { lotteryDataStore } from '../store'
import usersSettingDialog from "../components/configWidget/usersSetting/dialog.vue"
import prizeSettingDialog from "../components/configWidget/prizeSetting/dialog.vue"
import cardSettingDialog from "../components/configWidget/cardSetting/dialog.vue"
import secretSettingDialog from "../components/configWidget/secretSetting/dialog.vue"
import otherResourceSettingDialog from "../components/configWidget/otherResourceSetting/dialog.vue"
import operationLogDialog from "../components/configWidget/operationLog/dialog.vue"
import ballSettingDialog from "../components/configWidget/ballSetting/dialog.vue"
import checkFileListDialog from "../components/configWidget/checkFileList/dialog.vue"
import textMappingConfigDialog from "../components/configWidget/textMappingConfig/dialog.vue"
import openHelp from '../libs/help.js'
const operationBtnStyle = ref({});
import dayjs from 'dayjs'
import { nanoid } from 'nanoid';
// 打开设置
const usersSettingDialogRef = ref();
const prizeSettingDialogRef = ref();
const cardSettingDialogRef = ref();
const otherResourceSettingDialogRef = ref();
const secretSettingDialogRef = ref();
const ballSettingDialogRef = ref();
const checkFileListDialogRef = ref();
const textMappingConfigDialogRef = ref();
const operationLogRef = ref();
const basicData = lotteryDataStore();
const toggleSetting = (settingStr, event) => {
  // window.operationLogTable.add({
  //   id: nanoid(),
  //   date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
  //   type: 'control_btn',
  //   value: settingStr
  // })
  switch (settingStr) {
    case 'usersSetting':
      usersSettingDialogRef.value.toggleConfig()
      break;
    case 'prizeSetting':
      prizeSettingDialogRef.value.toggleConfig()
      break;
    case 'cardSetting':
      cardSettingDialogRef.value.toggleConfig()
      break;
    case 'otherResourceSetting': 
      otherResourceSettingDialogRef.value.toggleConfig()
      break;
    case 'operationLog': 
      operationLogRef.value.toggleConfig()
      break;
    case 'secretSetting':
      secretSettingDialogRef.value.toggleConfig()
      break;
    case 'ballSetting':
      ballSettingDialogRef.value.toggleConfig()
      break;
    case 'openDevTools':
      myApi.openDevTools();
      break;
    case 'checkFileList': // 显示文件列表
      checkFileListDialogRef.value.toggleConfig()
      break;
    case 'textMappingConfig': 
      textMappingConfigDialogRef.value.toggleConfig()
      break;
    default:
      break;
  }
}

//帮助
const helpClick = (e) => {
  isTipsBottomBar.value = true
  openHelp(basicData);
}

// const currentPrizeSurplusCount = computed(() => {
//   console.log(basicData.lastTimePrizeIndex, 'basicData.lastTimePrizeIndex')
//   const handlePrize = basicData.currentPrize ? basicData.currentPrize : basicData.prizes[basicData.lastTimePrizeIndex];
//   return basicData.handlePrize.count - (!basicData.luckyUsers[handlePrize.type] ? 0 : basicData.luckyUsers[handlePrize.type].length);
// })
const isShowAllLuckys = ref(false);
const showAllLuckyUser = (isShowAllLuckysKey) => {
  basicData.isShowAllLuckyUser = true
  if (isShowAllLuckysKey === 'showAllLuckys') {
    isShowAllLuckys.value = true
  }
}
const tipsOpenFileKey = ref(0);

// 图片相关设置
const isShowScreenImg = ref(false)
const bgWallClick = () => {
  basicData.isEnterBgWall = true
  isShowScreenImg.value = false
}
const showLotteryClick = () => {
  basicData.isEnterBgWall = false
  isShowScreenImg.value = false
}
const screenImg = computed(() => {
  return basicData.otherResource.screenImg
})
const toggleScreenImg = (bool) => {
  isShowScreenImg.value = true
}

const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const bottomBar = ref();
// const isShowPrizeBtn = ref(true);
// console.log(lotteryData, 'lotteryDatalotteryData')
const currentPrize = computed(() => {
  return basicData.prizes[basicData.currentPrizeIndex];
});
const isNextPrize = computed(() => {
  // console.log(currentPrizeSurplusCount.value, 'currentPrizeSurplusCountcurrentPrizeSurplusCount')
  return basicData.isNextPrize;
})
const isLotting = computed(() => {
  return basicData.isLotting;
});
const isContinueLottery = computed(() => {
  return basicData.isContinueLottery;
})
const isShowPrizeMark = computed(() => {
  return basicData.isShowPrizeMark;
})
const isHideCommonBtn = ref(false);
const noHideBtn = computed(() => {
  let noHide = true;
  if (basicData.isShowLuckyUser || basicData.isShowAllLuckyUser) {
    noHide = false;
  }
  if (isHideCommonBtn.value) {
    noHide = false
  }
  return noHide;
})
const isFirstPrize = ref(true);
const noBeginLottery = ref(true);
const isFullScreen = ref(false)
const isResetCurrentPrize = ref(false)
const enterLottery = (e) => {
  if (basicData.prizes.length === 0 || !noHideBtn.value) {
    ElMessage({
      type: 'error',
      message: '不可操作',
    })
    return
  }
  bus.emit('enterLottery')
  basicData.isEnterLottery = true
  isResetCurrentPrize.value = false
  noBeginLottery.value = false
  if (e && e.currentTarget) {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}
const handleEnterLotteryEnd = () => {
  noBeginLottery.value = false
}
const beginLottery = (e, btnTxt) => {
  if (basicData.prizes.length === 0 || !noHideBtn.value) {
    ElMessage({
      type: 'error',
      message: '不可操作',
    })
    return
  }
  if (basicData.isAnimating && btnTxt !== textMappingConfig.value.lotteryEnd.chineseText) {
    toast.info(`请等待动画加载完成  harap tunggu hingga animasi dimuat`, { 
      timeout: 2000
    });
    return
  }
  if (btnTxt === textMappingConfig.value.lottery.chineseText) {
    bus.emit('adjustLotteryActionBtn')
  }
  bus.emit('beginLottery')
  isFirstPrize.value = false
  isResetCurrentPrize.value = false
  if (e && e.currentTarget) {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}
const showPrize = (e) => {
  bus.emit('showPrize')
  if (e && e.currentTarget) {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}
const reLottery = (e) => {
  bus.emit('reLottery')
  bus.emit('hidePrizeMark');
  if (e && e.currentTarget) {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}

// const showPrizeEnd = () => {
//   isShowPrizeBtn.value = false
// }
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

const toggleFullScreen = async (e) => {
  let fullScreenStatus = await myApi.toggleFullScreen();
  isFullScreen.value = fullScreenStatus;
  if (e && e.currentTarget) {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}
const exportData = (e) => {
  bus.emit('exportData')
  tipsOpenFileKey.value = new Date().getTime();
  if (e && e.currentTarget) {
    console.log( e.currentTarget.innerText, 'e.currentTargete.currentTarget')
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'control_btn',
      value: e.currentTarget.innerText
    })
  }
}

const resetCurrentPrizeBtnClick = (e) => {
  if (basicData.prizes.length === 0) {
    ElMessage({
      type: 'error',
      message: '暂无奖项可重置',
    })
    return
  }
  ElMessageBox.confirm(
    '当前中奖记录都将被清空，确认要重置吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      bus.emit('resetCurrentPrizeBtnClick')
      ElMessage({
        type: 'success',
        message: '当前奖项已重置成功',
      })
      isResetCurrentPrize.value = true
      if (e && e.currentTarget) {
        window.operationLogTable.add({
          id: nanoid(),
          date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
          type: 'control_btn',
          value: e.currentTarget.innerText
        })
      }
    }) 
}
const resetBtnClick = (e) => {
  if (basicData.prizes.length === 0) {
    ElMessage({
      type: 'error',
      message: '暂无奖项可重置',
    })
    return
  }
  ElMessageBox.confirm(
    '所有中奖记录都将被清空，确认要重置吗? 系统将会导出历史中奖记录，请注意查看文件列表',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // exportData();
      bus.emit('resetBtnClick')
      noBeginLottery.value = true;
      basicData.isEnterLottery = false
      handleHideCommonBtn();
      ElMessage({
        type: 'success',
        message: '重置成功',
      })
      if (e && e.currentTarget) {
        window.operationLogTable.add({
          id: nanoid(),
          date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
          type: 'control_btn',
          value: e.currentTarget.innerText
        })
      }
    })
}
// const toggleConfig = () => {
//   bus.emit('toggleConfig')
// }
const handleHideCommonBtn = () => {
  const userGroup = findCurrentLotteryGroup();
  if (userGroup) {
    const member = basicData.memberListData[userGroup.group_identity]
    if (!member || member.length <= 0) {
      isHideCommonBtn.value = true
    } else {
      isHideCommonBtn.value = false
    }
  } else {
    isHideCommonBtn.value = true
  }
}
let showBarTimer = null;
let debounceTimer = null
let isEnterBar = false
const isTipsBottomBar = ref(true);
const mousemoveEvent = (event) => {
  if (isTipsBottomBar.value) return
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;
    const bottomOffset = 30; // 底部操作栏高度
    // 如果鼠标位置在窗口底部一定范围内，则显示操作栏
    clearTimeout(showBarTimer);
    if (mouseY > windowHeight - bottomOffset) {
      // isHover = true 
      bottomBar.value.classList.add('active');
    } else {
      showBarTimer = setTimeout(() => {
        if (!isEnterBar) {
          bottomBar.value.classList.remove('active');
        }
      }, 300); 
    }
  }, 50)
}
const mouseleaveEvent = () => {
  if (isTipsBottomBar.value) return
  clearTimeout(showBarTimer);
  setTimeout(() => {
    if (!isEnterBar) {
      bottomBar.value.classList.remove('active');
    }
  }, 300)
}
const barMouseenter = () => {
  isEnterBar = true
}
const barMouseleave = () => {
  if (isTipsBottomBar.value) return
  isEnterBar = false
  clearTimeout(showBarTimer);
  showBarTimer = setTimeout(() => {
    if (!isEnterBar) {
      bottomBar.value.classList.remove('active');
    }
  }, 300);
}
let adjustBtnTimer = null;
// 调整抽奖动作按钮
const adjustLotteryActionBtn = () => {
  clearTimeout(adjustBtnTimer);
  adjustBtnTimer = setTimeout(() => {
    let bottomCardDom = document.querySelector("#card-0");
    if (basicData.isShowPrizeMark) {
      bottomCardDom = document.querySelector(".next-prize");
      if (bottomCardDom) {
        operationBtnStyle.value.left = bottomCardDom.getBoundingClientRect().x + bottomCardDom.clientWidth / 2 + 'px'
        return
      }
    }
    if (!bottomCardDom || !basicData.isEnterLottery) {
      operationBtnStyle.value.left = '60%';
    } else {
      operationBtnStyle.value.left = bottomCardDom.getBoundingClientRect().x + 'px'
    }
  }, 620)
}

// 键盘事件
let keyDownOpen = false
let keyDownTimer = null;
const keydownEvent = (event) => {
  if (['Enter', 'b', 'B', ' ', 'PageDown', 'PageUp'].indexOf(event.key) > -1) {
    // 阻止默认事件行为
    event && event.preventDefault && event.preventDefault();
    let overlayDoms = document.querySelectorAll('.el-overlay');
    // 如果有display不是none的话 就return
    if (overlayDoms && overlayDoms.length > 0) {
      for (let i = 0; i < overlayDoms.length; i++) {
        let itemDom = overlayDoms[i];
        if (itemDom && itemDom.style.display !== 'none') {
          console.warn('有弹窗显示，不处理')
          return
        }
      }
    }
    if (keyDownOpen) {
      clearTimeout(keyDownTimer)
      keyDownTimer = setTimeout(() => {
        if (keyDownOpen) keyDownOpen = false
      }, 1000);
      return
    }
    keyDownOpen = true
    keyDownTimer = setTimeout(() => {
      keyDownOpen = false
    }, 500);
    let enterDom = document.getElementById('enter')
    let showPrizeDom = document.getElementById('showPrize')
    let lotteryDom = document.getElementById('lottery')
    let showAllLucksDom = document.getElementById('showAllLucks')
    let luckyCloseBtnDom = document.getElementById('lucky-close-btn')
    if (basicData.isShowLuckyUser) {
      luckyCloseBtnDom.click();
    } else if (enterDom && noBeginLottery.value) {
      document.getElementById('enter').click();
    } else if (!noBeginLottery.value && isNextPrize.value && currentPrize.value) {
      showPrizeDom.click();
    } else if (!noBeginLottery.value && !isNextPrize.value) {
      lotteryDom.click();
    }else if (!currentPrize.value) {
      showAllLuckyUser('showAllLuckys', showAllLucksDom)
    }
  } 
  // 重新抽奖 / 或上一轮抽奖
  if (['r', 'R'].indexOf(event.key) > -1) {
    if (keyDownOpen) {
      clearTimeout(keyDownTimer)
      keyDownTimer = setTimeout(() => {
        if (keyDownOpen) keyDownOpen = false
      }, 1000);
      return
    }
    keyDownOpen = true
    keyDownTimer = setTimeout(() => {
      keyDownOpen = false
    }, 500);
    
    if (!noBeginLottery.value
          && !isResetCurrentPrize.value
          && basicData.currentLuckys.length
          && !isShowAllLuckys.value
          && !isLotting.value
          && !isFirstPrize.value) {
      document.getElementById('reLottery').click();
    }
  }
}

onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd);
  handleHideCommonBtn();
  bus.on('toInitContainerHandleData', handleHideCommonBtn);
  bus.on('groupListSetting', handleHideCommonBtn);
  bus.on('adjuctUsersDataTips', handleHideCommonBtn)

  bus.on('adjustLotteryActionBtn', adjustLotteryActionBtn);
  bus.on('showPrize', adjustLotteryActionBtn);
  // 监听鼠标移动事件
  document.addEventListener('mousemove', mousemoveEvent);
  document.addEventListener('mouseleave', mouseleaveEvent);
  nextTick(() => {
    bottomBar.value.addEventListener('mouseenter', barMouseenter)
    bottomBar.value.addEventListener('mouseleave', barMouseleave)
  })
  document.addEventListener('keydown', keydownEvent);
})
onBeforeUnmount(() => {
  bus.off('enterLotteryEnd', handleEnterLotteryEnd)
  document.removeEventListener('mousemove', mousemoveEvent);
  document.removeEventListener('mouseleave', mouseleaveEvent);
  document.removeEventListener('keydown', keydownEvent);
  bottomBar.value.removeEventListener('mouseenter', barMouseenter)
  bottomBar.value.removeEventListener('mouseleave', barMouseleave)
})
</script>

<style lang="scss">
// 提示底部bar
.tips-bottom {
  position: fixed;
  right: 10px;
  bottom: 70px;
  color: rgba(127, 255, 255, 0.75);
  display: flex;
}
// 底部控制bar
.bottom-bar {
  position: fixed;
  bottom: -80px; /* 隐藏操作栏 */
  left: 0;
  right: 0;
  height: 80px;
  background-color: rgba(0,0,0,0.9);
  transition: bottom 0.3s ease-out; /* 过渡动画 */
  z-index: 100;
  display: flex;
  // justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 7px 0;
  > div {
    display: flex;
    // justify-content: flex-end;
    align-items: center;
    // padding: 0 10px;
    border-right: 1px solid rgba(127, 255, 255, 0.75);

    flex-wrap: wrap;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    
    > .btn, .music {
      margin: 2px 4px;
    }

    &::-webkit-scrollbar{
      width: 5px;
    }
    &::-webkit-scrollbar-track{
      // background: rgb(239, 239, 239);
      border-radius:2px;
    }
    &::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    &::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
  }
  .setting {
    .lock-btn {

    }
  }
}

.bottom-bar.active {
  bottom: 0; /* 显示操作栏 */
}
.bottom-bar.to-long-show {
  bottom: 0;
}
.lottery-operation-btn {
  position: fixed;
  display: flex;
  bottom: 40px;
  left: 60%;
  transition: all .2s;
}
.screen-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
#menu {
  z-index: 401;
  position: fixed;
  top: 0;
  text-align: center;
}
#lottery {
  animation: breath 1.6s linear infinite;
  box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
  // margin-top: 20px;
}
// .begin-lottery, #showAllLucks {
//   position: fixed;
//   bottom: 20px;
//   display: flex;
//   flex-direction: column;
// }
#reLottery {
  // position: fixed;
  // bottom: 20px;
  // display: flex;
  // flex-direction: column;
  // margin-left: 50px;
  // left: 60%;
}
// #fullScreen {
//   position: fixed;
//   right: 30px;
//   top: 20vh;
//   right: 4vh;
//   z-index: 5;
// }
#configBtn {
  position: fixed;
  right: 30px;
  bottom: 20px;
  right: 4vh;
  z-index: 5;
  min-width: 90px;
  min-height: 47px;
}
.fixed-bar {
  position: fixed;
  bottom: 20px;
  right: 200px;
}

.btn {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0;
  padding: 1vh;
  margin: 0 0.6vh;
  // font-size: 1.2vh;
  font-size: 1.14vh;
  font-weight: bold;
  cursor: pointer;
  height: 50px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}

.btn:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

.btn:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}
</style>

<style lang="scss">
.base-modal-dialog.isMoveDialog {
  height: fit-content;
  box-shadow: 0px 2px 8px 0px rgba(51, 51, 51, 0.15);
  right: auto;
  bottom: auto;
  margin: 0 !important;
  .el-dialog__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    padding: 16px;
    cursor: move;
    margin: 0;
    .el-dialog__title {
      font-weight: 500;
      font-size: 16px;
      color: #303133;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .title-text {
      margin-right: auto;
      font-weight: 600;
      color: #000;
      display: flex;
      align-items: center;
    }
    .title-btn {
      color: #000;
      font-size: 14px;
      display: inline-flex;
      cursor: pointer;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0px 2px 4px 0px rgba(44,39,56,0.08), 0px 1px 2px 0px rgba(44,39,56,0.00); 
      background-color: #d7dbe6;
      border: 1px solid transparent;
      border-radius: 14px;
      padding: 4px;
      padding-right: 10px;
      .label {
        width: 20px;
        height: 20px;
        background: #2e3644;
        border-radius: 50%;
        position: relative;
        margin-right: 8px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        &.label-confirm {
          &::before {
            content: "";
            width: 8px;
            height: 8px;
            border: 2px solid #2FCBB1;
            border-radius: 50%;
          }
        }
        &.label-cancel {
          &::before {
            content: "✕";
            color: #ff6666;
            margin: 2px 0px 0px 1px;
          }
        }
      }

      &:hover {
        background-color: #c0c7d6;
      }
      &:active {
        background-color: #c0c7d6;
        border-color: #366FFF;
      }
      + .title-btn {
        margin-left: 8px;
      }
    }
  }
  .el-dialog__body {
    max-height: 80vh;
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: 8px;
    }
    &::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    &::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    &::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
  }
  .setting-content {
    background-color: #f2fafe;
    border-radius: 10px;
    padding: 20px;
  }
}
</style>