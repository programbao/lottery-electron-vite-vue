import { ipcMain, dialog } from 'electron'
import {
  loadXML,
  loadTempData,
  writeXML,
  saveDataFile,
  shuffle,
  saveErrorDataFile
} from "./utils/help";
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// const isBuild = process.env.NODE_ENV === 'production'
const isBuild = process.env.NODE_ENV !== 'development';
const dbPath = path.join(__dirname, `${isBuild ? '../../../' : '../../electron/'}assets`)
import url from 'url';
import fs from "fs";

const loadData = (loadPath) => {
  const users = loadXML(loadPath);
  if (!users) {
    dialog.showErrorBox("导入失败", 'excel表格内容不符合规范');
    return false
  }
  // 重新洗牌
  shuffle(users);
  return users
}

const importFile = () => {
  ipcMain.handle('importFile', async (e, ...args) => {
    let sharedObject =  global.sharedObject;
    let saveType = args[0] || ''
    let extensions = args[1]
    let userName = args[2]
    let lotteryCount = args[3]
    if (!extensions) {
      extensions = []
    } else {
      extensions = JSON.parse(extensions)
    }
    console.log(extensions, 'extensionsextensions')
    try {
      const res = await dialog.showOpenDialog({
        // defaultPath: 'D:/Users/Desktop',
        filters: [
          {"name": "选择文件", extensions},
        ]
      }) 
      if (!res.canceled) {

        const filePath = res.filePaths[0]
    
        const fileName = new Date().getTime() + '_' + path.basename(filePath)
        const destPath = path.join(dbPath, saveType, fileName)
        const saveFolderPath = path.join(dbPath, saveType);
        let users;
        if (userName) {
          users = loadData(filePath)
          if (!users && users.type && users.type === 'error') {
            return users
          }
          if (users && !userName.includes('secret_users_')) {
            sharedObject.curData[userName] = users
          }
          if (lotteryCount && users.length > Number(lotteryCount)) {
            dialog.showErrorBox("导入失败", `您导入的人员名单有${users.length}个，内置中奖人数不能大于总奖项数量 ${lotteryCount}个`);
            return {
              type: "error",
              msg: `您导入的人员名单有${users.length}个，内置中奖人数不能大于总奖项数量 ${lotteryCount}个`
            }
          }
          // 判断工号不能为空和重复
          // if (users && Array.isArray(users) && (userName.includes('secret_users_') || saveType === 'xlsx_write')) {
          //   const handleIdSet = new Set();
          //   let index = 0;
          //   for (const item of users) {
          //     index++
          //     if (!Array.isArray(item) || item.length !== 3) {
          //       dialog.showErrorBox("导入失败", 'excel格式有误')
          //       return {
          //         type: "error",
          //         msg: `excel格式有误`
          //       };
          //     }
          //     const [id, department, name] = item;
          //     // 验证工号是否唯一和不能为空
          //     if (!id) {
          //       dialog.showErrorBox("导入失败", `第${index}行工号为空`);
          //       return {
          //         type: "error",
          //         msg: `第${index}行工号为空`
          //       };
          //     }
          //     if (handleIdSet.has(id+'')) {
          //       dialog.showErrorBox("导入失败", `工号 ${id} 重复或为空`);
          //       return {
          //         type: "error",
          //         msg: `工号 ${id} 重复或为空`
          //       };
          //     }
          //     handleIdSet.add(id+'');
          //   }
          // }

          // const isHasGroup = sharedObject.cfg.groupList && sharedObject.cfg.groupList.some(item => item.group_name === fileName);
          // if (!isHasGroup) {
          //   users = loadData(filePath)
          //   if (users) {
          //     sharedObject.curData[userName] = users
          //   } else {
          //     return false
          //   }
          // }
        }
        fs.copyFileSync(filePath, destPath)
    
        return {
          savePath: destPath,
          saveFolderPath: saveFolderPath,
          fileUrl: url.pathToFileURL(destPath).href,
          fileName: fileName,
          users
        }
      }
    } catch (err) {
      console.log(err, '23480928342')
      dialog.showErrorBox("导入失败", err)
    }
  })
}

export {
  importFile
}