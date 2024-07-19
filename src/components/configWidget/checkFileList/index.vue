<template>
 <div class="lottery-layout">
    <!-- <div class="header-txt">文件列表</div> -->
    <div class="operation-open-folder">
      <el-button type="primary" plain @click="openFileOrFolder(fileInfoList[0], 'folder')">{{ textMappingConfig.openFolder.chineseText + ' ' + textMappingConfig.openFolder.otherLanguagesText }}</el-button>
    </div>
    <div v-for="(file, index) in fileInfoList" :key="index" class="file-item">
      <div class="left-info">
        <el-icon :size="15"><Document /></el-icon>
        <span class="file-name">{{ file.fileName }}</span>
      </div>
      <div class="operation-btn">
        <el-button link type="primary" plain @click="openFileOrFolder(file)">{{ textMappingConfig.openFile.chineseText + ' ' + textMappingConfig.openFile.otherLanguagesText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
import { ElLoading, ElMessage } from 'element-plus'
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const fileInfoList = ref([])
// 自定义排序函数
const customSort = (a, b) => {
    const regex = /结果-/;
    const aHasPrefix = regex.test(a.fileName);
    const bHasPrefix = regex.test(b.fileName);

    if (!aHasPrefix || !bHasPrefix) {
        return a.fileName.localeCompare(b.fileName);
    }

    const aDate = a.fileName.match(/\d{4}-\d{2}-\d{2}#\d{2}.\d{2}.\d{2}.\d{3}/)[0];
    const bDate = b.fileName.match(/\d{4}-\d{2}-\d{2}#\d{2}.\d{2}.\d{2}.\d{3}/)[0];
    return new Date(bDate.replace('#', 'T').replaceAll('.', ':')) - new Date(aDate.replaceAll('#', 'T').replaceAll('.', ':'));
};

onMounted(async () => {
  fileInfoList.value = await myApi.getSaveExcelFileInfoList();
  fileInfoList.value.sort(customSort)
})
const openFileOrFolder = async (file, type) => {
  let filePath;
  if (type === 'folder') {
    if (!file) {
      ElMessage({
        type: 'error',
        message: textMappingConfig.value.openFolderError.chineseText + ' ' + textMappingConfig.value.openFolderError.otherLanguagesText
      })
      return
    }
    filePath = file.saveFolderPath
  } else {
    filePath = file.filePath
  }
  const loading = ElLoading.service({
    lock: true,
    text: textMappingConfig.value.opening.chineseText + ' ' + textMappingConfig.value.opening.otherLanguagesText,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await myApi.openFileOrFolder(filePath);
  setTimeout(() => {
    loading.close();
  }, 500)
}
defineExpose({
})
</script>

<style lang="scss" scoped>
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