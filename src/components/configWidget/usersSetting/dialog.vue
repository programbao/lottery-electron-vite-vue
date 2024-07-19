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
      <slot name="title"><span class="title-text">{{ textMappingConfig.userSettings.chineseText + ' ' + textMappingConfig.userSettings.otherLanguagesText }}</span></slot>
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
      <usersSetting 
        :key="dialogTableVisible"
        ref="usersSettingRef" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '../../../libs/bus'
import { initMoveEvent } from '../moveEvent'
import { lotteryDataStore } from '../../../store'
import usersSetting from './draggableGroup/index.vue'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid';
const basicData = lotteryDataStore();
const dialogTableVisible = ref(false);
const dialogKeyStr = 'usersSetting';
const dialogStyle = computed(() => {
  return basicData['dialogStyle_' + dialogKeyStr] || basicData.dialogStyle
});
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
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
const usersSettingRef = ref();
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
    let isEmptyGroupList = !basicData.groupList.length
    basicData[handleStr] = JSON.parse(verifyConfigStr);
    // 更新名单
    Object.assign(basicData.memberListData, usersSettingRef.value.userRelatedMap)
    if (isEmptyGroupList) {
      bus.emit('toInitContainerHandleData')
    }
  } else {
    isPassSetting = {
      type: 'error',
      status: 0
    };
  }
  // 取消抽奖进行中 状态
  basicData.isLotting = false
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
  window.operationLogTable.add({
    id: nanoid(),
    date: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
    type: 'setting',
    value: textMappingConfig.value.userSettings.chineseText + ' ' + textMappingConfig.value.userSettings.otherLanguagesText
  })
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
    usersSettingPass.status
  );

  if (status === 1) {
    ElMessage({
      message: textMappingConfig.value.settingSuccess.chineseText + ' ' + textMappingConfig.value.settingSuccess.otherLanguagesText,
      type: 'success',
    });
  // 设置关联名单
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
