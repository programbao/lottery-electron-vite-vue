<template>
  <div class="lottery-layout">
    <el-table
      :data="operationLogList"
      height="650"
      style="width: 100%">
      <el-table-column
        prop="date"
        :label="textMappingConfig.date.chineseText + ' ' + textMappingConfig.date.otherLanguagesText"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        :label="textMappingConfig.operationType.chineseText + ' ' + textMappingConfig.operationType.otherLanguagesText"
        width="180">
      </el-table-column>
      <el-table-column
        prop="value"
        :label="textMappingConfig.nameList.chineseText + ' ' + textMappingConfig.nameList.otherLanguagesText"
        >
        <template #default="scope">
          <span v-if="scope.row.type !== 'lucky_user'">{{ scope.row.value }}</span>
          <div v-else>
            <div v-for="item in scope.row.value" :key="item">
              <span class="lucky-user">{{ item ? item.join(',') : '' }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
   </div>
 </template>
 
 <script setup>
 import { ref, onMounted, computed } from 'vue'
 const ruleFormRef = ref()
 const emit = defineEmits(['close', 'confirm']);
 import { lotteryDataStore } from '../../../store'
 const basicData = lotteryDataStore();
 import { ElLoading } from 'element-plus'
 const textMappingConfig = computed(() => {
   return basicData.textMappingConfig
 })
 const operationLogList = ref([])
 
 onMounted(async () => {
  let list = await window.operationLogTable.getAll();
  list.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
})
  list.forEach(item => {
    if (item.type === 'lucky_user') {
      item.value = JSON.parse(item.value)
    }
  })
  operationLogList.value = list;
 })
 
 </script>
 
 <style lang="scss" scoped>
 .lucky-user {
  padding: 4px;
  margin: 2px;
  font-size: 13px;
  align-items: center;
  background: #f0f0f0;
  border-radius: 4px;
  color: #9da4ad;
  display: inline-block;
 }
  .lottery-layout {
   .operation-open-folder {
     text-align: right;
     margin-bottom: 20px;
   }
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
     .el-form {
       display: grid;
       grid-template-columns: repeat(5, 1fr);
       gap: 20px;
       .el-form-item--large {
         margin-bottom: 0px;
         > label {
           margin-bottom: 0;
         }
       }
     }
   }
 
   .file-item {
     display: flex;
     cursor: pointer;
     padding: 10px;
     border-radius: 10px;
     transition: all .2s;
     &:hover {
       background-color: #f5f7fa;
       .file-name {
         color: #409eff;
       }
     }
     color: #606266;
     .left-info {
       flex: 1;
       text-align: left;
       display: flex;
       align-items: center;
       .file-name {
         margin-left: 8px;
       }
     }
   }
 
 }
 .tips {
   color: orange;
   font-weight: 700;
   margin-bottom: 20px;
 }
 
 </style>