<template>
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 90%"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="textMappingConfig.backgroundImageWall.chineseText + ' ' + textMappingConfig.backgroundImageWall.otherLanguagesText" prop="bgImg.fileUrl">
            <div class="upload add" @click="importFile('bgImg')">
              <el-image
                v-if="formLabelAlign.bgImg.fileUrl"
                :src="formLabelAlign.bgImg.fileUrl"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="textMappingConfig.screenWallImage.chineseText + ' ' + textMappingConfig.screenWallImage.otherLanguagesText"  prop="screenImg.fileUrl">
            <div class="upload add" @click="importFile('screenImg')">
              <el-image
                v-if="formLabelAlign.screenImg.fileUrl"
                :src="formLabelAlign.screenImg.fileUrl"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="textMappingConfig.musicFile.chineseText + ' ' + textMappingConfig.musicFile.otherLanguagesText"  prop="musicFile.fileUrl" class="music-form-item">
            <div
              class="music-desc"
              v-if="formLabelAlign.musicFile.fileUrl"
              :src="formLabelAlign.musicFile.fileUrl">
               <span>{{ formLabelAlign.musicFile.fileName }}</span>
               <el-icon :size="20" color="#409eff" @click="playClick" v-show="!isPlay"><VideoPlay /></el-icon>
               <el-icon :size="20" color="#409eff" @click="playClick" v-show="isPlay"><VideoPause /></el-icon>
               <audio
                ref="music"
                :src="formLabelAlign.musicFile.fileUrl"
                ></audio>
            </div>
            <el-button 
              v-if="!formLabelAlign.musicFile.fileUrl"
              @click="importFile('musicFile')"
              type="primary">{{ textMappingConfig.uploadMusic.chineseText + ' ' + textMappingConfig.uploadMusic.otherLanguagesText }}</el-button>
            <el-button 
              v-if="formLabelAlign.musicFile.fileUrl"
              @click="importFile('musicFile')"
              type="primary">{{ textMappingConfig.changeMusic.chineseText + ' ' + textMappingConfig.changeMusic.otherLanguagesText }}</el-button> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="背景图片遮罩透明度">
            <el-input 
              v-model="formLabelAlign.bgImgMarkOpacity"></el-input> 
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
const isPlay = ref(false);
const music = ref();
const rules = {
  'bgImg.fileUrl': [
    {
      required: true,
      message: textMappingConfig.value.uploadImage.chineseText + ' ' + textMappingConfig.value.uploadImage.otherLanguagesText,
      trigger: 'blur',
    },
  ],
  'screenImg.fileUrl': [
    {
      required: true,
      message: textMappingConfig.value.uploadImage.chineseText + ' ' + textMappingConfig.value.uploadImage.otherLanguagesText,
      trigger: 'blur',
    },
  ],
  'musicFile.fileUrl': [
  {
      required: true,
      message: textMappingConfig.value.uploadAudio.chineseText + ' ' + textMappingConfig.value.uploadAudio.otherLanguagesText,
      trigger: 'blur',
    },
  ]
}
onMounted(() => {
  formLabelAlign.value = JSON.parse(JSON.stringify(basicData.otherResource))
})
const formLabelAlign = ref({
  screenImg: {
    fileUrl: '',
    fileName: ''
  },
  bgImg: {
    fileUrl: '',
    fileName: ''
  },
  musicFile: {
    fileUrl: '',
    fileName: ''
  },
  bgImgMarkOpacity: '0.3'
})
const importFile = async (key) => {
  // 图片文件
  let extensions = JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'bmp']);
  // 音频文件
  if (key === 'musicFile') {
    extensions = JSON.stringify(['mp3', 'm4a'])
  }
  let { fileUrl, fileName } = await myApi.importFile('other_file', extensions);
  if (fileUrl) {
    formLabelAlign.value[key] = {
      fileUrl,
      fileName
    }
  }
}
const playClick  = (e) => {
  if (music.value.paused) {
    music.value.play()
    isPlay.value = true
  } else {
    music.value.pause()
    isPlay.value = false
  }
}
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