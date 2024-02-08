<template>
  <el-dialog
    class="base-modal-dialog isMoveDialog"
    :class="dialogKeyStr"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="true"
    :show-close="false"
    :style="dialogStyle"
    v-model="dialogTableVisible"
    width="70%">
    <template #header>
      <slot name="title"><span class="title-text">{{ textMappingConfig.prizeConfiguration.chineseText + ' ' + textMappingConfig.prizeConfiguration.otherLanguagesText }}</span></slot>
      <div class="title-btn confirm-btn" type="confirm" @click="confirm">
        <div class="label label-confirm"></div>
        {{ textMappingConfig.confirm.chineseText + ' ' + textMappingConfig.confirm.otherLanguagesText }}
      </div>
      <div class="title-btn cancel-btn" type="cancel"  @click="dialogTableVisible = false" >
        <div class="label label-cancel"></div>
        {{ textMappingConfig.cancel.chineseText + ' ' + textMappingConfig.cancel.otherLanguagesText }}
      </div>
    </template>
    <div class="setting-content">
      <prizeSetting 
        :key="dialogTableVisible"
        @cutPrize="cutPrize"
        @addPrize="addPrize"
        ref="prizeSettingRef" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '../../../libs/bus'
import { initMoveEvent } from '../moveEvent'
import { lotteryDataStore } from '../../../store'
import prizeSetting from './index.vue'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid';
const basicData = lotteryDataStore();
const dialogTableVisible = ref(false);
const dialogKeyStr = 'prizeSetting';
const dialogStyle = computed(() => {
  return basicData['dialogStyle_' + dialogKeyStr] || basicData.dialogStyle
});
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
let cutNum = 0;
let addNum = 0;
const toggleConfig = () => {
  let isOpen = !dialogTableVisible.value
  dialogTableVisible.value = isOpen
  if (!isFirstVisible && isOpen) {
    nextTick(() => {
      isFirstVisible = true;
      initMoveEvent(basicData, dialogKeyStr)
    })
  }
}
let isFirstVisible = false;
bus.on('toggleConfig', toggleConfig)
// 删除奖项
const cutPrize = () => {
  cutNum++
}
const addPrize = () => {
  addNum++
}
// 定位抽奖组
const findCurrentLotteryGroup = () => {
  // 找到要展示的member
  const currentPrize = basicData.currentPrize;
  if (!basicData.currentPrize) return
  const userGroup = basicData.groupList.find(group => group.options.includes(currentPrize.type));
  console.log(userGroup)
  if (!userGroup) {
    return;
  }
  return userGroup;
}

const prizeSettingRef = ref();
// 处理奖项相关设置
const handlePrizesSetting = async () => {
  let isSuccess = {
      type: 'success',
      status: 1
    }
  const prizesData = JSON.parse(JSON.stringify(prizeSettingRef.value.prizes));
  // 删除不必存的字段
  const excludeFields = ['index', 'isHasLucky'];
  prizesData.forEach((prize) => {
    excludeFields.forEach((key) => {
      delete prize[key];
    })
  })
  const prizesDataStr = JSON.stringify(prizesData);
  if (prizesDataStr === JSON.stringify(basicData.prizes)) {
    // dialogTableVisible.value = false;
    return {
      type: 'warning',
      status: 2
    }
  }
  let isPass = await myApi.savePrizesConfig(prizesDataStr, 'prizes');
  let handleAddGroup = prizeSettingRef.value.handleAddGroup
  if (addNum && handleAddGroup) {
    let findGroup = basicData.groupList.find(group => group.group_identity === handleAddGroup.group_identity);
    if (findGroup) {
      findGroup.options = handleAddGroup.options;
      isPass =  await myApi.savePrizesConfig(JSON.stringify(basicData.groupList), 'groupList');
    }
  } else if (addNum && !handleAddGroup) {
    setTimeout(() => {
      bus.emit('groupListSetting')
    })
  }
  if (isPass) {
    const currentPrizeIndex =  basicData.currentPrizeIndex;
    const modifyCurrentIndex = basicData.currentPrizeIndex - cutNum + addNum;
    const modifyLastTimeIndex = basicData.lastTimePrizeIndex - cutNum + addNum;
    
    // const beforeModifyPrize = basicData.prizes[basicData.currentPrizeIndex];
    // const byIndexModifyPrize = prizesData[modifyLastTimeIndex];
    // const byIndexCurrentPrize = basicData.prizes[basicData.lastTimePrizeIndex];
    // // const originLen = basicData.prizes.length;
    const originPrizes = basicData.prizes;
    basicData.prizes = prizesData;
    // // dialogTableVisible.value = false;
    // // 更正当前的奖项索引
    // basicData.currentPrizeIndex = modifyCurrentIndex;
    // // 更正上一轮的奖项索引
    // basicData.lastTimePrizeIndex = modifyLastTimeIndex;

    // // 根据状态回显抽完奖的 奖项
    // const byIndexCurrentType = byIndexCurrentPrize.type;
    // const byIndexModifyType = byIndexModifyPrize.type
    // debugger
    // if (
    //     basicData.luckyUsers[byIndexCurrentType] &&
    //     basicData.luckyUsers[byIndexCurrentType].length >= byIndexCurrentPrize.count
    //   ) {
    //     basicData.currentPrizeIndex = modifyCurrentIndex + 1;
    //     // 纠正是否暂时下一个奖项状态 和 当前奖项是否继续
    //     basicData.isNextPrize = false;
    //     basicData.isContinueLottery = true;
    //     // bus.emit('adjustCurrentPrize', {
    //     //   beforeModifyPrize: beforeModifyPrize,
    //     //   byIndexModifyPrize: byIndexModifyPrize
    //     // })
    // }
    // if (byIndexModifyType ===  byIndexCurrentType && 
    //     byIndexModifyPrize.count > byIndexCurrentPrize.count) {
    //     bus.emit('adjustCurrentPrize', {
    //       beforeModifyPrize: beforeModifyPrize,
    //       byIndexModifyPrize: byIndexModifyPrize
    //     })
    // }
    // if (addNum || cutNum) {
    //       // 更正当前的奖项索引
    //   basicData.currentPrizeIndex = modifyCurrentIndex < 0 ? 0 : modifyCurrentIndex;
    //   // 更正上一轮的奖项索引
    //   basicData.lastTimePrizeIndex = (modifyLastTimeIndex < 0 || (!originPrizes.length && modifyLastTimeIndex > 0)) ? 0 : modifyLastTimeIndex;
    // }
    // if (currentPrizeIndex < 0) {
    //   basicData.currentPrizeIndex = 0;
    // }
    // if (currentPrizeIndex < 0 && addNum && originPrizes.length) {
    //   basicData.lastTimePrizeIndex = 1
    // }
    // 纠正奖项index
    let findCorrectIndex = 0;
    let prizes = basicData.prizes
    for (let i = 0; i < prizes.length; i++) {
      const item = prizes[i];
      const count = item.count - (!basicData.luckyUsers[item.type] ? 0 : basicData.luckyUsers[item.type].length)
      if (count <= 0) {
        findCorrectIndex = i - 1;
        break
      } else {
        findCorrectIndex = i
      }
    }
    if (findCorrectIndex < 0 || findCorrectIndex) {
      let prizesNeedCorrectIndex = prizes.length - 1;
      while (prizesNeedCorrectIndex - findCorrectIndex && findCorrectIndex >= 0) {
        const item = prizes[prizesNeedCorrectIndex];
        const count = item.count - (!basicData.luckyUsers[item.type] ? 0 : basicData.luckyUsers[item.type].length)
        if (count <= 0) {
          prizesNeedCorrectIndex--
        } else {
          findCorrectIndex = prizesNeedCorrectIndex
          break;
        }
      }
    }
    basicData.currentPrizeIndex = findCorrectIndex;
    basicData.lastTimePrizeIndex = prizes[findCorrectIndex + 1] ? findCorrectIndex + 1 : findCorrectIndex
    // 纠正当前的奖项
    basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
    basicData.eachCount = basicData.prizes.map(prize => prize.eachCount);
    // debugger
    if (currentPrizeIndex < 0) {
      basicData.currentLotteryGroup = findCurrentLotteryGroup();
      if (!basicData.isEnterLottery) {
        bus.emit('toInitContainerHandleData')
      }
    }
    //   const handlePrize = basicData.currentPrize ? basicData.currentPrize : basicData.prizes[basicData.lastTimePrizeIndex];
//   return basicData.handlePrize.count - (!basicData.luckyUsers[handlePrize.type] ? 0 : basicData.luckyUsers[handlePrize.type].length);
    if (basicData.currentPrizeIndex === 0 && cutNum) {
      let currentPrizeSurplusCount = 0;
      if (basicData.currentPrize) {
        currentPrizeSurplusCount = basicData.currentPrize.count - (!basicData.luckyUsers[basicData.currentPrize.type] ? 0 : basicData.luckyUsers[basicData.currentPrize.type].length)
      }
      if (currentPrizeSurplusCount <= 0) {
        basicData.currentPrize = undefined;
        basicData.currentPrizeIndex = -1;
      }
    }
    // if (addNum) {
    bus.emit('adjustCurrentPrize', { isReGet: true })
    // }
    // 重置添加和删除的记录数量
    cutNum = 0;
    addNum = 0;
    isSuccess = {
      type: 'success',
      status: 1
    }
    // 显示奖项
    basicData.isEnterBgWall = false
  } else {
    isSuccess = {
      type: 'error',
      status: 0
    }
  } 
  return isSuccess
}

const handleVerifyConfig = async (handleStr, verifyData) => {
  let isPassSetting = {
      type: 'success',
      status: 1
    };
  const verifyConfigStr =JSON.stringify(verifyData);
  const prevVerifyConfigStr = JSON.stringify(basicData[handleStr]);
  if (prevVerifyConfigStr === verifyConfigStr) {
    return {
      type: 'warning',
      status: 2
    };
  }
  const isPass = await myApi.savePrizesConfig(verifyConfigStr, handleStr);
  if (isPass) {
    basicData[handleStr] = JSON.parse(verifyConfigStr);
  } else {
    isPassSetting = {
      type: 'error',
      status: 0
    };
  }
  bus.emit(handleStr + 'Setting')
  return isPassSetting; 
}

const checkAllPassStatus = (...statuses) => {
  // 检查所有状态数组
  if (statuses.some(status => status === 0)) {
    return 0; // 存在状态为0，设置失败
  } else if (statuses.some(status => status === 1)) {
    return 1; // 存在状态为1，设置成功
  } else if (statuses.every(status => status === 2)) {
    return 2; // 所有状态为2，未修改过配置
  }
};

const confirm = async () => {
  setTimeout(() => {
    window.operationLogTable.add({
      id: nanoid(),
      date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
      type: 'setting',
      value: textMappingConfig.value.prizeConfiguration.chineseText + ' ' + textMappingConfig.value.prizeConfiguration.otherLanguagesText
    })
  })
  const prizeSettingPass = await handlePrizesSetting();
  const prizesBarStylePass = await handleVerifyConfig('prizesBarStyle', prizeSettingRef.value['prizesBarStyle']);

   // 检查所有状态
  const status = checkAllPassStatus(
    prizeSettingPass.status,
    prizesBarStylePass.status
  );
  if (status === 1) {
    ElMessage({
      message: textMappingConfig.value.settingSuccess.chineseText + ' ' + textMappingConfig.value.settingSuccess.otherLanguagesText,
      type: 'success',
    });
    // dialogTableVisible.value = false;
    // ...其他处理
  } else if (status === 0) {
    ElMessage.error(textMappingConfig.value.settingFailure.chineseText + ' ' + textMappingConfig.value.settingFailure.otherLanguagesText);
  } else if (status === 2) {
    ElMessage.warning(textMappingConfig.value.noConfigurationChanges.chineseText + ' ' + textMappingConfig.value.noConfigurationChanges.otherLanguagesText);
  }
  dialogTableVisible.value = false;
}
// 暴露属性
defineExpose({
  toggleConfig
})
</script>