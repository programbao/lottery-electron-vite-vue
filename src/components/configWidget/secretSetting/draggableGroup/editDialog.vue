<template>
  <lt-dialog
    :visible="dialogVisible"
    title="添加人员"
    @close="dialogVisible = false"
    @confirm="confirm">
    <div class="tips">工号是员工的唯一标识，不能相同和不能为空</div>
    <div class="tips">请注意格式: [ ['工号','部门','姓名','轮次'], ['工号','部门','姓名','轮次'] ]；例如：[ ['1423041500','部门1','姓名1','1'], ['142304150011','部门2','姓名2','1'] ]</div>
    <el-row :gutter="24">
      <el-input
        v-model="textarea"
        :rows="5"
        type="textarea"
        placeholder="请注意格式: [ ['工号','部门','姓名','轮次'], ['工号','部门','姓名','轮次'] ]；例如：[ ['1423041500','部门1','姓名1','1'], ['142304150011','部门2','姓名2','1'] ]"
      />
    </el-row>
  </lt-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ltDialog from '../../../common/lt-dialog.vue'
import { ElMessage } from 'element-plus'
// import { lotteryDataStore } from '../../../store'
// const basicData = lotteryDataStore();
const props = defineProps({
  editDialogVisible: {
    type: Boolean,
    required: true,
  },
  optionList: {
    type: Array,
    required: true,
  }
});
const textarea = ref('')
const emit = defineEmits(['close', 'confirm']);
const dialogVisible = computed({
  get() {
    return props.editDialogVisible
  },
  set() {
    emit('close', false)
  }
})
function validateInput(data) {
  try {
    // const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      return false;
    }
    const handleIdSet = new Set();
    props.optionList.forEach((item) => {
      handleIdSet.add(item.option_identity);
    })
    for (const item of data) {
      if (!Array.isArray(item) || item.length < 3) {
        return false;
      }
      const [id, department, name] = item;
      // if (typeof id !== 'string' || typeof department !== 'string' || typeof name !== 'string') {
      //   return false;
      // }
      // 在此添加其他可能的验证逻辑
      // 验证工号是否唯一和不能为空
      if (!id || handleIdSet.has(id+'')) {
        ElMessage.error(`工号 ${id} 重复或为空`);
        return false;
      }
      handleIdSet.add(id+'');
    }
    return true;
  } catch (error) {
    return false;
  }
}
const confirm = async () => {
  try {
    const textareaValue = textarea.value.trim()
    const data = JSON.parse(textareaValue.replaceAll('\'', '\"')) 
    const isValid = validateInput(data);
    if (!isValid) {
      ElMessage.error('格式有误，请检查');
    } else {
      emit('confirm', data);
      textarea.value = '';
    }
  } catch (error) {
    ElMessage.error('格式有误, 请检查');
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

.el-textarea {
  margin-bottom: 20px;
}
</style>