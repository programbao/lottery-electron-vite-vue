<template>
 <div class="lottery-layout">
    <div class="layout-form">
      <div class="row title">
        <div class="column label">控制字段</div>
        <div class="column">中文文案</div>
        <div class="column">其他语言文案</div>
      </div>
      <div class="row" v-for="(item, index) in labelFieldArr" :key="index">
        <div class="column label">{{ item.label }}</div>
        <div class="column">
          <el-input v-model="textMappingConfig[item.field].chineseText" class="input-field" />
        </div>
        <div class="column">
          <el-input v-model="textMappingConfig[item.field].otherLanguagesText" class="input-field" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();

// 样式设置label
const labelFieldArr = ref([])
const textMappingConfig = ref({})

onMounted(() => {
  textMappingConfig.value = JSON.parse(JSON.stringify(basicData.textMappingConfig))
  Object.keys(textMappingConfig.value).forEach(key => {
    let controlObj = textMappingConfig.value[key];
    let addLabelField = {
      label: key,
      field: key,
      defaultText: controlObj.defaultText,
      chineseText: controlObj.chineseText,
      otherLanguagesText: controlObj.otherLanguagesText
    }
    labelFieldArr.value.push(addLabelField)
  })
})


// const validateForm = async () => {
//   if (!ruleFormRef.value) return
//   const isPass = await ruleFormRef.value.validate((valid, fields) => {
//     if (valid) {
//       return true
//     } else {
//       return false
//     }
//   })
//   return isPass
// }
defineExpose({
  textMappingConfig
})
</script>

<style lang="scss" scoped>
 .lottery-layout {
  .header-txt {
    text-indent: 10px;
    color: #fff;
    margin: 15px 0;
    background: linear-gradient(90deg,#656a79,#f2fafe);
    border-radius: 6px;
    line-height: 32px;
    text-align: left;
  }
  &:first-child {
    .header-txt {
      margin-top: 0;
    }
  }
  .layout-form {
      display: flex;
      flex-direction: column;
      // border: 1px solid #ccc;
      padding: 10px;

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      &.title {
        .column {
          font-weight: 700;
          font-size: 20;
          margin-bottom: 10px;
        }
      }
    }

    .column {
      flex: 1;
      padding: 5px;
      // border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .label {
      flex: 0.7;
    }

    .input-field {
      width: 100%;
    }
  }
}
.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
}

</style>