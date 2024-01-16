import { defineStore } from "pinia";
import bus from '../libs/bus'
export const lotteryDataStore = defineStore('LOTTERY', {
  state: () => {
    return {
      prizeConfig: {},
      prizes: [], //奖品信息
      users: [], //所有人员
      luckyUsers: {}, //已中奖人员
      company: '',
      totalCards: 0, // 总牌数
      eachCount: [18, 10, 1, 1, 5, 3, 2, 10], // 每次抽取的奖品个数
      currentPrizeIndex: 0, // 当前抽取的奖品
      currentPrize: {}, // 当前抽取的奖品
      isAnimating: false, // 是否正在抽奖
      resolution: 1.1, // 当前圆球比例
      rotateLoop: 1000, // 是否循环旋转
      rotateTime: 3000, // 旋转时间
      lasetPrizeIndex: 0, // 上一次抽奖的奖品 - 切换奖项之后就会变化
      lastTimePrizeIndex: 0, // 上一次抽奖的奖品 - 真正开始下一个奖项抽奖才会变化
      isNextPrize: false, // 是否下一次抽奖
      isLotting: false, // 是否正在抽奖
      currentLuckys: [], // 当前中奖用户
      isShowLuckyUser: false, // 是否显示中奖用户
      isContinueLottery: false, // 是否继续抽奖
      isReLottery: false, // 是否重新抽奖
      isShowPrizeMark: false, // 是否显示奖品
      isEnterLottery: false, // 是否进入抽奖
      isEnterBgWall: false, // 是否进入背景墙
      isShowAllLuckyUser: false,// 是否显示全部中奖用户
      
      secretUsers: [], // 保密用户 - 内置中奖名单
      dialogStyle: {
        top: '4vh',
        left: '15%'
      },
      otherResource:{
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
        }
      },
      currentLotteryGroup: {},
      memberListData: {}, // 抽奖人员名单数据 -- 未中奖人员
      originMemberListData: {}, // 原数据名单
      groupList: [], // 人员名单配置
      textMappingConfig: {
        // 控制按钮文案
        enter: {
          defaultText: '进入抽奖',
          chineseText: '进入抽奖',
          otherLanguagesText: 'masuk undian'
        },
        showPrize: {
          defaultText: '显示奖品',
          chineseText: '显示奖品',
          otherLanguagesText: '奖项 undian selanjutnya'
        },
        lottery: {
          defaultText: '开始抽奖',
          chineseText: '开始抽奖',
          otherLanguagesText: 'begin lottery'
        },
        reLottery: {
          defaultText: '重新抽奖',
          chineseText: '重新抽奖',
          otherLanguagesText: 'reLottery'
        },
        continueLottery: {
          defaultText: '继续抽奖',
          chineseText: '继续抽奖',
          otherLanguagesText: 'continue lottery'
        },
        lotteryEnd: {
          defaultText: '结束抽奖',
          chineseText: '结束抽奖',
          otherLanguagesText: 'lottery over'
        },
        lastRoundLottery: {
          defaultText: '重新抽取上一轮',
          chineseText: '重新抽取上一轮',
          otherLanguagesText: 'last round lottery'
        },
        showAllLucks: {
          defaultText: '展示全部中奖名单',
          chineseText: '展示全部中奖名单',
          otherLanguagesText: 'daftar nama pemenang'
        },
        bgWallClick: {
          defaultText: '背景墙',
          chineseText: '背景墙',
          otherLanguagesText: 'bgImg'
        },
        toggleScreenImg: {
          defaultText: '屏幕墙',
          chineseText: '屏幕墙',
          otherLanguagesText: 'screenImg'
        },
        showLotteryClick: {
          defaultText: '展示抽奖',
          chineseText: '展示抽奖',
          otherLanguagesText: 'show lottery'
        },
        toggleSettingUsersSetting: {
          defaultText: '名单设置',
          chineseText: '名单设置',
          otherLanguagesText: 'user setting'
        },
        toggleSettingPrizeSetting: {
          defaultText: '奖项设置',
          chineseText: '奖项设置',
          otherLanguagesText: 'prize setting'
        },
        toggleSettingCardSetting: {
          defaultText: '卡片设置',
          chineseText: '卡片设置',
          otherLanguagesText: 'card setting'
        },
        toggleSettingBallSetting: {
          defaultText: '球体设置',
          chineseText: '球体设置',
          otherLanguagesText: 'ball setting'
        },
        toggleSettingTextMappingConfig: {
          defaultText: '文案设置',
          chineseText: '文案设置',
          otherLanguagesText: 'control button setting'
        },
        toggleSettingOtherResourceSetting: {
          defaultText: '其他资源设置',
          chineseText: '其他资源设置',
          otherLanguagesText: 'other resource setting'
        },
        toggleSettingSecretSetting: {
          defaultText: '',
          chineseText: '内置中奖名单',
          otherLanguagesText: '内置中奖名单'
        },
        toggleSettingCheckFileList: {
          defaultText: '名单文件列表',
          chineseText: '名单文件列表',
          otherLanguagesText: 'open file list'
        },
        showAllLuckyUser: {
          defaultText: '展示中奖名单',
          chineseText: '展示中奖名单',
          otherLanguagesText: 'show all lucky user'
        },
        exportData: {
          defaultText: '导出抽奖结果',
          chineseText: '导出抽奖结果',
          otherLanguagesText: 'export data'
        },
        resetCurrentPrizeBtnClick: {
          defaultText: '重置当前/上一轮奖项中奖名单',
          chineseText: '重置当前/上一轮奖项中奖名单',
          otherLanguagesText: 'reset current/last prize'
        },
        resetBtnClick: {
          defaultText: '重置所有中奖名单',
          chineseText: '重置所有中奖名单',
          otherLanguagesText: 'reset all lucky user'
        },
        enterFullScreen: {
          defaultText: '全屏',
          chineseText: '全屏',
          otherLanguagesText: 'fullscreen'
        },
        quitFullScreen: {
          defaultText: '退出全屏',
          chineseText: '退出全屏',
          otherLanguagesText: 'quit fullscreen'
        },
        musicBtn: {
          defaultText: '',
          chineseText: '音乐',
          otherLanguagesText: 'music'
        },

        // 其他文案
        cardConfiguration: {
          defaultText: '',
          chineseText: '卡片配置',
          otherLanguagesText: ''
        },
        sphereActionSettings: {
          defaultText: '',
          chineseText: '球体相关动作设置',
          otherLanguagesText: ''
        },
        fileList: {
          defaultText: '',
          chineseText: '文件列表',
          otherLanguagesText: ''
        },
        otherResourcesSettings: {
          defaultText: '',
          chineseText: '其他资源设置',
          otherLanguagesText: ''
        },
        prizeConfiguration: {
          defaultText: '',
          chineseText: '奖项配置',
          otherLanguagesText: ''
        },
        settings: {
          defaultText: '',
          chineseText: '设置',
          otherLanguagesText: ''
        },
        textSettings: {
          defaultText: '',
          chineseText: '文案设置',
          otherLanguagesText: ''
        },
        userSettings: {
          defaultText: '',
          chineseText: '名单设置',
          otherLanguagesText: ''
        },
        confirm: {
          defaultText: '',
          chineseText: '确认',
          otherLanguagesText: ''
        },
        cancel: {
          defaultText: '',
          chineseText: '取消',
          otherLanguagesText: ''
        },
        settingSuccess: {
          defaultText: '',
          chineseText: '设置成功',
          otherLanguagesText: ''
        },
        settingFailure: {
          defaultText: '',
          chineseText: '设置失败',
          otherLanguagesText: ''
        },
        noConfigurationChanges: {
          defaultText: '',
          chineseText: '没有修改过配置',
          otherLanguagesText: ''
        },
        ballProportion: {
          defaultText: '',
          chineseText: '圆球比例',
          otherLanguagesText: ''
        },
        rotateCycle: {
          defaultText: '',
          chineseText: '是否循环旋转',
          otherLanguagesText: ''
        },
        lotteryRotationTime: {
          defaultText: '',
          chineseText: '抽奖旋转时间(毫秒ms)',
          otherLanguagesText: ''
        },
        autoRotationTime: {
          defaultText: '',
          chineseText: '自动旋转时间(毫秒ms)',
          otherLanguagesText: ''
        },
        distanceFromLeft: {
          defaultText: '',
          chineseText: '相对左侧距离',
          otherLanguagesText: ''
        },
        cardArrangementBeforeLottery: {
          defaultText: '',
          chineseText: '抽奖前卡片排列及位置',
          otherLanguagesText: ''
        },
        cannotModifyAfterEnter: {
          defaultText: '',
          chineseText: '已进入抽奖，不能修改',
          otherLanguagesText: ''
        },
        winningCardArrangement: {
          defaultText: '',
          chineseText: '中奖-卡片排列',
          otherLanguagesText: ''
        },
        columnBasedArrangement: {
          defaultText: '',
          chineseText: '以"列"为基准排列',
          otherLanguagesText: ''
        },
        rowBasedArrangement: {
          defaultText: '',
          chineseText: '以"行"为基准排列',
          otherLanguagesText: ''
        },
        fixedRowsColumns: {
          defaultText: '',
          chineseText: '固定行列',
          otherLanguagesText: ''
        },
        numberOfColumns: {
          defaultText: '',
          chineseText: '列数',
          otherLanguagesText: ''
        },
        numberOfRows: {
          defaultText: '',
          chineseText: '行数',
          otherLanguagesText: ''
        },
        rowSpacing: {
          defaultText: '',
          chineseText: '行间距',
          otherLanguagesText: ''
        },
        columnSpacing: {
          defaultText: '',
          chineseText: '列间距',
          otherLanguagesText: ''
        },
        basicCardStyleSettings: {
          defaultText: '',
          chineseText: '基础-卡片样式设置',
          otherLanguagesText: ''
        },
        winningCardStyleSettings: {
          defaultText: '',
          chineseText: '中奖-卡片样式设置',
          otherLanguagesText: ''
        },
        distanceFromLeftPosition: {
          defaultText: '',
          chineseText: '距离左侧位置',
          otherLanguagesText: ''
        },
        distanceFromTopPosition: {
          defaultText: '',
          chineseText: '距离顶部位置',
          otherLanguagesText: ''
        },
        scaling: {
          defaultText: '',
          chineseText: '缩放',
          otherLanguagesText: ''
        },
        cardWidth: {
          defaultText: '',
          chineseText: '卡片宽度',
          otherLanguagesText: ''
        },
        cardHeight: {
          defaultText: '',
          chineseText: '卡片高度',
          otherLanguagesText: ''
        },
        cardLogoImage: {
          defaultText: '',
          chineseText: '卡牌图片logo',
          otherLanguagesText: ''
        },
        logoImageWidth: {
          defaultText: '',
          chineseText: '图片logo宽度',
          otherLanguagesText: ''
        },
        logoImageHeight: {
          defaultText: '',
          chineseText: '图片logo高度',
          otherLanguagesText: ''
        },
        logoDistanceFromTop: {
          defaultText: '',
          chineseText: 'logo距离顶部位置',
          otherLanguagesText: ''
        },
        nameDistanceFromTop: {
          defaultText: '',
          chineseText: '名称距离顶部位置',
          otherLanguagesText: ''
        },
        nameFontSize: {
          defaultText: '',
          chineseText: '名称字体大小',
          otherLanguagesText: ''
        },
        otherInfoDistanceFromBottom: {
          defaultText: '',
          chineseText: '其他信息距离底部位置',
          otherLanguagesText: ''
        },
        otherInfoFontSize: {
          defaultText: '',
          chineseText: '其他信息字体大小',
          otherLanguagesText: ''
        },
        openFolder: {
          defaultText: '',
          chineseText: '打开文件夹',
          otherLanguagesText: ''
        },
        openFile: {
          defaultText: '',
          chineseText: '打开文件',
          otherLanguagesText: ''
        },
        opening: {
          defaultText: '',
          chineseText: '打开中...',
          otherLanguagesText: ''
        },
        backgroundImageWall: {
          defaultText: '',
          chineseText: '背景墙图片',
          otherLanguagesText: ''
        },
        screenWallImage: {
          defaultText: '',
          chineseText: '屏幕墙图片',
          otherLanguagesText: ''
        },
        musicFile: {
          defaultText: '',
          chineseText: '音乐文件',
          otherLanguagesText: ''
        },
        uploadMusic: {
          defaultText: '',
          chineseText: '请上传音乐',
          otherLanguagesText: ''
        },
        changeMusic: {
          defaultText: '',
          chineseText: '更换音乐',
          otherLanguagesText: ''
        },
        uploadImage: {
          defaultText: '',
          chineseText: '请上传图片',
          otherLanguagesText: ''
        },
        uploadAudio: {
          defaultText: '',
          chineseText: '请上传音频',
          otherLanguagesText: ''
        },
        addNewPrize: {
          defaultText: '',
          chineseText: '新增奖项',
          otherLanguagesText: ''
        },
        editPrize: {
          defaultText: '',
          chineseText: '编辑奖项',
          otherLanguagesText: ''
        },
        prizeNameCannotModify: {
          defaultText: '',
          chineseText: '该奖项已有中奖名单，名称不能修改',
          otherLanguagesText: ''
        },
        previousPrizeAlreadyLucky: {
          defaultText: '',
          chineseText: '前面奖项已有中奖名单，抽取数和图片不能修改',
          otherLanguagesText: ''
        },
        name: {
          defaultText: '',
          chineseText: '名称',
          otherLanguagesText: ''
        },
        otherLanguageName: {
          defaultText: '',
          chineseText: '其他语言名称',
          otherLanguagesText: ''
        },
        totalDraws: {
          defaultText: '',
          chineseText: '抽取总数',
          otherLanguagesText: ''
        },
        drawsPerRound: {
          defaultText: '',
          chineseText: '每轮抽取数',
          otherLanguagesText: ''
        },
        image: {
          defaultText: '',
          chineseText: '图片',
          otherLanguagesText: ''
        },
        selectOnePrize: {
          defaultText: '',
          chineseText: '可选择一个奖项，同步相同配置',
          otherLanguagesText: ''
        },
        clear: {
          defaultText: '',
          chineseText: '清空',
          otherLanguagesText: ''
        },
        noAvailablePrizes: {
          defaultText: '',
          chineseText: '暂无可选奖项',
          otherLanguagesText: ''
        },
        enterDrawQuantity: {
          defaultText: '',
          chineseText: '请输入抽取数量',
          otherLanguagesText: ''
        },
        cannotExceedTotalDraws: {
          defaultText: '',
          chineseText: '不能大于抽取总数',
          otherLanguagesText: ''
        },
        enterTotalDraws: {
          defaultText: '',
          chineseText: '请输入抽取总数',
          otherLanguagesText: ''
        },
        cannotBeLessThanPerRoundDraws: {
          defaultText: '',
          chineseText: '不能小于每轮抽取数',
          otherLanguagesText: ''
        },
        enterName: {
          defaultText: '',
          chineseText: '请输入名称',
          otherLanguagesText: ''
        },
        uploadImagePrompt: {
          defaultText: '',
          chineseText: '请上传图片',
          otherLanguagesText: ''
        },
        noPrizesAvailable: {
          defaultText: '',
          chineseText: '暂无奖项，请去“奖项设置”配置',
          otherLanguagesText: ''
        },
        confirmAssociation: {
          defaultText: '',
          chineseText: '确认关联',
          otherLanguagesText: ''
        },
        cancel: {
          defaultText: '',
          chineseText: '取消',
          otherLanguagesText: ''
        },
        uploadInternalLuckyList: {
          defaultText: '',
          chineseText: '上传内置中奖人员名单',
          otherLanguagesText: ''
        },
        add: {
          defaultText: '',
          chineseText: '添加',
          otherLanguagesText: ''
        },
        noInternalPersons: {
          defaultText: '',
          chineseText: '暂无内置人员，可添加或上传',
          otherLanguagesText: ''
        },
        selectGroupAndOption: {
          defaultText: '',
          chineseText: '请选择关联分组和选项',
          otherLanguagesText: ''
        },
        uploadFailed: {
          defaultText: '',
          chineseText: '上传失败',
          otherLanguagesText: ''
        },
        addPerson: {
          defaultText: '',
          chineseText: '添加人员',
          otherLanguagesText: ''
        },
        leftBarListWidth: {
          defaultText: '',
          chineseText: '左bar列表总体宽度',
          otherLanguagesText: ''
        },
        prizeBoxWidth: {
          defaultText: '',
          chineseText: '奖项盒子宽度',
          otherLanguagesText: ''
        },
        minimumPrizeBoxHeight: {
          defaultText: '',
          chineseText: '奖项盒子最小高度',
          otherLanguagesText: ''
        },
        spaceBetweenPrizes: {
          defaultText: '',
          chineseText: '奖项之间间距',
          otherLanguagesText: ''
        },
        prizeFontSize: {
          defaultText: '',
          chineseText: '奖项字体大小',
          otherLanguagesText: ''
        },
        progressBarHeight: {
          defaultText: '',
          chineseText: '进度条高度',
          otherLanguagesText: ''
        },
        progressBarFontSize: {
          defaultText: '',
          chineseText: '进度条字体大小',
          otherLanguagesText: ''
        },
        imagePlaceholderWidth: {
          defaultText: '',
          chineseText: '图片占位宽度',
          otherLanguagesText: ''
        },
        imagePlaceholderHeight: {
          defaultText: '',
          chineseText: '图片占位高度',
          otherLanguagesText: ''
        },
        currentPrizeScale: {
          defaultText: '',
          chineseText: '当前奖项放大比例',
          otherLanguagesText: ''
        },
        groupNameExists: {
          defaultText: '',
          chineseText: '该分组名称，已存在在分组中',
          otherLanguagesText: ''
        },
        uploadPersonList: {
          defaultText: '',
          chineseText: '请上传人员名单',
          otherLanguagesText: ''
        },
        associatePrizeHere: {
          defaultText: '',
          chineseText: '关联奖项到此',
          otherLanguagesText: ''
        },
        associatePersonHere: {
          defaultText: '',
          chineseText: '关联人员到此',
          otherLanguagesText: ''
        },
        alreadyAssociated: {
          defaultText: '',
          chineseText: '已关联',
          otherLanguagesText: ''
        },
        generatedWinnerListCannotUnassociate: {
          defaultText: '',
          chineseText: '产生了中奖名单，不可取消关联',
          otherLanguagesText: ''
        },
        alreadyInWinnerListCannotUnassociate: {
          defaultText: '',
          chineseText: '已在中奖名单，不可取消关联',
          otherLanguagesText: ''
        },
        includeTextUsers: {
          defaultText: '',
          chineseText: '临时添加人员',
          otherLanguagesText: ''
        },
        excludeTextUsers: {
          defaultText: '',
          chineseText: '排除人员',
          otherLanguagesText: ''
        }
      },
      ballConfig: {
        resolution: 1.1, // 当前圆球比例
        rotateLoop: 1000, // 是否循环旋转
        rotateTime: 3000, // 旋转时间,
        autoRotateTime: 60000, // 自动旋转时间
        ballRelativeLeftDistance: '27vw', // 相对左侧距离
      },
      prizesBarStyle: { // 奖品栏样式
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
      },
      beforeLotteryLayout: {
        columnCount: 17, // 列数
        rowCount: 10, // 行数
        rowGap: '10px', // 行间距
        columnGap: '10px', // 列间距
        scale: 0.5, // 容器卡片缩放比例
        top: '17vh',
        left: '27vw',
      },
      luckysRowColObj: {
        rowCount: 5,
        columnCount: 2,
        rowGap: '10px',
        columnGap: '10px', // 列间距
        type: 1 // 1 以列 为基准排列 2 以行 为基准排列 3 固定行列
      }, // 中奖行列对象
      luckyCardConfigStyle: {
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
      },
      cardConfigStyle: {
        cardWidth: "3vw", // 抽奖牌宽度
        cardHeight: "6vh", // 抽奖牌高度
        logo: "",
        companyTop: '0.05vh', // 公司logo距离顶部的距离
        companyFontSize: '8px', // 公司logo字体大小
        nameTop: '1.5vh', // 名称距离顶部的距离
        nameFontSize: '8px', // 名称字体大小
        detailsBottom: '0.1vh', // 详情距离底部的距离
        detailsFontSize: '8px', // 详情字体大小
        imgWidth: '100%',
        imgHeight: '10px'
      }
    }
  },

  getters: {

  },

  actions: {
    setPrizeConfig (config) {  // 注意，这里就不要写箭头函数了，不然 this 指向会出问题。
      this.prizeConfig = config
    },

    async initConfigData () {
      const usersData = await myApi.getStaticUsersData();
      const config = await myApi.getTempData();
      if (config) {
        // lotteryData.setPrizeConfig(config.prizeConfig);
        this.prizeConfig = config.prizeConfig
        this.prizes = config.prizeConfig.prizes;
        Object.assign(this, config.prizeConfig);
      }
      // 抽奖用户
      // Object.assign(this, usersData);
      this.memberListData = config.curData
      this.originMemberListData = usersData;
      // 总牌数
      this.totalCards = this.beforeLotteryLayout.columnCount * this.beforeLotteryLayout.rowCount;

      // 每次抽取的奖品个数
      this.eachCount = this.prizes.map(prize => prize.eachCount);
      // 中奖用户
      this.luckyUsers = config.luckyData;

      // 球体距离左边间距
      window.ballRelativeLeftDistance = this.ballConfig.ballRelativeLeftDistance
      // 读取当前已设置的抽奖结果
      // 设置当前抽奖index
      let prizeIndex = this.prizes.length - 1;
      this.currentPrize = undefined;
      this.currentPrizeIndex = -1;
      this.lastTimePrizeIndex = 0;
      for (; prizeIndex > -1; prizeIndex--) {
        if (
          this.luckyUsers[this.prizes[prizeIndex].type] &&
          this.luckyUsers[this.prizes[prizeIndex].type].length >=
            this.prizes[prizeIndex].count
        ) {
          continue;
        }
        this.currentPrizeIndex = prizeIndex;
        this.lasetPrizeIndex = prizeIndex;
        this.lastTimePrizeIndex = prizeIndex;
        if (prizeIndex !== this.prizes.length - 1) {
          this.lastTimePrizeIndex = this.prizes.length - 1;
        }
        this.currentPrize = this.prizes[this.currentPrizeIndex];
        break;
      }

      bus.emit('initConfigDataEnd')
      return this
    }
  }
})
