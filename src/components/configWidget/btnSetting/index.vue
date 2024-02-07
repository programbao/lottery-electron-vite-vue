<template>
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 90%"
      ref="ruleFormRef"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="字体大小">
            <el-input 
              v-model="formLabelAlign.fontSize"></el-input> 
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盒子高度">
            <el-input 
              v-model="formLabelAlign.height"></el-input> 
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
onMounted(() => {
  formLabelAlign.value = JSON.parse(JSON.stringify(basicData.btnSettings))
})
const formLabelAlign = ref({
  fontSize: '22px',
  height: '100px',
})

const validateForm = async () => {
  if (!ruleFormRef.value) return
  const isPass = await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
  return isPass
}
defineExpose({
  formLabelAlign,
  validateForm
})
</script>

<style lang="scss" scoped>
.music-desc {
  display: flex;
  justify-content: center;
  align-items: center;
  > audio {
    display: none;
  }
  .el-icon {
    margin: 0 10px;
    cursor: pointer;
  }
}
.music-form-item {
  .el-button {
    margin-left: 5px;
  }
}
.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
  // text-align: left;
  // padding-left: 30px;
}
.upload {
  // margin: 0.90%;
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  height: 200px;
  .el-image {
    width: 100%;
    height: 100%;
  }
  &:hover {
    border-color: #409eff;
    .mark-operation {
      opacity: 1;
    }
  }
}
.add {
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: lighter;
  cursor: pointer;
}
</style>