<template>
  <div class="card-setting">
    <!-- <div class="title">排列设置</div> -->
    <div class="lottery-layout">
      <div class="header-txt">{{ textMappingConfig.cardArrangementBeforeLottery.chineseText + ' ' + textMappingConfig.cardArrangementBeforeLottery.otherLanguagesText }}</div>
      <div class="tips" v-if="isEnterLottery">{{ textMappingConfig.cannotModifyAfterEnter.chineseText + ' ' + textMappingConfig.cannotModifyAfterEnter.otherLanguagesText }}</div> 
      <div class="layout-form">
        <el-form
          ref="form"
          :model="beforeLotteryLayout"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <el-form-item v-for="item in layoutFormArr" :key="item.field" :label="item.label" :prop="item.field">
            <el-input-number
              :disabled="isEnterLottery"
              v-if="item.type === 'number'"
              v-model="beforeLotteryLayout[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <el-input 
              v-else 
              :disabled="isEnterLottery"
              v-model="beforeLotteryLayout[item.field]"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="lottery-layout">
      <div class="header-txt">{{ textMappingConfig.winningCardArrangement.chineseText + ' ' + textMappingConfig.winningCardArrangement.otherLanguagesText }}</div>
      <div class="layout-form">
        <el-radio-group v-model="luckysRowColObj.type">
          <el-radio :label="1">{{ textMappingConfig.columnBasedArrangement.chineseText + ' ' + textMappingConfig.columnBasedArrangement.otherLanguagesText }}</el-radio>
          <el-radio :label="2">{{ textMappingConfig.rowBasedArrangement.chineseText + ' ' + textMappingConfig.rowBasedArrangement.otherLanguagesText }}</el-radio>
          <el-radio :label="3">{{ textMappingConfig.fixedRowsColumns.chineseText + ' ' + textMappingConfig.fixedRowsColumns.otherLanguagesText }}</el-radio>
        </el-radio-group>
        <div class="lucky-row-col">
          <el-form-item :label="textMappingConfig.numberOfColumns.chineseText + ' ' + textMappingConfig.numberOfColumns.otherLanguagesText" v-if="luckysRowColObj.type !== 2">
            <el-input-number
                v-model="luckysRowColObj.columnCount"
                :min="1"
                controls-position="right"
                size="large"
              />
          </el-form-item>
          <el-form-item :label="textMappingConfig.numberOfRows.chineseText + ' ' + textMappingConfig.numberOfRows.otherLanguagesText" v-if="luckysRowColObj.type !== 1">
            <el-input-number
                v-model="luckysRowColObj.rowCount"
                :min="1"
                controls-position="right"
                size="large"
              />
          </el-form-item>
        </div>

        <div class="lucky-row-col">
          <el-form-item :label="textMappingConfig.rowSpacing.chineseText + ' ' + textMappingConfig.rowSpacing.otherLanguagesText">
            <el-input
                v-model="luckysRowColObj.rowGap"
                :min="1"
                controls-position="right"
                size="large"
              />
          </el-form-item>
          <el-form-item :label="textMappingConfig.columnSpacing.chineseText + ' ' + textMappingConfig.columnSpacing.otherLanguagesText">
            <el-input
                v-model="luckysRowColObj.columnGap"
                :min="1"
                controls-position="right"
                size="large"
              />
          </el-form-item>
        </div>

      </div>
    </div>
    <div class="lottery-layout">
      <div class="header-txt">{{ textMappingConfig.basicCardStyleSettings.chineseText + ' ' + textMappingConfig.basicCardStyleSettings.otherLanguagesText }}</div>
      <div class="layout-form">
        <el-form
          ref="form"
          :model="cardConfigStyle"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <el-form-item v-for="item in cardStyleLabelArr" :key="item.field" :label="item.label" :prop="item.field">
            <el-input-number
              v-if="item.type === 'number'"
              v-model="cardConfigStyle[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <div v-else-if="item.type === 'img'" class="upload add" @click="importFile('cardConfigStyle')">
              <el-image
                v-if="cardConfigStyle.logo"
                :src="cardConfigStyle.logo"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
            <el-input 
              v-else 
              v-model="cardConfigStyle[item.field]"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="lottery-layout">
      <div class="header-txt">{{ textMappingConfig.winningCardStyleSettings.chineseText + ' ' + textMappingConfig.winningCardStyleSettings.otherLanguagesText }}</div>
      <div class="layout-form">
        <el-form
          ref="form"
          :model="luckyCardConfigStyle"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <el-form-item v-for="item in cardStyleLabelArr" :key="item.field" :label="item.label" :prop="item.field">
            <el-input-number
              v-if="item.type === 'number'"
              v-model="luckyCardConfigStyle[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <div v-else-if="item.type === 'img'" class="upload add" @click="importFile('luckyCardConfigStyle')">
              <el-image
                v-if="luckyCardConfigStyle.logo"
                :src="luckyCardConfigStyle.logo"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
            <el-input 
              v-else 
              v-model="luckyCardConfigStyle[item.field]"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
const textMappingConfig = computed(() => {
  return basicData.textMappingConfig
})
const layoutFormArr = ref([
  {
    label: textMappingConfig.value.numberOfRows.chineseText + ' ' + textMappingConfig.value.numberOfRows.otherLanguagesText,
    field: 'rowCount',
    type: 'number'
  },
  {
    label: textMappingConfig.value.numberOfColumns.chineseText + ' ' + textMappingConfig.value.numberOfColumns.otherLanguagesText,
    field: 'columnCount',
    type: 'number'
  },
  {
    label: textMappingConfig.value.distanceFromLeftPosition.chineseText + ' ' + textMappingConfig.value.distanceFromLeftPosition.otherLanguagesText,
    field: 'left',
  },
  {
    label: textMappingConfig.value.distanceFromTopPosition.chineseText + ' ' + textMappingConfig.value.distanceFromTopPosition.otherLanguagesText,
    field: 'top',
  },
  {
    label: textMappingConfig.value.rowSpacing.chineseText + ' ' + textMappingConfig.value.rowSpacing.otherLanguagesText,
    field: 'rowGap',
  },
  {
    label: textMappingConfig.value.columnSpacing.chineseText + ' ' + textMappingConfig.value.columnSpacing.otherLanguagesText,
    field: 'columnGap'
  },
  {
    label: textMappingConfig.value.scaling.chineseText + ' ' + textMappingConfig.value.scaling.otherLanguagesText,
    field: 'scale',
    type: 'number',
    step: '0.1'
  }
])
const cardStyleLabelArr = ref([
  {
    label: textMappingConfig.value.cardWidth.chineseText + ' ' + textMappingConfig.value.cardWidth.otherLanguagesText,
    field: 'cardWidth',
  },
  {
    label: textMappingConfig.value.cardHeight.chineseText + ' ' + textMappingConfig.value.cardHeight.otherLanguagesText,
    field: 'cardHeight',
  },
  {
    label: textMappingConfig.value.cardLogoImage.chineseText + ' ' + textMappingConfig.value.cardLogoImage.otherLanguagesText,
    field: 'logo',
    type: 'img',
  },
  {
    label: textMappingConfig.value.logoImageWidth.chineseText + ' ' + textMappingConfig.value.logoImageWidth.otherLanguagesText,
    field: 'imgWidth',
  },
  {
    label: textMappingConfig.value.logoImageHeight.chineseText + ' ' + textMappingConfig.value.logoImageHeight.otherLanguagesText,
    field: 'imgHeight',
  },
  {
    label: textMappingConfig.value.logoDistanceFromTop.chineseText + ' ' + textMappingConfig.value.logoDistanceFromTop.otherLanguagesText,
    field: 'companyTop',
  },
  {
    label: textMappingConfig.value.nameDistanceFromTop.chineseText + ' ' + textMappingConfig.value.nameDistanceFromTop.otherLanguagesText,
    field: 'nameTop',
  },
  {
    label: textMappingConfig.value.nameFontSize.chineseText + ' ' + textMappingConfig.value.nameFontSize.otherLanguagesText,
    field: 'nameFontSize',
  },
  {
    label: textMappingConfig.value.otherInfoDistanceFromBottom.chineseText + ' ' + textMappingConfig.value.otherInfoDistanceFromBottom.otherLanguagesText,
    field: 'detailsBottom',
  },
  {
    label: textMappingConfig.value.otherInfoFontSize.chineseText + ' ' + textMappingConfig.value.otherInfoFontSize.otherLanguagesText,
    field: 'detailsFontSize',
  }
])
const beforeLotteryLayout = ref({
  rowCount: 3,
  rowCount: 3,
  rowGap: '10px', // 行间距
  columnGap: '10px', // 列间距
  scale: 1, 
  left: 10,
  top: 10
})
const cardConfigStyle = ref({
  cardWidth: "3vw", // 抽奖牌宽度
  cardHeight: "6vh", // 抽奖牌高度
  logo: "",
  companyTop: '0.05vh', // 公司logo距离顶部的距离
  companyFontSize: 8, // 公司logo字体大小
  nameTop: '1.5vh', // 名称距离顶部的距离
  nameFontSize: 8, // 名称字体大小
  detailsBottom: '0.1vh', // 详情距离底部的距离
  detailsFontSize: 8, // 详情字体大小
  imgWidth: '100%',
  imgHeight: '10px'
})
const luckyCardConfigStyle = ref({
  cardWidth: "16vw", // 抽奖牌宽度
  cardHeight: "23vh", // 抽奖牌高度
  logo: "",
  companyTop: '19px', // 公司logo距离顶部的距离
  companyFontSize: '16px', // 公司logo字体大小
  nameTop: '7vh', // 名称距离顶部的距离
  nameFontSize: '18px', // 名称字体大小
  detailsBottom: '1vh', // 详情距离底部的距离
  detailsFontSize: '18px', // 详情字体大小
  imgWidth: '100%',
  imgHeight: '10px'
})
const luckysRowColObj = ref({
  rowCount: 5,
  columnCount: 2,
  rowGap: '10px',
  columnGap: '10px',
  type: 1 // 1 以列 为基准排列 2 以行 为基准排列 3 固定行列
})
const importFile = async (key) => {
  let { fileUrl } = await myApi.importFile('other_file', JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'bmp']));
  if (fileUrl) {
    if (key === 'luckyCardConfigStyle') {
      luckyCardConfigStyle.value.logo = fileUrl
    } else {
      cardConfigStyle.value.logo = fileUrl
    }
  }
}
const isEnterLottery = computed(() => {
  return basicData.isEnterLottery
})
onMounted(() => {
  beforeLotteryLayout.value = JSON.parse(JSON.stringify(basicData.beforeLotteryLayout))
  cardConfigStyle.value = JSON.parse(JSON.stringify(basicData.cardConfigStyle))
  luckyCardConfigStyle.value = JSON.parse(JSON.stringify(basicData.luckyCardConfigStyle))
  luckysRowColObj.value = JSON.parse(JSON.stringify(basicData.luckysRowColObj))
})
// 暴露属性
defineExpose({
  beforeLotteryLayout,
  cardConfigStyle,
  luckyCardConfigStyle,
  luckysRowColObj
})
</script>

<style lang="scss" scoped>
.card-setting {
  .tips {
    color: orange;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .title {
    font-weight: 500;
    font-size: 14px;
    text-align: left;
    padding-bottom: 10px;
  }
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
    .upload {
      // margin: 0.90%;
      width: 100%;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      position: relative;
      line-height: 28px;
      height: 28px;
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
      font-size: 20px;
      font-weight: lighter;
      cursor: pointer;
    }
    .lucky-row-col {
      display: flex;
      justify-content: center;
      margin-top: 17px;
      .el-form-item {
        margin-bottom: 0;
        margin: 0 20px;
      }
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
</style>
<style lang="scss">
.layout-form {
  .el-input-group__append {
    padding: 0 10px;
  } 
}
</style>