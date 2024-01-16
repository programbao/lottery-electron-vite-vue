
// function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
//   return new Promise((resolve) => {
//     if (condition.includes(document.readyState)) {
//       resolve(true)
//     } else {
//       document.addEventListener('readystatechange', () => {
//         if (condition.includes(document.readyState)) {
//           resolve(true)
//         }
//       })
//     }
//   })
// }

// const safeDOM = {
//   append(parent: HTMLElement, child: HTMLElement) {
//     if (!Array.from(parent.children).find(e => e === child)) {
//       return parent.appendChild(child)
//     }
//   },
//   remove(parent: HTMLElement, child: HTMLElement) {
//     if (Array.from(parent.children).find(e => e === child)) {
//       return parent.removeChild(child)
//     }
//   },
// }

// /**
//  * https://tobiasahlin.com/spinkit
//  * https://connoratherton.com/loaders
//  * https://projects.lukehaas.me/css-loaders
//  * https://matejkustec.github.io/SpinThatShit
//  */
// function useLoading() {
//   const className = `loaders-css__square-spin`
//   const styleContent = `
// @keyframes square-spin {
//   25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
//   50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
//   75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
//   100% { transform: perspective(100px) rotateX(0) rotateY(0); }
// }
// .${className} > div {
//   animation-fill-mode: both;
//   width: 50px;
//   height: 50px;
//   background: #fff;
//   animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
// }
// .app-loading-wrap {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: #282c34;
//   z-index: 9;
// }
//     `
//   const oStyle = document.createElement('style')
//   const oDiv = document.createElement('div')

//   oStyle.id = 'app-loading-style'
//   oStyle.innerHTML = styleContent
//   oDiv.className = 'app-loading-wrap'
//   oDiv.innerHTML = `<div class="${className}"><div></div></div>`

//   return {
//     appendLoading() {
//       safeDOM.append(document.head, oStyle)
//       safeDOM.append(document.body, oDiv)
//     },
//     removeLoading() {
//       safeDOM.remove(document.head, oStyle)
//       safeDOM.remove(document.body, oDiv)
//     },
//   }
// }

// // ----------------------------------------------------------------------

// const { appendLoading, removeLoading } = useLoading()
// domReady().then(appendLoading)

// window.onmessage = (ev) => {
//   ev.data.payload === 'removeLoading' && removeLoading()
// }

// setTimeout(removeLoading, 4999)


// 通信方法 
const { contextBridge, ipcRenderer } =  require('electron')

const openDialog = async (data) => {
  let result = await ipcRenderer.invoke('open-dialog', data)
  return result;
}
const getTempData = async () => {
  let result = await ipcRenderer.invoke('getTempData')
  return result
}
const getStaticUsersData = async () => {
  let result = await ipcRenderer.invoke('getStaticUsersData')
  return result
}
// 保存数据
const setData = async (...args) => {
  let result = await ipcRenderer.invoke('setData', ...args)
  return result
}

// 重置数据
const resetData = async (...args) => {
  let result = await ipcRenderer.invoke('resetData', ...args)
  return result
}

// 重置当前或上一轮奖项所有中奖名单
 const resetOneRoundLuckyData = async (...args) => {
  let result = await ipcRenderer.invoke('resetOneRoundLuckyData', ...args)
  return result
}
// 保存当前或上一轮奖项所有中奖名单
const saveOneRoundLuckyData = async (...args) => {
  let result = await ipcRenderer.invoke('saveOneRoundLuckyData', ...args)
  return result
}

// 获取保存的excel文件列表
const getSaveExcelFileInfoList = async (...args) => {
  let result = await ipcRenderer.invoke('getSaveExcelFileInfoList', ...args)
  return result
}

// 打开文件或文件夹
const openFileOrFolder = async (...args) => {
  let result = await ipcRenderer.invoke('openFileOrFolder', ...args)
  return result
}

// 处理数据导出
const handleExportData = async (...args) => {
  let result = await ipcRenderer.invoke('handleExportData', ...args)
  return result
}

// 处理人员名单修改
const ajustModifyUsersTable = async (...args) => {
  let result = await ipcRenderer.invoke('ajustModifyUsersTable', ...args)
  return result
}
// 全屏切换
const toggleFullScreen = async (...args) => {
  let result = await ipcRenderer.invoke('toggleFullScreen', ...args)
  return result
}

// 保存抽奖配置
const savePrizesConfig = async (...args) => {
  let result = await ipcRenderer.invoke('savePrizesConfig', ...args)
  return result
}

// 导入文件
const importFile = async (...args) => {
  let result = await ipcRenderer.invoke('importFile', ...args)
  return result
}

// 打开开发者工具
const openDevTools = async (...args) => {
  let result = await ipcRenderer.invoke('openDevTools', ...args)
  return result
}

// 暴露electron处理函数 渲染进程和主进程通信
contextBridge.exposeInMainWorld('myApi', {
  openDialog,
  getTempData,
  getStaticUsersData,
  setData,
  resetData,
  resetOneRoundLuckyData,
  saveOneRoundLuckyData,
  handleExportData,
  ajustModifyUsersTable,
  toggleFullScreen,
  importFile,
  savePrizesConfig,
  openDevTools,
  getSaveExcelFileInfoList,
  openFileOrFolder
})