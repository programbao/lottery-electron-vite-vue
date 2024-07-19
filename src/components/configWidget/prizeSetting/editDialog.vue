<template>
  <!-- <el-dialog
    v-model="dialogVisible"
    width="50%"
    :close-on-click-modal="false"
    title="奖项编辑">
    
  </el-dialog> -->
  <lt-dialog
    :visible="dialogVisible"
    :title="openType === 'add' ? '新增奖项' : '编辑奖项'"
    @close="dialogVisible = false"
    @confirm="confirm">
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 90%"
      :rules="rules"
      ref="ruleFormRef"
    >
      <div class="tips" v-if="openType !== 'add'  && !!luckyUsers[formLabelAlign.type]">该奖项已有中奖名单，名称不能修改</div> 
      <div class="tips" v-if="openType !== 'add'  && !!luckyUsers[prevPrizesData.type]">前面奖项已有中奖名单，抽取数和图片不能修改</div> 
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formLabelAlign.name" :disabled="openType !== 'add'  && !!luckyUsers[formLabelAlign.type]" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他语言名称" prop="otherName">
            <el-input v-model="formLabelAlign.otherName" :disabled="openType !== 'add'  && !!luckyUsers[formLabelAlign.type]" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="抽取总数" prop="count">
            <el-input-number
              :disabled="openType !== 'add'  && !!luckyUsers[prevPrizesData.type]"
              v-model="formLabelAlign.count"
              :min="1"
              controls-position="right"
              size="large"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每轮抽取数" prop="eachCount">
            <el-input-number
              :disabled="openType !== 'add'  && !!luckyUsers[prevPrizesData.type]"
              v-model="formLabelAlign.eachCount"
              :min="1"
              controls-position="right"
              size="large"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="图片" prop="img">
            <div class="upload add" @click="importFile(openType !== 'add'  && !!luckyUsers[prevPrizesData.type])">
              <el-image
                v-if="formLabelAlign.img"
                :disabled="openType !== 'add'  && !!luckyUsers[prevPrizesData.type]"
                :src="formLabelAlign.img"
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
    </el-form>
    <div class="select-box" v-if="openType === 'add'">
      <div class="select-title">
        可选择一个奖项，同步相同配置
        <el-button type="primary" plain @click="clearSelect">清空</el-button>
      </div>
      <div class="prizes" v-if="canShowPrize.length">
        <div 
          class="prize"
          :class="{
            action: index === selectedPrizeIndex
          }"
          @click="prizeClick(item, index)"
          v-for="(item, index) in canShowPrize" :key="index">
          {{ item.name }} 
        </div>
      </div>
      <div class="prizes-empty" v-else>暂无可选奖项</div>
    </div>
  </lt-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import ltDialog from '../../common/lt-dialog.vue'
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
let addGroup = null;
let groupList = JSON.parse(JSON.stringify(basicData.groupList)) 
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const props = defineProps({
  editDialogVisible: {
    type: Boolean,
    required: true,
  },
  editData: {
    type: Object,
    required: true
  },
  openType: {
    type: String,
    required: true
  },
  prizes: {
    type: Array,
    required: true
  }
});
let canShowPrize = computed(() => {
  try {
    if (props.prizes) {
      let handlePrizes = JSON.parse(JSON.stringify(props.prizes))
      handlePrizes = handlePrizes?.filter(someData => (groupList.find(item => item.options?.includes(someData.type)) || null)) || []
      return handlePrizes;
    }
  } catch (error) {
  }
  return []
})
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
const dialogVisible = computed({
  get() {
    return props.editDialogVisible
  },
  set() {
    emit('close', false)
  }
})


const luckyUsers = basicData.luckyUsers
const prevPrizesData = ref({});
let currentLucky = undefined;
// 校验每轮抽取数
const checkEachCount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入抽取数量'))
  } 
  if (value > formLabelAlign.value.count) {
    callback(new Error('不能大于抽取总数'))
  } else {
    callback()
  }
}
// 校验抽奖总数
const checkTotalCount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入抽取总数'))
  } 
  if (value < formLabelAlign.value.eachCount) {
    callback(new Error('不能小于每轮抽取数'))
  } else {
    if (currentLucky && value < currentLucky.length) {
      return callback(new Error(`当前已经有${currentLucky.length}人中奖, 中奖数不能小于${currentLucky.length}人`))
    }
    callback()
  }
}
const rules = {
  count: [
    {
      required: true,
      validator: checkTotalCount,
      trigger: 'change',
    },
  ],
  eachCount: [
    {
      required: true,
      validator: checkEachCount,
      trigger: 'change',
    },
  ], 
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  img: [
    {
      required: true,
      message: textMappingConfig.value.uploadImage.chineseText + ' ' + textMappingConfig.value.uploadImage.otherLanguagesText,
      trigger: 'blur',
    },
  ]
}

const formLabelAlign = ref({
  count: 0,
  eachCount: 0,
  name: "",
  otherName: "",
  img: ''
})
const selectedPrizeIndex = ref(-1)
const prizeClick = (item, index) => {
  selectedPrizeIndex.value = index
  let someData = JSON.parse(JSON.stringify(item))
  let fields = ['count', 'eachCount', 'name', 'otherName', 'img']
  fields.forEach(key => {
    formLabelAlign.value[key] = someData[key]
  })
  addGroup = groupList.find(item => item.options.includes(someData.type)) || null;
  console.log(addGroup, 'addGroupaddGroup')
}
const clearSelect = () => {
  selectedPrizeIndex.value = -1
  formLabelAlign.value = {
    count: 0,
    eachCount: 0,
    name: "",
    otherName: "",
    img: ''
  }
}
// watch(
//   () => props.editDialogVisible,
//   () => {
//     if (props.editDialogVisible) {
//       formLabelAlign.value = JSON.parse(JSON.stringify(props.editData))
//       currentLucky = luckyUsers[formLabelAlign.value.type]
//       const findIndex = basicData.prizes.findIndex(item => item.type === formLabelAlign.value.type)
//       prevPrizesData.value = basicData.prizes[findIndex - 1] || {}
//       if (formLabelAlign.value.eachCount === undefined) {
//         formLabelAlign.value.eachCount = formLabelAlign.value.count
//       }
//     }
//   }
// );
onMounted(() => {
  if (props.editDialogVisible) {
    formLabelAlign.value = JSON.parse(JSON.stringify(props.editData))
    currentLucky = luckyUsers[formLabelAlign.value.type]
    const findIndex = basicData.prizes.findIndex(item => item.type === formLabelAlign.value.type)
    prevPrizesData.value = basicData.prizes[findIndex - 1] || {}
    if (formLabelAlign.value.eachCount === undefined) {
      formLabelAlign.value.eachCount = formLabelAlign.value.count
    }
  }
})
const importFile = async (disabled) => {
  if (disabled) return
  const importData = await myApi.importFile('other_file', JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'bmp']));
  if (!importData) return
  let { fileUrl } = importData;
  if (fileUrl) {
    formLabelAlign.value.img = fileUrl
  }
}
const confirm = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      emit('confirm', {
        editValue: formLabelAlign.value,
        addGroup,
      })
      emit('close', false)
      selectedPrizeIndex.value = -1
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.select-box {
  .select-title {
    font-size: 18px;
    font-weight: 700;
    position: relative;
    .el-button {
      position: absolute;
      right: 0;
      top: 0;

    }
  }
  .prizes {
    display: flex;
    flex-wrap: wrap;
    .prize {
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #f0f0f0;
      border-radius: 4px;
      padding: 10px 12px 10px 8px;
      margin-right: 8px;
      margin-bottom: 12px;
      // overflow: hidden;
      position: relative;
      user-select: none;
      touch-callout: none;
      -webkit-touch-callout:none;
      -webkit-user-select: none;
      font-size: 14px;
      color: #3a414a;
      font-weight: 500;
      word-break: break-word;
      transition: all .2s;
      &.action {
        background: #ffffff;
        border: 2px solid #409eff;
        color: #101216;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
}

.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
  // text-align: left;
  // padding-left: 30px;
}
.el-input-number {
  width: 100% !important;
}
.upload {
  // margin: 0.90%;
  width: 33.5%;
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