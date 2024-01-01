import { ipcMain, BrowserWindow  } from 'electron'
import {
  loadTempData,
  saveDataFile,
} from "./utils/help";
// 当前全屏状态
let isFullScreen = false;
const toggleFullScreen = (data) => {
 // 获取当前窗口 
 const win = BrowserWindow.getFocusedWindow();

 ipcMain.handle('toggleFullScreen', async () => {
   
   // 切换全屏状态
   isFullScreen = !isFullScreen;
   win.setFullScreen(isFullScreen);

   return isFullScreen;
 })
}

const savePrizesConfig = () => {
  ipcMain.handle('savePrizesConfig', async (e, ...args) => {
    let isPass = true
    try {
      const data = JSON.parse(args[0]);
      const saveField = args[1]
      global.sharedObject.cfg[saveField] = data;
      await saveDataFile(global.sharedObject.cfg, "prizesConfig.json");
    } catch (error) {
      isPass = false
      console.log(error, '23784092384')
    }
    return isPass;
  })
}
const openDevTools = () => {
  ipcMain.handle('openDevTools', async () => {
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.openDevTools();
  })
}
export {
  toggleFullScreen,
  savePrizesConfig,
  openDevTools
}