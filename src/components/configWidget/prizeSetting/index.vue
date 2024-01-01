<template>
  <div>
    <div class="lottery-layout">
      <div class="header-txt">奖项 - 顺序/数量/抽奖轮次等设置</div>
      <div class="prize-setting">
        <draggable
            :list="prizes"
            ghost-class="ghost"
            chosen-class="chosenClass"
            animation="300"
            item-key="type"
            class="draggable-box" 
            handle=".move-icon"
            @end="dragEndHandle"
            :move="dragMoveHandle"
          >
          <template 
            #item="{ element  }"
            v-if="prizes.length > 0">
            <div class="item-prize item" :key="element.type">
              <el-image
                :class="'el-image-' + element.index"
                style="width: 100px; height: 100px"
                :src="element.img"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="srcList"
                :initial-index="element.index"
                fit="contain"
              /> 
              <div class="prize-text">{{ element.name }}</div>
              <div class="prize-text">{{ element.otherName }}</div>
              <div class="mark-operation">
                <div v-if="luckyUsers[element.type]" class="mark-tips">奖项有中奖名单, 不能删除和拖动</div>
                <el-icon v-show="!luckyUsers[element.type]" class="move-icon" size="23" color="#fff"><Switch /></el-icon>
                <div class="center-btn">
                  <el-icon @click="editPrize(element, 'edit')" size="23" color="#fff"><EditPen /></el-icon>
                  <el-icon @click="handlePictureCardPreview(element)" size="23" color="#fff"><ZoomIn /></el-icon>
                  <span v-show="!luckyUsers[element.type]">
                    <el-popconfirm 
                      title="确认删除吗?" 
                      confirm-button-type="danger"
                      @confirm="deletePrize(element)">
                      <template #reference>
                        <el-icon  size="23" color="#fff"><Delete /></el-icon>
                      </template>
                    </el-popconfirm>
                  </span>
                </div>
              </div>
            </div> 
          </template>
          <template #item v-if="prizes.length <= 0">
            <div class="item-prize add" @click="editPrize({}, 'add')">
              <span class="symbol">+</span>
            </div>
          </template>
          <template #footer>
            <div class="item-prize add" @click="editPrize({}, 'add')">
              <span class="symbol">+</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <div class="lottery-layout">
      <div class="header-txt">奖品栏样式设置</div>
      <div class="layout-form">
        <el-form
          ref="form"
          :model="prizesBarStyle"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <el-form-item v-for="item in labelFieldArr" :key="item.field" :label="item.label" :prop="item.field">
            <el-input-number
              v-if="item.type === 'number'"
              v-model="prizesBarStyle[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <el-input 
              v-else 
              v-model="prizesBarStyle[item.field]"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
      <editDialog 
      @close="editDialogVisible = false"
      :key="editDialogVisible"
      @confirm="editConfirm"
      :openType="openType"
      :editDialogVisible="editDialogVisible"
      :editData="editData"
      :prizes="prizes" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import draggable from "vuedraggable";
import bus from '../../../libs/bus'
import editDialog from './editDialog.vue'
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
const prizes = ref([]);
const editDialogVisible = ref(false);
const editData = ref({});
const openType = ref('edit');
const luckyUsers = basicData.luckyUsers;
const emit = defineEmits(['cutPrize', 'addPrize']);
const handleAddGroup = ref(null);
import { nanoid } from 'nanoid';
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
// 样式设置label
const labelFieldArr = [
  {
    label: textMappingConfig.value.leftBarListWidth.chineseText + ' ' + textMappingConfig.value.leftBarListWidth.otherLanguagesText,
    field: 'barBoxWidth',
  },
  {
    label: textMappingConfig.value.prizeBoxWidth.chineseText + ' ' + textMappingConfig.value.prizeBoxWidth.otherLanguagesText,
    field: 'prizeBoxWidth',
  },
  {
    label: textMappingConfig.value.minimumPrizeBoxHeight.chineseText + ' ' + textMappingConfig.value.minimumPrizeBoxHeight.otherLanguagesText,
    field: 'prizeBoxMinHeight',
  },
  {
    label: textMappingConfig.value.spaceBetweenPrizes.chineseText + ' ' + textMappingConfig.value.spaceBetweenPrizes.otherLanguagesText,
    field: 'prizeSpace',
  },
  {
    label: textMappingConfig.value.prizeFontSize.chineseText + ' ' + textMappingConfig.value.prizeFontSize.otherLanguagesText,
    field: 'prizeFontSize',
  },
  {
    label: textMappingConfig.value.progressBarHeight.chineseText + ' ' + textMappingConfig.value.progressBarHeight.otherLanguagesText,
    field: 'progressHeight',
  },
  {
    label: textMappingConfig.value.progressBarFontSize.chineseText + ' ' + textMappingConfig.value.progressBarFontSize.otherLanguagesText,
    field: 'progressFontSize',
  },
  {
    label: textMappingConfig.value.imagePlaceholderWidth.chineseText + ' ' + textMappingConfig.value.imagePlaceholderWidth.otherLanguagesText,
    field: 'imgGutterWidth',
  },
  {
    label: textMappingConfig.value.imagePlaceholderHeight.chineseText + ' ' + textMappingConfig.value.imagePlaceholderHeight.otherLanguagesText,
    field: 'imgGutterHeight',
  },
  {
    label: textMappingConfig.value.currentPrizeScale.chineseText + ' ' + textMappingConfig.value.currentPrizeScale.otherLanguagesText,
    field: 'currentPrizeScale',
    type: 'number'
  }
]
const prizesBarStyle = ref({
  barBoxWidth: '25vw',
  prizeBoxWidth: '20vw',
  prizeBoxMinHeight: '15vh',
  prizeSpace: '20px',
  prizeFontSize: '1vw',
  progressHeight: '1.8vh',
  progressFontSize: '1vw',
  imgGutterWidth: '8vh',
  imgGutterHeight: '8vh',
  currentPrizeScale: 1.2
})


const initHandlePrizes = () => {
  if (basicData.prizes && basicData.prizes.length > 0) {
    prizes.value = JSON.parse(JSON.stringify(basicData.prizes)).map((item, index) => {
      item.index = index;
      item.isHasLucky = !!luckyUsers[item.type];
      return item
    });
  }
  // copy样式设置
  prizesBarStyle.value = JSON.parse(JSON.stringify(basicData.prizesBarStyle))
}
// 图片列表
const srcList = computed(() => {
  let list = []
  for (let i = 0; i < prizes.value.length; i++) {
    list.push(prizes.value[i].img)
  }
  return list
});
const deletePrize = (element) => {
  prizes.value = prizes.value.filter(item => item.type !== element.type)
  emit('cutPrize', element)
}
const handlePictureCardPreview = (element) => {
  let elImageDom = document.querySelector(`.el-image-${element.index}`);
  elImageDom && elImageDom.children[0].click();
  // dialogImageUrl.value = element.img
  // dialogVisible.value = true
}
// 拖拽结束 - 重新调整index索引
const dragEndHandle = () => {
  prizes.value = prizes.value.map((item, index) => {
    item.index = index;
    return item
  });
}
// 拖拽移动 中
const dragMoveHandle = (evt, originalEvent) => {
  const { dragged, related } = evt;
  const { __draggable_context } = related
  const type = __draggable_context.element.type;
  const isHasLucky = luckyUsers[type];
  if (isHasLucky) return false;
}
// 编辑奖项
const editPrize = (element, type) => {
  editDialogVisible.value = true;
  editData.value = element;
  openType.value = type
}

// 编辑/添加奖项确认
const editConfirm = (data) => {
  let { editValue, addGroup } = data
  const handleObj = prizes.value.find(item => item.type === editValue.type);
  if (!handleObj) {
    const type = nanoid();
    if (addGroup) {
      addGroup.options.push(type)
      handleAddGroup.value = addGroup;
    }
    let findIndex = prizes.value.findIndex(item => item.isHasLucky);
    findIndex = findIndex === -1 ? prizes.value.length : findIndex;
    let addObj = { type, ...editValue, index: findIndex, isHasLucky: false };
    prizes.value.splice(findIndex, 0, addObj);
    emit('addPrize', addObj);
  } else {
    Object.assign(handleObj, editValue);
  }
}
// bus.on('initConfigDataEnd', initHandlePrizes)
onMounted(() => {
  initHandlePrizes();
  handleAddGroup.value = null
})
// 暴露属性
defineExpose({
  prizes,
  prizesBarStyle,
  handleAddGroup
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
}
.prize-setting > div {
  display: grid;
  grid-template-columns: repeat(6, 15.3%);
  gap: 1.5%;
  row-gap: 20px;
  // display: flex;
  flex-wrap: wrap;
 
}
.item-prize {
  // margin: 8px;
  // margin: 1%;
  box-sizing: border-box;
  // width: 13.5%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  // height: 140px;
  padding-bottom: 15px;
  .prize-text {
    // width: 100px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  &.add {
    border: 1px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: lighter;
    cursor: pointer;
  }
  &:hover {
    border-color: #409eff;
    .mark-operation {
      opacity: 1;
    }
  }
  .mark-operation{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.3s;
    background-color: rgba(0, 0, 0, 0.5);
    .mark-tips {
      font-size: 14px;
      color: orange;
      margin-top: 10px;
    }
    .move-icon {
      position: absolute;
      top: 10px;
      left: 10px;
      cursor: move;
    }
    .center-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 10px;
      justify-content: center;
      align-items: center;
      text-align: center;
      .el-icon {
        cursor: pointer;
      }
    }
  }
}
</style>