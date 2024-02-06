<template>
  <div class="qd-optiongroup-question">
    <el-button
      class="check-users-btn"
      @click="checkUserTemplateFormat"
      type="primary"
      plain
      >{{
        textMappingConfig.viewUploadTemplateFormat.chineseText +
        ' ' +
        textMappingConfig.viewUploadTemplateFormat.otherLanguagesText
      }}</el-button
    >
    <el-button
      class="upload-users-btn"
      @click="uploadUsers"
      >{{
        textMappingConfig.uploadPersonList.chineseText +
        ' ' +
        textMappingConfig.uploadPersonList.otherLanguagesText
      }}</el-button
    >
    <!-- <div class="include-and-exclude">
      <el-button class="add-users-btn" @click="includeUsers" type="primary" plain>{{ textMappingConfig.includeTextUsers.chineseText + ' ' + textMappingConfig.includeTextUsers.otherLanguagesText }}</el-button>
      <el-button class="add-users-btn" @click="excludeUsers" type="primary" plain>{{ textMappingConfig.excludeTextUsers.chineseText + ' ' + textMappingConfig.excludeTextUsers.otherLanguagesText }}</el-button>
    </div> -->
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
        :class="{
          dragging: isSelectMode,
          'drag-over': group.isSelected,
          'error-style': group.errorMsg
        }"
        @click.native="onGroupClick({ group, index })"
        @optionCancel="optionCancel"
        @groupCancel="groupCancel"
        @editGroupBtn="editGroupBtn"
      ></Group>
    </transition-group>
    <div
      class="no-data-tips"
      v-else
    >
      {{
        textMappingConfig.uploadPersonList.chineseText +
        ' ' +
        textMappingConfig.uploadPersonList.otherLanguagesText
      }}
    </div>
    <div
      class="relate-box"
      v-if="isSelectMode"
    >
      <el-button
        type="primary"
        plain
        @click="confirmRelated"
        >{{
          textMappingConfig.confirmAssociation.chineseText +
          ' ' +
          textMappingConfig.confirmAssociation.otherLanguagesText
        }}</el-button
      >
      <el-button
        plain
        @click="cancelSelect"
        >{{
          textMappingConfig.cancel.chineseText +
          ' ' +
          textMappingConfig.cancel.otherLanguagesText
        }}</el-button
      >
    </div>
    <!--  选项  -->
    <div class="option-container">
      <transition-group
        class="option-container-inner"
        tag="div"
        name="flip-list"
      >
        <Option
          v-for="(option, index) of optionList"
          :option="option"
          :key="index"
          :class="option.isSelected ? 'dragging-style' : ''"
          @click="optionClick(option)"
        ></Option>
      </transition-group>
    </div>

    <!-- <editDialog 
      @close="editDialogVisible = false"
      @confirm="editConfirm"
      :optionList="optionList"
      :editDialogVisible="editDialogVisible"
       /> -->
    <usersTableDialog
      :usersTableData="usersTableData"
      @close="usersTableDialogVisible = false"
      @confirm="usersTableConfirm"
      :usersTableDialogVisible="usersTableDialogVisible"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { nanoid } from 'nanoid'
import { lotteryDataStore } from '../../../../store'
// import editDialog from './editDialog.vue'
import usersTableDialog from './usersTableDialog.vue'
const basicData = lotteryDataStore()
const optionList = ref([])
const groupList = ref([])
const userRelatedMap = {}
const luckyUsers = basicData.luckyUsers
const usersTableDialogVisible = ref(false)
const usersTableData = ref([])
let currentEidtGroup = null
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
watch(
  () => basicData.prizes,
  () => {
    handleOptionList()
  }
)
const handleOptionList = () => {
  let arr = []
  basicData.prizes.forEach((item) => {
    const option =
      optionList.value.find((option) => option.option_identity === item.type) ||
      {}
    arr.push(
      Object.assign(option, {
        option_value: item.name,
        option_identity: item.type,
        noCanSelected: !!luckyUsers[item.type]
      })
    )
  })
  optionList.value = arr
}
// 页面初始化
onMounted(() => {
  nextTick(() => {
    groupList.value = JSON.parse(JSON.stringify(basicData.groupList))
    handleOptionList()
    // 初始化处理关联关系
    groupList.value.forEach((group) => {
      // 初始化人员映射
      userRelatedMap[group.group_identity] = basicData.memberListData[group.group_identity] || []
      group.options.forEach((identity) => {
        const option = optionList.value.find(
          (item) => item.option_identity === identity
        )
        if (option) {
          option.related_group = group.group_identity
        }
      })
    })
  })
})
// const editDialogVisible = ref(false);
// const editConfirm = (data) => {
//   editDialogVisible.value = false
//   // data.forEach(user => {
//   //   let addOption = {
//   //     option_value: user.join(','),
//   //     option_identity: user[0] + '',
//   //     index: 0
//   //   }
//   //   optionList.value.push(addOption)
//   //   addOption.index = optionList.value.length - 1
//   // })
// }
// // 临时添加名单
// const includeUsers = () => {
//   editDialogVisible.value = true
// }
// const excludeUsers = () => {

// }
// 排除人员名单
const optionsMap = computed(() => {
  const map = {}
  optionList.value.forEach((item) => {
    map[item.option_identity] = item
  })
  return map
})
const optionClick = (option) => {
  if (option.related_group || option.noCanSelected) return
  option.isSelected = !option.isSelected
  const group = groupList.value.find((item) => item.isSelected)
  if (group) {
    group.options = group.options.filter(
      (identity) => optionsMap.value[identity].related_group
    )
    group.options = group.options.concat(
      optionList.value
        .filter((item) => item.isSelected)
        .map((item) => item.option_identity)
    )
  }
}
const isSelectMode = computed(() => {
  return optionList.value.some((item) => item.isSelected)
})
const onGroupClick = ({ group, index }) => {
  if (!group) return
  groupList.value.forEach((item) => {
    if (item.group_identity !== group.group_identity) {
      item.isSelected = false
    }
    item.options = item.options.filter(
      (identity) => optionsMap.value[identity]?.related_group
    )
  })
  group.isSelected = !group.isSelected
  if (group.isSelected) {
    group.options = group.options.concat(
      optionList.value
        .filter((item) => item.isSelected)
        .map((item) => item.option_identity)
    )
  }
}
const cancelSelect = () => {
  optionList.value.forEach((item) => {
    item.isSelected = false
  })
  groupList.value.forEach((item) => {
    item.isSelected = false
    item.options = item.options.filter(
      (identity) => optionsMap.value[identity].related_group
    )
  })
}
const confirmRelated = () => {
  const group = groupList.value.find((item) => item.isSelected)
  if (group) {
    optionList.value.forEach((item) => {
      if (item.isSelected) {
        item.related_group = group.group_identity
        item.isSelected = false
      }
    })
    group.isSelected = false
  } else {
    ElMessage({
      message:
        textMappingConfig.value.selectGroupAndOption.chineseText +
        ' ' +
        textMappingConfig.value.selectGroupAndOption.otherLanguagesText,
      type: 'warning'
    })
  }
}
// 取消选择/关联
const optionCancel = (emitObj) => {
  const { option, groupIdentity } = emitObj
  let handleOption = optionList.value.find(
    (item) => item.option_identity === option.option_identity
  );
  if (!handleOption) {
    if (option.error_identity) {
      handleOption = {
        option_identity: option.error_identity
      }
    } else {
      return
    }
  } else {
    handleOption.related_group = ''
    handleOption.isSelected = false
  }

  const group = groupList.value.find(
    (item) => item.group_identity === groupIdentity
  )
  if (group) {
    group.options = group.options.filter(
      (identity) => identity !== (option.option_identity || option.error_identity)
    )
  }
}

// 取消人员名单
const groupCancel = (emitObj) => {
  const groupIndex = groupList.value.findIndex(
    (item) => item.group_identity === emitObj.group_identity
  )
  if (groupIndex > -1) {
    for (let i = 0; i < emitObj.options.length; i++) {
      const option_identity = emitObj.options[i]
      const option = optionsMap.value[option_identity]
      if (option && option.noCanSelected) {
        ElMessage({
          type: 'error',
          message: `${option.option_value} 已经产生数中奖名单，该人员名单不能删除`
        })
        return
      }
    }
    // 取消选项关联状态
    const handleGroup = groupList.value[groupIndex]
    handleGroup.options.forEach((identity) => {
      optionsMap.value[identity] && (optionsMap.value[identity].related_group = '')
    })
    groupList.value.splice(groupIndex, 1)
  }
}
// 编辑人员名单
const editGroupBtn = (groupInfo) => {
  // debugger
  currentEidtGroup = groupInfo
  usersTableData.value = userRelatedMap[groupInfo.group_identity]
  usersTableDialogVisible.value = true;
}
// 编辑完人员 确认回调
const modifyUsersMap = {}
const usersTableConfirm = async (data) => {
  if (currentEidtGroup && data.isModifyOp) {
    let group_identity = currentEidtGroup.group_identity
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    try {
      const isPass = await myApi.ajustModifyUsersTable(
        JSON.stringify({
          group: currentEidtGroup,
          userData: data.handleUsersTableData
        })
      )
      if (isPass) {
        ElMessage.success('修改成功')
        modifyUsersMap[group_identity] = data.handleUsersTableData
        userRelatedMap[group_identity] = data.handleUsersTableData
      } else {
        ElMessage.error('修改失败')
      }
    } catch (error) {
      loading.close()
    }
    loading.close()
  }
  currentEidtGroup = null
  usersTableDialogVisible.value = false
}

// 查看上传名单模板格式
const checkUserTemplateFormat = async (filePath) => {
  const loading = ElLoading.service({
    lock: true,
    text:
      textMappingConfig.value.opening.chineseText +
      ' ' +
      textMappingConfig.value.opening.otherLanguagesText,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const openResult = await myApi.openFileOrFolder('users_template')
  console.log(openResult, 'resultObjresultObj')
  setTimeout(() => {
    loading.close()
  }, 500)
}
// 上传人员名单
const uploadUsers = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const group_identity = `users_${nanoid()}`
    const { fileUrl, savePath, saveFolderPath, fileName, users } =
      await myApi.importFile(
        'xlsx_user',
        JSON.stringify(['xlsx', 'xls']),
        group_identity
      )
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
    const isHasGroup = groupList.value.some(
      (item) => item.group_name === fileName
    )
    if (isHasGroup) {
      ElMessage({
        type: 'warning',
        message:
          textMappingConfig.value.groupNameExists.chineseText +
          ' ' +
          textMappingConfig.value.groupNameExists.otherLanguagesText
      })
      return
    }
    const addGroup = {
      group_name: fileName,
      fileUrl,
      savePath,
      saveFolderPath,
      group_identity: group_identity,
      options: [],
      index: 0
    }
    groupList.value.push(addGroup)
    addGroup.index = groupList.value.length - 1
    loading.close()
    userRelatedMap[group_identity] = users
  } catch (error) {
    ElMessage({
      type: 'error',
      message:
        textMappingConfig.value.uploadFailed.chineseText +
        ' ' +
        textMappingConfig.value.uploadFailed.otherLanguagesText
    })
    loading.close()
  }
}
const getGroupList = () => {
  const arr = JSON.parse(JSON.stringify(groupList.value))
  arr.forEach((item) => {
    item.options = item.options.filter(
      (identity) => optionsMap.value[identity].related_group
    )
  })
  return arr
}
// 暴露属性
defineExpose({
  getGroupList,
  userRelatedMap,
  modifyUsersMap
})
</script>

<style lang="scss" scoped>
.no-data-tips {
  margin-bottom: 20px;
  color: orange;
  font-weight: 700;
}
.include-and-exclude {
  margin: 0px 16px;
  display: flex;
  > button {
    width: 50%;
  }
}
.check-users-btn {
  margin: 0px 16px;
}
.upload-users-btn {
  margin: 10px 16px;
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
