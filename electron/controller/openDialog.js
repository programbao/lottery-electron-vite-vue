import { ipcMain, dialog } from 'electron'
import {
  loadXML,
  shuffle,
} from "./utils/help";

let curData = {};

function loadData(loadPath) {
  const users = loadXML(loadPath);
  if (!users) {
    dialog.showErrorBox("导入失败", 'excel表格内容不符合规范');
    return
  }
  curData.users = users
  // 重新洗牌
  shuffle(curData.users);
}


const openDialog = (data) => {
  ipcMain.handle('open-dialog', async (e, ...args) => {
    try {
      const res = await dialog.showOpenDialog({
        // defaultPath: 'D:/Users/Desktop',
        filters: [
          {"name": "excel文件", extensions: ["xlsx", "xls"]},
        ]
      }) 
      loadData(res.filePaths[0])
    } catch (err) {
      dialog.showErrorBox("导入失败", err)
    }
    return curData;
  })
}

export default openDialog