
const createBallTipsDom = (basicData) => {
  let ballTipsBoxDom = document.querySelector('#ball-tips-box');
  if (!ballTipsBoxDom) {
    let dom = document.createElement("div");
    // let bottomCardDom = document.querySelector("#card-0");
    dom.id = "ball-tips-box";
    dom.style = `
      opacity: 1;
      position: fixed;
      width: 60vw;
      height: calc(100vh - 120px);
      left: 30vw;
      bottom: 120px;
      z-index: -10;
    `
    document.body.appendChild(dom);
    ballTipsBoxDom = dom
  }
  return ballTipsBoxDom;
}

const getCurrentMember = (basicData) => {
  // if (basicData.isEnterLottery) return []
  const memberListData = basicData.memberListData
  const currentLotteryGroup = basicData.currentLotteryGroup
  // console.log(memberListData, currentLotteryGroup)
  
  let resultMember = []
  if (currentLotteryGroup && currentLotteryGroup.group_identity) {
    resultMember = memberListData[currentLotteryGroup.group_identity] || []
  }
  return resultMember
}
const openHelp = (basicData) => {
  let steps = [
    {
      title: '欢迎使用抽奖系统',
      intro: '欢迎使用抽奖系统! 👋'
    },
  ]
  const tipsDom = document.querySelector('.prizes-empty-tips');
  const cardEmptyTipsDom = document.querySelector('.card-empty-tips');
  const bottomBarDom = document.querySelector('.bottom-bar');
  const quickOperationDom = document.querySelector('.bottom-bar .quick-operation');
  const bottomBarSetting = document.querySelector('.bottom-bar .setting');
  const bottomBarOther = document.querySelector('.bottom-bar .other');
  const tipsBottomDom = document.querySelector('.tips-bottom');

  const prizeMessDom = document.querySelector('.prize-mess');
  const prizeListDom = document.querySelector('.prize-list')
  const screenCardDom = document.querySelector('.screen-card')
  const beginLotteryDom = document.querySelector('.begin-lottery') 

  let ballTipsBoxDom = null;
  let noTipsEmptyInScreen = false
  try {
  noTipsEmptyInScreen = !(basicData.prizes.length 
    && ((getCurrentMember(basicData).length <= 0 && basicData.currentPrize) || (!basicData.currentPrize && !basicData.isEnterLottery)))
  if (noTipsEmptyInScreen && basicData.isEnterLottery) {
      ballTipsBoxDom = createBallTipsDom();
    }
  } catch (error) {
    
  }
  if (tipsDom) {
    steps.push({
      element: tipsDom,
      intro: '这是屏幕提示'
    })
  }
  if (cardEmptyTipsDom && !noTipsEmptyInScreen) {
    steps.push({
      element: cardEmptyTipsDom,
      intro: '这是屏幕提示'
    })
  }
  if (prizeMessDom) {
    steps.push({
      element: prizeMessDom,
      intro: '当前奖品 名称、数量等信息'
    })
  }

  if (prizeListDom && basicData.prizes.length) {
    steps.push({
      element: prizeListDom,
      intro: '奖品列表，高亮 放大的为当前要抽取的奖品；颜色置灰的为已抽取完的奖品'
    })
  }

  if (ballTipsBoxDom) {
    steps.push({
      element: ballTipsBoxDom,
      intro: '抽奖人员名单 旋转球体'
    })
  }

  if (screenCardDom && noTipsEmptyInScreen && basicData.prizes.length) {
    steps.push({
      element: screenCardDom,
      intro: '人员名单卡片'
    })
  }
  
  if (beginLotteryDom && noTipsEmptyInScreen && basicData.prizes.length) {
    steps.push({
      element: beginLotteryDom,
      intro: '抽奖相关按钮'
    })
  }
  
  if (bottomBarDom) {
    steps.push( {
      title: '互动操作区',
      element: document.querySelector('.bottom-bar'),
      intro: `
              <ul>
                <li>1. 该程序能使用的功能</li>
                <li>2. 一些必用的设置需知道："奖项设置","名单设置","导出抽奖结果","全屏"</li>
              </ul>
            `
    })
  }
  if (quickOperationDom) {
    steps.push({
      title: '屏幕/背景图切换',
      element: document.querySelector('.bottom-bar .quick-operation'),
      intro: `
              <ul>
                <li>背景墙：该功能会把奖项和旋转人员名单隐藏，显示背景图</li>
                <li>屏幕墙：该功能会把背景图、奖项和旋转人员名单隐藏，显示在最上面；图片可和背景图一样，也可不一样，根据实际需求来使用</li>
                <li>展示奖项：该功能会显示出奖项和抽奖人员</li>
              </ul> 
            `
    })
  }
  if (bottomBarSetting) {
    steps.push({
      title: '抽奖设置',
      element: document.querySelector('.bottom-bar .setting'),
      intro: `
              <ul>
                    <li><strong style="color:red">奖项设置</strong>: 管理奖项设置。<br>
                            <ul>
                            <li><strong>功能</strong>:
                                    <ul>
                                    <li>增加奖项：添加新的奖项。</li>
                                    <li>删除奖项：移除现有的奖项。</li>
                                    <li>修改奖项：编辑现有奖项的名称或描述。</li>
                                    </ul>
                            </li>
                            </ul>
                    </li>
                    <li><strong style="color:red">名单设置</strong>: 用于管理参与抽奖的名单。</li> 
                    <li><strong>卡片设置</strong>: 管理显示卡片的设置。</li> 
                    <li><strong>球体设置</strong>: 定制球体效果的设置。</li> 
                    <li><strong>文案设置</strong>: 管理文案显示的设置。</li> 
                    <li><strong>其他资源设置</strong>: 管理其他资源的设置，（用于更换背景、屏幕图以及音乐文件）。</li> 
                    <li><strong>操作日志</strong>: 记录操作日志。</li> 
              </ul> 
            `
    })
  }
  if (bottomBarOther) {
    steps.push({
      title: '名单与导出',
      element: document.querySelector('.bottom-bar .other'),
      intro: `<ul>
                            <li><strong style="color:red">导出抽奖结果</strong>: 将抽奖结果导出为文件。</li>
                            <li><strong style="color:red">全屏</strong>: 展示界面全屏。</li>
                            <li><strong>文件列表</strong>: 查看上传的文件列表。</li> 
                            <li><strong>展示中奖名单</strong>: 展示当前中奖名单。</li> 
                            <li><strong>重置当前/上一轮奖项中奖名单</strong>: 重置当前或上一轮的中奖名单。</li> 
                            <li><strong>重置所有中奖名单</strong>: 重置所有中奖名单记录。</li> 
                    </ul>
            `
    })
  }

  if (tipsBottomDom) {
    steps.push({
      title: '隐藏操作区',
      element: document.querySelector('.tips-bottom'),
      intro: '可隐藏操作区, 避免影响抽奖操作'
    })
  }


  introJs()
    .setOptions({
      overlayOpacity: 0.9,
      exitOnOverlayClick: false,
      exitOnEsc: false,
      steps
    }) // 确认完毕之后执行的事件
    .onbeforeexit(() => {
      localStorage.setItem("isIntroFirstScreen", "true")
    })
    .start()
}
export default openHelp;