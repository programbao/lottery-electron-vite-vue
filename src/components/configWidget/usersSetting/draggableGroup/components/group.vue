<template>
  <div class="qd-optiongroup" :class="classname">
    <!--  选项组  -->
    <div
      ref="qdGroupItem"
      class="qd-optiongroup-item common"
      :data-groupindex="groupInfo.index"
      :class="{
        'has-error': groupInfo.errorMsg
      }"
    >
      <div class="content">
        <!-- 小于四列 -->
        <div class="content-title" v-html="groupInfo.group_name_html || groupInfo.group_name"></div>
        <div class="content-tags">
          <div class="tags-drag-tips" v-if="groupInfo.options.length === 0">{{ textMappingConfig.associatePrizeHere.chineseText + ' ' + textMappingConfig.associatePrizeHere.otherLanguagesText }}</div>
          <template v-else>
            <div
              class="group-option-container"
              :style="{
                flexDirection: [2, 3].includes(showType) ? 'column' : 'row',
                flexWrap: [2, 3].includes(showType) ? 'nowrap' : 'wrap'
              }"
              ref="groupOptionContainer"
            >
            <div
              class="group-option-item"
              :class="{
                'is-related': getCurrentOption(optionsMap[identity]).related_group,
                'no-can-selected': getCurrentOption(optionsMap[identity]).noCanSelected
              }"
              v-for="identity of groupInfo.options"
              :key="identity">
              <div
                v-html="getCurrentOption(optionsMap[identity]).option_value_html || getCurrentOption(optionsMap[identity]).option_value"
              />
              <el-icon
                v-if="!getCurrentOption(optionsMap[identity]).noCanSelected"
                @click.stop="closeOptionBtn({option: getCurrentOption(optionsMap[identity], !optionsMap[identity] ? identity : undefined), groupIdentity: groupInfo.group_identity})" class="close-icon"><CircleCloseFilled /></el-icon>
            </div>
            </div>
          </template>
        </div>
      </div>
      <div class="tips error" v-if="groupInfo.errorMsg">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="groupInfo.errorMsg"
          placement="top"
        >
          <el-icon :size="20"><Warning /></el-icon> 
        </el-tooltip>
      </div>
      <!-- 编辑按钮 -->
      <el-icon 
        @click.stop="editGroupBtn"
        :size="20" 
        class="edit-icon"><Edit /></el-icon>
      <!-- 关闭按钮 -->
      <el-icon 
        class="close-btn" 
        :size="20"
        @click.stop="closeGroupBtn"
        ><CircleClose /></el-icon> 
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { lotteryDataStore } from '../../../../../store'
const basicData = lotteryDataStore();
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  groupInfo: {
    type: Object,
    default: () => {
      return { groupNums: 1 }
    }
  },
  showType: {
    default: 0,
    type: Number
  },
  length: {
    default: 0,
    type: Number
  },
  optionsMap: {
    type: Object,
    default: () => {
      return {}
    }
  }
});
const classname = computed(() => {
  return `column${props.length < 4 ? props.length : 4} isputarea`
})
const emit = defineEmits(['optionCancel', 'groupCancel'])
const closeOptionBtn = (emitObj) => {
  emit('optionCancel', emitObj)
}
const closeGroupBtn = () => {
  emit('groupCancel', props.groupInfo)
}
const editGroupBtn = () => {
  emit('editGroupBtn', props.groupInfo)
}
const getCurrentOption = (option, identity) => {
  const obj = option || {
    error_identity: identity
  }
  return obj
}
</script>

<style lang="scss" scoped>
.qd-optiongroup {
  font-size: 14px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}
.column1 {
  width: 100%;
  min-height: 116px;
}
.column2 {
  width: calc((100% - 9px) / 2);
  min-height: 116px;
  margin-right: 9px;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.column3 {
  width: calc((100% - 16px) / 3);
  min-height: 116px;
  margin-right: 8px;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.column4 {
  width: calc((100% - 24px) / 4);
  min-height: 78px;
  margin-right: 8px;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
.qd-optiongroup-item {
  border-radius: 8px;
  height: 100%;
  // overflow: hidden;
}

.isputarea + .qd-optiongroup {
  // margin-right: 0 !important;
}

.common {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  color: #3a414a;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #dadbde;
  position: relative;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    // overflow: hidden;
    &-title {
      text-align: center;
      padding: 4px;
      border-bottom: 1px #f0f0f0 solid;
      width: 98%;
      font-size: 14px;
      word-wrap: break-word;
    }
    &-tags {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      // overflow: hidden;
      .tags-drag-tips {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #abb5c1;
      }
      .group-option-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin: 8px;
        // overflow: auto;
      }
      .group-option-item {
        font-size: 10px;
        color: #717981;
        padding: 0 4px;
        background: #f5f6f6;
        border-radius: 2px;
        white-space: wrap;
        // overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 8px 4px 0;
        height: fit-content;
        position: relative;
        ::v-deep(p) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .is-related {
        background-color: #fff;
        border: 1px solid green;
        &.no-can-selected {
          border: 1px solid orange;
        }
      }
      .close-icon {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        font-size: 16px;
        cursor: pointer;
      }
      .image-item-container {
        display: flex;
        .group-option-image-item {
          width: 24px;
          height: 24px;
          margin: 0 4px 4px 0;
          &:last-child {
            margin: 0 0 4px 0;
          }
          img {
            object-fit: scale-down;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .edit-icon {
    position: absolute;
    right: 40px;
    top: 0;
    transform: translate(50%, -50%);
    cursor: pointer;
  }
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
    cursor: pointer;
  }
  &.has-error {
    .close-btn {
      color: red;
    }
  }
  .tips.error {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0%);
    color: red;
    cursor: pointer;
  }

  .information {
    background: #7291ff;
    color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
  }
  .info-empty {
    background: #a7c8ff;
    i {
      display: none;
    }
  }
  .info-nobg {
    background: transparent;
    color: #abb5c1;
  }
}

.put-area {
  color: #717981;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  border: 2px dashed #9da4ad;
  opacity: 0.7;
  i {
    color: #b4bbc2;
    font-size: 34px;
  }
}

.dragover-tips {
  display: none;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  font-size: 11px;
  color: #abb5c1;
  padding-top: 4px;
}
</style>
