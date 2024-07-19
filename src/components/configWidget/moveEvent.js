
// let targetEl = {};
// // targetEl.style.left = '40%'
// // targetEl.style.top = '15vh'
// let downPositionStartX = 0
// let downPositionStartY = 0
// let downPositionLeft = 0
// let downPositionTop = 0
// let el = null
// let basicData = {};
// let dialogKeyStr = '';
// 以下事件是拖动element-ui dialog功能
export const initMoveEvent = (storeObj, dialogKey) => {
  let targetEl = {};
  let downPositionStartX = 0
  let downPositionStartY = 0
  let downPositionLeft = 0
  let downPositionTop = 0
  let el = null
  let basicData = {};
  let dialogKeyStr = '';
  const dialogClickEvent = (e) => {
    e.stopPropagation()
  }
  const moveFun = (event) => {
    const X = event.clientX - downPositionStartX
    const Y = event.clientY - downPositionStartY
    let left = `${downPositionLeft + X}px`;
    let top = `${downPositionTop + Y}px`;
    targetEl.style.left = left
    targetEl.style.top = top
    if (moveLimit()) return
    basicData['dialogStyle_' + dialogKeyStr] = {
      left,
      top
    }
  }
  // 拖动超出边界值 回到可视区域
  const moveLimit = () => {
    let isLimit = false
    try {
      let {top, bottom, left, right} = targetEl.getBoundingClientRect()
      let clientHeight = document.scrollingElement.clientHeight
      let clientWidth = document.scrollingElement.clientWidth
      // 拖动超出边界值 回到可视区域
      if (bottom >= clientHeight || top <= 0) {
        if (bottom >= clientHeight) {
          let handleTop = clientHeight - targetEl.offsetHeight + 'px'
          targetEl.style.top = handleTop
          basicData['dialogStyle_' + dialogKeyStr].top = handleTop;
        }
        if (top <= 0) {
          targetEl.style.top = '0px'
          basicData['dialogStyle_' + dialogKeyStr].top = '0px'
          isLimit = true
          console.log('targetEl.style.top')
        }
      }
      if (right >= clientWidth || left <= 0) {
        if (right >= clientWidth) {
          let handleLeft = clientWidth - targetEl.offsetWidth + 'px';
          targetEl.style.left = handleLeft
          basicData['dialogStyle_' + dialogKeyStr].left = handleLeft
        }
        if (left <= 0) {
          targetEl.style.left = '0px'
          basicData['dialogStyle_' + dialogKeyStr].left = '0px'
          isLimit = true
        }
      }
    } catch (error) {
      console.error(error)
    }
    return isLimit
  }
  const mouseupEvent = () => {
    moveLimit();
    // 拖动结束可以选中文本
    document.onselectstart = null
    document.removeEventListener('mousemove', moveFun)
    document.removeEventListener('mouseup', mouseupEvent)
    document.onselectstart = function () { return true }
  }
  const onMouseDown = (event) => {
    downPositionStartX = event.clientX
    downPositionStartY = event.clientY
    downPositionLeft = targetEl.offsetLeft
    downPositionTop = targetEl.offsetTop
  
    document.addEventListener('mousemove', moveFun)
    document.addEventListener('mouseup', mouseupEvent)
    // 拖动禁止选中文本
    document.onselectstart = function () { return false }
  }
  const init = () => {
    if (el) return
    el = document.querySelector(`.${dialogKey}.base-modal-dialog.isMoveDialog .el-dialog__header`)
    if (!el) return
    basicData = storeObj
    dialogKeyStr = dialogKey;
    el.addEventListener('mousedown', onMouseDown)
    targetEl = document.querySelector(`.${dialogKey}.base-modal-dialog.isMoveDialog`)
    targetEl.addEventListener('click', dialogClickEvent)
  }
  init(); 
}
