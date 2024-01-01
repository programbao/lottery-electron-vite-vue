<template>
  <div class="qd-optiongroup-question">
    <!--  分组  -->
    <transition-group
      v-if="groupList.length"
      class="group-container"
      tag="div"
      name="opacity-list"
      @before-enter="isEnterMode = true"
      @after-enter="isEnterMode = false"
    >
      <Group
        :ref="'group' + group.group_identity"
        :groupInfo="group"
        v-for="(group, index) of groupList"
        :showType="1"
        :length="groupList.length"
        :key="group.group_identity"
        :optionsMap="optionsMap"
        :class="{ dragging: isSelectMode, 'drag-over': group.isSelected, 'error-style': group.errorMsg }"
        @click.native="onGroupClick({ group, index })"
        @optionCancel="optionCancel"
        @groupCancel="groupCancel"
      ></Group>
    </transition-group>
    <div class="no-data-tips" v-else>
      {{ textMappingConfig.noPrizesAvailable.chineseText + ' ' + textMappingConfig.noPrizesAvailable.otherLanguagesText }}
    </div>

    <div class="relate-box" v-if="isSelectMode">
      <el-button type="primary" plain @click="confirmRelated">{{ textMappingConfig.confirmAssociation.chineseText + ' ' + textMappingConfig.confirmAssociation.otherLanguagesText }}</el-button>
      <el-button plain @click="cancelSelect">{{ textMappingConfig.cancel.chineseText + ' ' + textMappingConfig.cancel.otherLanguagesText }}</el-button>
    </div>
    <el-button class="upload-users-btn" @click="uploadUsers">{{ textMappingConfig.uploadInternalLuckyList.chineseText + ' ' + textMappingConfig.uploadInternalLuckyList.otherLanguagesText }}</el-button>
    <el-button class="add-users-btn" @click="addUsers" type="primary" plain>{{ textMappingConfig.add.chineseText + ' ' + textMappingConfig.add.otherLanguagesText }}</el-button>
    <!--  选项  -->
    <div class="option-container">
      <transition-group
        class="option-container-inner"
        tag="div"
        name="flip-list"
        v-if="optionList.length"
      >
        <Option
          v-for="(option, index) of optionList"
          :option="option"
          :key="index"
          :class="option.isSelected ? 'dragging-style' : ''"
          @click="optionClick(option)"
          @optionDel="optionDel"
        ></Option>
      </transition-group>
      <div class="no-data-tips" v-else>
        {{ textMappingConfig.noInternalPersons.chineseText + ' ' + textMappingConfig.noInternalPersons.otherLanguagesText }}
      </div>
    </div>

    <editDialog 
      @close="editDialogVisible = false"
      @confirm="editConfirm"
      :optionList="optionList"
      :editDialogVisible="editDialogVisible"
       />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { nanoid } from 'nanoid';
import { lotteryDataStore } from '../../../../store'
const basicData = lotteryDataStore();
const optionList = ref([])
const groupList = ref([])
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
// const userRelatedMap = {};
// const luckyUsers = basicData.luckyUsers;
let lotteryCount = 0;

import editDialog from './editDialog.vue'
const editDialogVisible = ref(false);


// 添加名单
const addUsers = () => {
  editDialogVisible.value = true
}
const editConfirm = (data) => {
  editDialogVisible.value = false
  data.forEach(user => {
    let addOption = {
      option_value: user.join(','),
      option_identity: user[0] + '',
      index: 0
    }
    optionList.value.push(addOption)
    addOption.index = optionList.value.length - 1 
  })
}

const handleOptionList = () => {
  // let arr = [];
  // basicData.prizes.forEach(item => {
  //   const option = optionList.value.find(option => option.option_identity === item.type) || {};
  //   arr.push(Object.assign(option, {
  //     option_value: item.name,
  //     option_identity: item.type,
  //     noCanSelected: !!luckyUsers[item.type],
  //   }))
  // })
  const luckyUsersMap = {}
  Object.keys(basicData.luckyUsers).forEach(key => {
    const value = basicData.luckyUsers[key]
    value.forEach(user => {
      luckyUsersMap[user[0]] = true
    })
  })
  optionList.value.forEach(item => {
    item.noCanSelected = !!luckyUsersMap[item.option_identity+''];
  })
  // optionList.value = arr
}
// 页面初始化
onMounted(() => {
  nextTick(() => {
    const secretPrizesGroupList = JSON.parse(JSON.stringify(basicData.secretPrizesGroupList || []));
    const groupListMap = {}
    secretPrizesGroupList.forEach(item => {
      groupListMap[item.group_identity] = item
    })
    const prizes = JSON.parse(JSON.stringify(basicData.prizes));
    lotteryCount = prizes.reduce((total, prize) => {
      return total + (prize.count || 0);
    }, 0);
    const arr = [];
    prizes.forEach(item => {
      let obj = {
        group_name: item.name,
        group_identity: item.type,
        options: [],
      }
      arr.push(Object.assign(obj, groupListMap[item.type] || {}));
    });
    groupList.value = arr;
    optionList.value = JSON.parse(JSON.stringify(basicData.secretUsers));
    handleOptionList();
    // 初始化处理关联关系
    groupList.value.forEach(group => {
      group.options.forEach(identity => {
        const option = optionList.value.find(item => item.option_identity === identity)
        if (option) {
          option.related_group = group.group_identity
        }
      })
    })
  })
})


const optionsMap = computed(() => {
  const map = {}
  optionList.value.forEach(item => {
    map[item.option_identity] = item
  })
  return map;
})
const optionClick = (option) => {
  if (option.related_group || option.noCanSelected) return
  option.isSelected = !option.isSelected
  const group = groupList.value.find(item => item.isSelected)
  if (group) {
    group.options = group.options.filter(identity => optionsMap.value[identity].related_group)
    group.options = group.options.concat(optionList.value.filter(item => item.isSelected).map(item => item.option_identity));
  }
}


const isSelectMode = computed(() => {
  return optionList.value.some(item => item.isSelected)
})
const onGroupClick = ({ group, index }) => {
  if (!group) return
  groupList.value.forEach(item => {
    if (item.group_identity !== group.group_identity) {
      item.isSelected = false
    }
    item.options = item.options.filter(identity => optionsMap.value[identity].related_group)
  })
  group.isSelected = !group.isSelected
  if (group.isSelected) {
    group.options = group.options.concat(optionList.value.filter(item => item.isSelected).map(item => item.option_identity));
  }
}
const cancelSelect = () => {
  optionList.value.forEach(item => {
    item.isSelected = false
  })
  groupList.value.forEach(item => {
    item.isSelected = false
    item.options = item.options.filter(identity => optionsMap.value[identity].related_group)
  })
}
const confirmRelated = () => {
  const group = groupList.value.find(item => item.isSelected)
  if (group) {
    optionList.value.forEach(item => {
      if (item.isSelected) {
        item.related_group = group.group_identity
        item.isSelected = false
      }
    })
    group.isSelected = false
  } else {
    ElMessage({
      message: textMappingConfig.value.selectGroupAndOption.chineseText + ' ' + textMappingConfig.value.selectGroupAndOption.otherLanguagesText,
      type: 'warning',
    })
  }
}
// 取消选择/关联
const optionCancel = (emitObj) => {
  const { option, groupIdentity } = emitObj
  const handleOption = optionList.value.find(item => item.option_identity === option.option_identity)
  handleOption.related_group = ""
  handleOption.isSelected = false

  const group = groupList.value.find(item => item.group_identity === groupIdentity)
  if (group) {
    group.options = group.options.filter(identity => identity !== option.option_identity)
  }
}

// 删除名单
const optionDel = (handleOption) => {
  optionList.value = optionList.value.filter(item => item.option_identity !== handleOption.option_identity)
  if (handleOption.related_group) {
    const group = groupList.value.find(item => item.group_identity === handleOption.related_group)
    if (group) {
      group.options = group.options.filter(identity => identity !== option.option_identity)
    }
  }
}
// 取消人员名单
const groupCancel = (emitObj) => {
  const groupIndex = groupList.value.findIndex(item => item.group_identity === emitObj.group_identity)
  if (groupIndex > -1) {
    for (let i = 0; i < emitObj.options.length; i++) {
      const option_identity = emitObj.options[i];
      const option = optionsMap.value[option_identity]
      if (option.noCanSelected) {
        ElMessage({
          type: 'error',
          message: `${option.option_value} 已经产生数中奖名单，该人员名单不能删除`
        })
        return
      }
    }
    // 取消选项关联状态
    const handleGroup = groupList.value[groupIndex]
    handleGroup.options.forEach(identity => {
      optionsMap.value[identity].related_group = ""
    })
    groupList.value.splice(groupIndex, 1)
  }
}
// 上传人员名单
const uploadUsers = async () => {
  if (basicData.prizes <= 0) {
    ElMessage({
      type: 'error',
      message: textMappingConfig.value.noPrizesAvailable.chineseText + ' ' + textMappingConfig.value.noPrizesAvailable.otherLanguagesText
    })
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const group_identity = `secret_users_${nanoid()}`;
    const { fileUrl, savePath, fileName, users } = await myApi.importFile('xlsx_write', JSON.stringify(["xlsx", "xls"]), group_identity, lotteryCount);
    console.log(users, 'usersusersusers')
    if (!Array.isArray(users)) {
      if (users && users.type && users.type === 'error') {
        ElMessage({
          type: 'error',
          message: users.msg
        })
        loading.close()
        return
      }
    }
    if (!users) {
      ElMessage({
          type: 'error',
          message: '导入失败'
        })
      loading.close()
      return
    }
    // const isHasGroup = optionList.value.some(item => item.group_name === fileName);
    // if (isHasGroup) {
    //   ElMessage({
    //     type: 'warning',
    //     message: textMappingConfig.value.groupNameExists.chineseText + ' ' + textMappingConfig.value.groupNameExists.otherLanguagesText
    //   })
    //   return
    // }
    const handleIdSet = new Set();
    const handleArr = JSON.parse(JSON.stringify(users)).concat(JSON.parse(JSON.stringify(optionList.value)));
    for (let i = 0; i < handleArr.length; i++) {
      const [id] = handleArr[i];
      // 验证工号是否唯一和不能为空
      if (!id || handleIdSet.has(id+'') || idSet.has(id+'')) {
        ElMessage.error(`工号 ${id} 重复或为空`);
        return false;
      }
      handleIdSet.add(id+'');
    }
    if (users) {
      users.forEach(user => {
        let addOption = {
          option_value: user.join(','),
          option_identity: user[0] + '',
          index: 0
        }
        optionList.value.push(addOption)
        addOption.index = optionList.value.length - 1 
      })
    }
    loading.close()
    // userRelatedMap[group_identity] = users
  } catch (error) {
    ElMessage({
      type: 'error',
      message: textMappingConfig.value.uploadFailed.chineseText + ' ' + textMappingConfig.value.uploadFailed.otherLanguagesText,
    })
    loading.close()
  }
}
const getGroupList = () => {
  const arr = JSON.parse(JSON.stringify(groupList.value))
  arr.forEach(item => {
    item.options = item.options.filter(identity => optionsMap.value[identity].related_group);
  })
  return arr
}
// 暴露属性
defineExpose({
  getGroupList,
  optionList: optionList
})
</script>

<style lang="scss" scoped>
.no-data-tips {
  margin-bottom: 20px;
  color: orange;
  font-weight: 700;
}
.upload-users-btn {
  margin: 10px 16px;
}
.add-users-btn {
  margin: 0px 16px 15px;
}
.add-users-btn.el-button.is-plain {
  margin-left: 16px;
}
.relate-box {
  margin: 10px 0 10px;
}
.flip-list-move {
  transition: transform 0.3s ease;
}

.flip-list-leave-active {
  position: absolute;
}

.opacity-list-leave-to {
  opacity: 0;
  transform: translateX(-100vw);
}

.opacity-list-leave-active {
  position: absolute;
  transition: all 0.3s linear;
}

.qd-optiongroup-question {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .group-container {
    padding: 0 16px 4px;
    display: flex;
    flex-wrap: wrap;
  }

  .option-container {
    padding: 20px 16px;
    flex: 1;
    overflow: auto;
    background: #fff;
    border-radius: 12px 12px 0 0;
    .option-container-inner {
      display: flex;
      flex-wrap: wrap;
    }
  }
}

.error-style {
  ::v-deep(.common) {
    border-color: red;
  }
}
.dragging {
  ::v-deep(.qd-optiongroup-item) {
    border: 1px solid #409eff;
    .close-btn {
      color: #074d95;
    }
  }
  &.error-style {
    ::v-deep(.qd-optiongroup-item) {
      border: 1px solid red;
    
    }
  }
}
.dragging.isSelected {
  ::v-deep(.qd-optiongroup-item) {
    // border: 1px solid orange;
  } 
}

.drag-over {
  transform: scale(1.05);
  ::v-deep(.qd-optiongroup-item) {
    border: 2px solid #409eff;
    box-shadow: 0 4px 8px 0 rgba(50, 152, 255, 0.5);
    .close-btn {
      color: #074d95;
      font-weight: 700;
    }
  }
  &.error-style {
    ::v-deep(.qd-optiongroup-item) {
      border: 2px solid red;
      box-shadow: 0 4px 8px 0 red;
      .close-btn {
        color: red;
      }
    }
  }
}

.column4.drag-over {
  ::v-deep(.qd-optiongroup-item) {
    .information {
      display: flex;
    }
  }
}

.option-hidden {
  visibility: hidden;
}

.no-transition {
  transition: unset !important;
}
</style>
