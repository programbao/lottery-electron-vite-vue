<template>
  <div
    class="qd-option-item"
    :class="{
      removeable: removeAble,
      'is-related': option.related_group,
      'no-can-selected': option.noCanSelected
    }"
  >
    <!--  文字样式  -->
    <i v-if="!removeAble" class="survey-iconfont icon-tuozhuai"></i>
    <div class="text" v-html="display.text"></div>
    <i v-if="removeAble" @click="$emit('remove')" class="survey-iconfont icon-xuanxiangfenzubiaoqian-guanbi"></i>
    <div class="related-txt" v-if="option.related_group && !option.noCanSelected">{{ textMappingConfig.alreadyAssociated.chineseText + ' ' + textMappingConfig.alreadyAssociated.otherLanguagesText }}</div>
    <div class="related-txt" v-if="option.noCanSelected">{{ textMappingConfig.generatedWinnerListCannotUnassociate.chineseText + ' ' + textMappingConfig.generatedWinnerListCannotUnassociate.otherLanguagesText }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { lotteryDataStore } from '../../../../../store'
const basicData = lotteryDataStore();
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const props = defineProps({
  option: {
    default: () => {},
    type: Object
  },
  removeAble: {
    default: false,
    type: Boolean
  },
  noZoom: {
    default: false,
    type: Boolean
  }
})
const display = computed(() => {
  return {
    text: props.option.option_value_html || props.option.option_value
  }
})
</script>

<style lang="scss" scoped>
.qd-option-item {
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
  i {
    padding-right: 4px;
    font-size: 16px;
    color: #9da4ad;
    line-height: 1;
  }
  .text {
    font-size: 14px;
    color: #3a414a;
    font-weight: 500;
    word-break: break-word;
  }

  .remove-container {
    line-height: 1;
    border-radius: 4px;
    background: #f0f0f0;
    position: absolute;
    right: 0;
    top: 0;
    i {
      margin: 0 !important;
      padding: 0 !important;
      color: #808b96;
    }
  }
}

.is-related {
  background-color: #fff;
  border: 1px solid green;
  .related-txt {
    position: absolute;
    top: 2px;
    right: 4px;
    color: green;
    font-size: 10px;
  }

}
.no-can-selected {
  border: 1px solid orange;
  .related-txt {
    color: orange;
  }
}
.images-container {
  width: calc((100% - 16px) / 3);
  padding: 4px;
  flex-direction: column;
  &:nth-child(3n) {
    margin-right: 0;
  }
  .flip-list-leave-active + &:nth-child(4n) {
    margin-right: 0;
  }
  .text-and-drag {
    margin-top: 4px;
    display: flex;
    width: 100%;
    .text {
      min-height: 16px;
      display: flex;
      align-items: center;
      font-size: 11px;
    }
    .drag-icon {
      max-height: 18px;
      min-height: 16px;
      display: flex;
      align-items: center;
    }
  }
}

.pure-images-container {
  padding: 4px 4px 4px 0;
  flex-direction: row;
  i {
    padding-right: 1px;
  }
  .image-content {
    flex: 1;
  }
}

.transition {
  transition: transform 0.3s ease-in;
}

.dragging-position {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5000;
}

.removeable {
  padding-right: 4px;
  i {
    color: #808b96;
    padding-left: 4px;
  }
}

.dragging-style {
  background: #ffffff;
  border: 2px solid #409eff;
  color: #101216;
  font-weight: 500;
  font-size: 16px;
  i {
    color: #409eff;
  }
}

.dragging-flag.images-container {
  width: calc((100% - 16px - 40px) / 3);
}

.removeable.images-container {
  padding: 4px;
}
</style>
