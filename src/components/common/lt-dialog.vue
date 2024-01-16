<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    class="lt-dialog dialog level-dialog"
    :close-on-click-modal="false"
    :show-close="false">
    <template #header>
      <slot name="title"><span class="title-text">{{ title }}</span></slot>
      <div class="title-btn confirm-btn" type="confirm" @click="confirm">
        <div class="label label-confirm"></div>
        {{ textMappingConfig.confirm.chineseText + ' ' + textMappingConfig.confirm.otherLanguagesText }}
      </div>
      <div class="title-btn cancel-btn" type="cancel"  @click="cancel" >
        <div class="label label-cancel"></div>
        {{ textMappingConfig.cancel.chineseText + ' ' + textMappingConfig.cancel.otherLanguagesText }}
      </div>
    </template>
    <slot></slot>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { lotteryDataStore } from '../../store'
const basicData = lotteryDataStore();
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '50%'
  }
});
const emit = defineEmits(['close']);
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set() {
    emit('close', false)
  }
})
const cancel = () => {
  emit('close', false)
}
const confirm = () => {
  emit('confirm')
}
</script>

<style lang="scss">
.lt-dialog.dialog.level-dialog {
  &.el-dialog {
    border-radius: 10px;
    box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.20); 
    .el-dialog__header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 48px;
      padding: 0 24px !important;
      margin: 0;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      cursor: default;
    }
  }
  
  .el-dialog__body {
    background-color: #F5F7FA;
    padding: 8px 24px;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding-top: 20px;
    height: auto;
  }
}
</style>