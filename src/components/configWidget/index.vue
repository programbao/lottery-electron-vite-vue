<template>
  <el-dialog
    class="base-modal-dialog isMoveDialog pointDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="true"
    :show-close="false"
    :style="dialogStyle"
    v-model="dialogTableVisible"
    width="70%"
    title="系统配置">
    <template #header>
      <slot name="title"><span class="title-text">系统配置</span></slot>
      <div class="title-btn confirm-btn" type="confirm" @click="confirm">
        <div class="label label-confirm"></div>
        确认
      </div>
      <div class="title-btn cancel-btn" type="cancel"  @click="dialogTableVisible = false" >
        <div class="label label-cancel"></div>
        取消
      </div>
    </template>
    <div class="config-setting-list">
      <div class="item-setting">
        <div class="item-setting">
          <div class="setting-title">
            <div class="left">名单设置</div>
          </div>
          <div class="setting-content">
            <usersSetting 
              :key="dialogTableVisible"
              ref="usersSettingRef" />
          </div>
        </div>
        <div class="setting-title">
          <div class="left">奖项设置</div>
        </div>
        <div class="setting-content">
          <prizeSetting 
            :key="dialogTableVisible"
            @cutPrize="cutPrize"
            @addPrize="addPrize"
            ref="prizeSettingRef" />
        </div>
      </div>
      <div class="item-setting">
        <div class="setting-title">
          <div class="left">卡片设置</div>
        </div>
        <div class="setting-content">
          <cardSetting 
            ref="cardSettingRef"
            :key="dialogTableVisible" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '../../libs/bus'
import { initMoveEvent } from './moveEvent'
import { lotteryDataStore } from '../../store'
import prizeSetting from './prizeSetting/index.vue'
import cardSetting from './cardSetting/index.vue'
import usersSetting from './usersSetting/draggableGroup/index.vue'
const basicData = lotteryDataStore();
const dialogTableVisible = ref(false);
const dialogStyle = computed(() => {
  return basicData.dialogStyle
});
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
let cutNum = 0;
let addNum = 0;
const toggleConfig = () => {
  let isOpen = !dialogTableVisible.value
  dialogTableVisible.value = isOpen
  if (isOpen) {
    
  }
  if (!isFirstVisible && isOpen) {
    nextTick(() => {
      isFirstVisible = true;
      initMoveEvent(basicData)
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
// const configList = [
//   "奖项设置", // 替换 更新 上传奖项图片相关设置
//   "卡片排列"
// ]
const prizeSettingRef = ref();
const cardSettingRef = ref();
const usersSettingRef = ref();
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
  const isPass = await myApi.savePrizesConfig(prizesDataStr, 'prizes');
  if (isPass) {
    const modifyCurrentIndex = basicData.currentPrizeIndex - cutNum + addNum;
    const modifyLastTimeIndex = basicData.lastTimePrizeIndex - cutNum + addNum;
    const beforeModifyPrize = basicData.prizes[basicData.currentPrizeIndex];
    const byIndexModifyPrize = prizesData[modifyLastTimeIndex];
    const byIndexCurrentPrize = basicData.prizes[basicData.lastTimePrizeIndex];
    // const originLen = basicData.prizes.length;
    basicData.prizes = prizesData;
    // dialogTableVisible.value = false;
    // 更正当前的奖项索引
    basicData.currentPrizeIndex = modifyCurrentIndex;
    // 更正上一轮的奖项索引
    basicData.lastTimePrizeIndex = modifyLastTimeIndex;

    // 根据状态回显抽完奖的 奖项
    const byIndexCurrentType = byIndexCurrentPrize.type;
    const byIndexModifyType = byIndexModifyPrize.type
    if (
      byIndexModifyType ===  byIndexCurrentType && 
        byIndexModifyPrize.count > byIndexCurrentPrize.count &&
        basicData.luckyUsers[byIndexCurrentType] &&
        basicData.luckyUsers[byIndexCurrentType].length >= byIndexCurrentPrize.count
      ) {
        basicData.currentPrizeIndex = modifyCurrentIndex + 1;
        // 纠正是否暂时下一个奖项状态 和 当前奖项是否继续
        basicData.isNextPrize = false;
        basicData.isContinueLottery = true;
        bus.emit('adjustCurrentPrize', {
          beforeModifyPrize: beforeModifyPrize,
          byIndexModifyPrize: byIndexModifyPrize
        })
    }
    // 纠正当前的奖项
    basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
    basicData.eachCount = basicData.prizes.map(prize => prize.eachCount);

    if (addNum) {
      bus.emit('adjustCurrentPrize', { isReGet: true })
    }
    // 重置添加和删除的记录数量
    cutNum = 0;
    addNum = 0;
    isSuccess = {
      type: 'success',
      status: 1
    }
  } else {
    isSuccess = {
      type: 'error',
      status: 0
    }
  } 
  return isSuccess
}
// 处理卡片排列设置
const handleBeforeLotteryLayout = async () => {
  let isPassSetting = {
    type: 'success',
    status: 1
  };
  const cardDataStr =JSON.stringify(cardSettingRef.value.beforeLotteryLayout);
  const beforeLotteryLayoutStr = JSON.stringify(basicData.beforeLotteryLayout);
  if (beforeLotteryLayoutStr === cardDataStr) {
    return {
      type: 'waring',
      status: 2
    }
  }
  const isPass = await myApi.savePrizesConfig(cardDataStr, 'beforeLotteryLayout');
  if (isPass) {
    basicData.beforeLotteryLayout = JSON.parse(cardDataStr);
  } else {
    isPassSetting = false;
  }
  bus.emit('handleBeforeLotteryLayoutSetting')
  return isPassSetting;
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

const findCurrentLotteryGroup = () => {
  // 找到要展示的member
  const currentPrize = basicData.currentPrize;
  const userGroup = basicData.groupList.find(group => group.options.includes(currentPrize.type));
  if (!userGroup) {
    return;
  }
  return userGroup;
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
  const prizeSettingPass = await handlePrizesSetting();
  const beforeLotteryLayoutPass = await handleBeforeLotteryLayout();
  const cardConfigStylePass = await handleVerifyConfig('cardConfigStyle', cardSettingRef.value['cardConfigStyle']);
  const luckyCardConfigStylePass = await handleVerifyConfig('luckyCardConfigStyle', cardSettingRef.value['luckyCardConfigStyle']);
  const luckysRowColObjPass = await handleVerifyConfig('luckysRowColObj', cardSettingRef.value['luckysRowColObj']);
  // 删除不必存的字段
  const groupListData = JSON.parse(JSON.stringify(usersSettingRef.value['getGroupList']()));
  const excludeFields = ['index', 'isSelected'];
  groupListData.forEach((group) => {
    excludeFields.forEach((key) => {
      delete group[key];
    })
  })
  const usersSettingPass = await handleVerifyConfig('groupList', groupListData);
   // 检查所有状态
  const status = checkAllPassStatus(
    prizeSettingPass.status,
    beforeLotteryLayoutPass.status,
    cardConfigStylePass.status,
    luckyCardConfigStylePass.status,
    luckysRowColObjPass.status,
    usersSettingPass.status
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
  // if (
  //   isPrizeSettingPass && 
  //   isBeforeLotteryLayoutPass && 
  //   isCardConfigStylePass && 
  //   isLuckyCardConfigStylePass && 
  //   isLuckysRowColObjPass &&
  //   isUsersSettingPass
  // ) {
  //   ElMessage({
  //     message: textMappingConfig.value.settingSuccess.chineseText + ' ' + textMappingConfig.value.settingSuccess.otherLanguagesText,
  //     type: 'success',
  //   });
  //   dialogTableVisible.value = false;
  //   // 设置关联名单
  //   if (isUsersSettingPass) {
  //     Object.assign(basicData.memberListData, usersSettingRef.value.userRelatedMap)
  //     const userGroup = findCurrentLotteryGroup();
  //     if (userGroup) {
  //       basicData.currentLotteryGroup = userGroup;
  //     }
  //   }
  // } else {
  //   ElMessage.error(textMappingConfig.value.settingFailure.chineseText + ' ' + textMappingConfig.value.settingFailure.otherLanguagesText)
  // }
}

</script>
<style lang="scss">
.base-modal-dialog.isMoveDialog {
  height: fit-content;
  box-shadow: 0px 2px 8px 0px rgba(51, 51, 51, 0.15);
  // top: 15vh;
  // left: 20%;
  right: auto;
  bottom: auto;
  margin: 0 !important;
  // &.el-dialog {
  //   margin: auto;
  //   min-width: 100%;
  //   margin: 0 !important;
  // }
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
  }
  .el-dialog__body {
    padding-top: 0px;
    height: 80vh;
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
}
.item-setting {
  .setting-title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 10px;
    font-weight: 700;
    margin-top: 20px;
   .right {
      cursor: pointer;
      color: #409eff;
      font-size: 14px;
    }
  }
  .setting-content {
    background-color: #f2fafe;
    border-radius: 10px;
    padding: 20px;
  }
}
.el-dialog__header {
  .title-text {
    margin-right: auto;
    font-weight: 600;
    color: #000;
  }
  .title-btn {
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
</style>