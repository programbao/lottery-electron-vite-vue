<template>
  <lt-dialog
    :visible="dialogVisible"
    title="添加人员"
    width="60%"
    @close="dialogVisible = false"
    @confirm="confirm"
  >
    <div class="tips">工号是员工的唯一标识，不能相同和不能为空</div>
    <!-- <div class="tips">请注意格式: [ ['工号','部门','姓名'], ['工号','部门','姓名'] ]；例如：[ ['1423041500','部门1','姓名1'], ['142304150011','部门2','姓名2'] ]</div> -->
    <el-row :gutter="24">
      <div>
        <div
          class="op-box"
          v-if="!isUpdateEdit"
        >
          <el-button
            class="add-users-btn"
            @click="addUser"
            type="primary"
            plain
            >{{
              textMappingConfig.add.chineseText +
              ' ' +
              textMappingConfig.add.otherLanguagesText
            }}</el-button
          >
        </div>
        <el-descriptions
          border
          :column="isUpdateEdit ? 4 : 5"
          v-for="(item, index) in currentArr"
        >
          <el-descriptions-item>
            <template #label>
              <span class="cell-item-label">工号</span>
            </template>
            <el-input
              v-model="item[0]"
              :disabled="isUpdateEdit"
            ></el-input>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="cell-item-label">部门</span>
            </template>
            <el-input v-model="item[1]"></el-input>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="cell-item-label">姓名</span>
            </template>
            <el-input v-model="item[2]"></el-input>
          </el-descriptions-item>
          <el-descriptions-item
            width="0px"
            v-if="!isUpdateEdit"
          >
            <el-button
              type="danger"
              @click="delUser(item, index)"
              >删除</el-button
            >
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-row>
  </lt-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ltDialog from '../../../common/lt-dialog.vue'
import { ElMessage } from 'element-plus'
import { lotteryDataStore } from '../../../../store'
const basicData = lotteryDataStore()
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})

let currentArr = ref([])

// import { lotteryDataStore } from '../../../store'
// const basicData = lotteryDataStore();
const props = defineProps({
  editDialogVisible: {
    type: Boolean,
    required: true
  },
  handleUsersTableData: {
    type: Array,
    default: () => []
  },
  updateEditData: {
    type: Array,
    default: () => []
  },
  isUpdateEdit: {
    type: Boolean,
    required: false
  }
})
watch(
  () => props.isUpdateEdit,
  () => {
    if (props.isUpdateEdit) {
      currentArr.value = [JSON.parse(JSON.stringify(props.updateEditData))]
    } else {
      currentArr.value = []
    }
  }
)
const textarea = ref('')
const emit = defineEmits(['close', 'confirm'])
const dialogVisible = computed({
  get() {
    return props.editDialogVisible
  },
  set() {
    emit('close', false)
  }
})
const addUser = () => {
  currentArr.value.push(['', '', ''])
  // currentArr.value.push({
  // 	xh: "10",
  // 	sbdk: "1970-01-01 00:00:00",
  // 	xbdk: "1970-01-01 00:00:00",
  // 	djrxb: 0,
  // 	bcglid: currentOpenForm?.id,
  // 	bcglmc: currentOpenForm?.bcmc
  // });
}
const delUser = (item, index) => {
  currentArr.value.splice(index, 1)
  // delShiftWorkTimeIds.push(item.id);
}
function validateInput(data) {
  try {
    // const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      return false
    }
    const handleIdSet = new Set()
    for (const item of data) {
      if (!Array.isArray(item) || item.length !== 3) {
        return false
      }
      const [id, department, name] = item
      // if (typeof id !== 'string' || typeof department !== 'string' || typeof name !== 'string') {
      //   return false;
      // }
      if (!id || !department || !name) {
        ElMessage.error('工号、部门、姓名不能为空')
        return false
      }
      // 在此添加其他可能的验证逻辑
      // 验证工号是否唯一和不能为空
      const isHasRepeat = props.isUpdateEdit
        ? false
        : props.handleUsersTableData.some((item) => item[0] + '' === id + '')
      if (handleIdSet.has(id + '') || isHasRepeat) {
        ElMessage.error(`工号 ${id} 重复`)
        return false
      }
      handleIdSet.add(id + '')
    }
    return true
  } catch (error) {
    return false
  }
}
const confirm = async () => {
  try {
    // const textareaValue = textarea.value.trim()
    // const data = JSON.parse(textareaValue.replaceAll('\'', '\"'))
    const isValid = validateInput(currentArr.value)
    if (!isValid) {
      ElMessage.error('格式有误，请检查')
    } else {
      emit('confirm', currentArr.value)
      // textarea.value = '';
    }
  } catch (error) {
    ElMessage.error('格式有误, 请检查')
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
  // text-align: left;
  // padding-left: 30px;
}
.cell-item-label {
  white-space: nowrap;
}
.el-textarea {
  margin-bottom: 20px;
}

.op-box {
  display: flex;
  .op-box-title {
    font-size: 14px;
    font-weight: 600;
    padding-left: 50px;
    margin-bottom: 20px;
  }
}
</style>
