
import { ipcMain, dialog, shell } from 'electron'
import path  from 'path'
import fs  from 'fs'
import url  from 'url'
import dayjs  from 'dayjs'
const isBuild = process.env.NODE_ENV !== 'development';
import {
  loadXML,
  loadTempData,
  writeXML,
  saveDataFile,
  shuffle,
  saveErrorDataFile,
  saveExistenceXML,
  getExcelHeader
} from "./utils/help"
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataBath = __dirname;
const getStaticUsersData = async () => {
  ipcMain.handle('getStaticUsersData', async (e, ...args) => {
    console.log("加载EXCEL数据文件");
    let sharedObject =  global.sharedObject;
    const prizeConfig = await loadTempData("prizesConfig.json");
    sharedObject.cfg = prizeConfig[0];
    const groupList = sharedObject.cfg.groupList;
    const allUsers = [];
    for (let i = 0; i < groupList.length; i++) {
      const group = groupList[i];
      let users = loadXML(group.savePath);
      if (users.type === 'error') {
        group.errorMsg = group.group_name + users.msg;
        dialog.showErrorBox("初始化失败", group.errorMsg);
        continue;
      }
      sharedObject.curData[group.group_identity] = users
      shuffle(users);
    }
    // let curData =  global.sharedObject.curData;
    // let luckyData = global.sharedObject.luckyData;
    // let errorData = global.sharedObject.errorData;
    // sharedObject.curData.users = loadXML(path.join(dataBath, "data/users.xlsx"));
    
    // sharedObject.curData.users_islam = loadXML(path.join(dataBath, "data/users_islam.xlsx"));
    // sharedObject.curData.users_christian_catholic = loadXML(path.join(dataBath, "data/users_christian_catholic.xlsx"));
    // sharedObject.curData.users_hinduism_buddhism_confucianism = loadXML(path.join(dataBath, "data/users_hinduism_buddhism_confucianism.xlsx"));
    // // 重新洗牌
    // shuffle(sharedObject.curData.users);
    // shuffle(sharedObject.curData.users_islam);
    // shuffle(sharedObject.curData.users_christian_catholic);
    // shuffle(sharedObject.curData.users_hinduism_buddhism_confucianism);
    // 读取已经抽取的结果
    try {
      const tempData = await loadTempData("temp.json", "error.json");
      sharedObject.luckyData = tempData[0];
      sharedObject.errorData = tempData[1];
    } catch (err) {
      // sharedObject.curData.leftUsers = allUsers;
    }
    return sharedObject.curData;
  })
}
const setLucky = async (type, data) => {
  let sharedObject =  global.sharedObject;
  if (sharedObject.luckyData[type]) {
    sharedObject.luckyData[type] = sharedObject.luckyData[type].concat(data);
  } else {
    sharedObject.luckyData[type] = Array.isArray(data) ? data : [data];
  }

  return saveDataFile(sharedObject.luckyData, "temp.json");
}

const setData = async () => {
  ipcMain.handle('setData', async (e, ...args) => {
    const type = args[0];
    const data = JSON.parse(args[1]);
    const res = await setLucky(type, data);
    console.log(res, 'setData-----')
  })
}

const handleResetData = async () => {
  let sharedObject =  global.sharedObject;
  sharedObject.luckyData = {};
  sharedObject.errorData = [];
  await saveDataFile(sharedObject.luckyData, "temp.json");
}
const resetData = async () => {
  ipcMain.handle('resetData', async (e, ...args) => {
    let isTrue = true
    try {
      await handleResetData();
    } catch (error) {
      isTrue = false
    }
    return isTrue;
  })
}
const resetOneRoundLuckyData = async () => {
  ipcMain.handle('resetOneRoundLuckyData', async (e, ...args) => {
    let isTrue = true
    let delLuckyType = args[0]
    try {
      let sharedObject =  global.sharedObject;
      if (sharedObject.luckyData[delLuckyType]) {
        delete sharedObject.luckyData[delLuckyType]
        await saveDataFile(sharedObject.luckyData, "temp.json");
      }
    } catch (error) {
      isTrue = false
    }
    return isTrue;
  })
}
const saveOneRoundLuckyData = async () => {
  ipcMain.handle('saveOneRoundLuckyData', async (e, ...args) => {
    let isTrue = true
    const type = args[0];
    const data = JSON.parse(args[1]);
    try {
      let sharedObject =  global.sharedObject;
      sharedObject.luckyData[type] = Array.isArray(data) ? data : [data];
      await saveDataFile(sharedObject.luckyData, "temp.json");
    } catch (error) {
      isTrue = false
    }
    return isTrue;
  })
}
const hanldeExportDataFn = async () => {
  let outData = [["工号", "部门", "姓名"]];
  let sharedObject =  global.sharedObject;
  
  sharedObject.cfg.prizes.forEach(item => {
    outData.push([item.name]);
    outData = outData.concat(sharedObject.luckyData[item.type] || []);
  });
  let result = {};
  try {
    let fileName = `结果-${dayjs().format("YYYY-MM-DD#hh.mm.ss.SSS")}.xlsx`
    const savePath = await writeXML(outData, fileName)
    result = {
      type: "success",
      fileName: fileName,
      savePath
    };
    console.log(`导出数据成功！`);
  } catch (err) {
    console.log(err, 'errerr')
    result = {
      type: "error",
      error: err
    };
    console.log(`导出数据失败！`); 
  }
  return result; 
}
const handleExportData = async () => {
  ipcMain.handle('handleExportData', async (e, ...args) => {
    let result = {};
    try {
      result = await hanldeExportDataFn();
    } catch (error) {
      console.log(error, '2348092384')
    }
    return result; 
  })
}

// 修改人员名单
const ajustModifyUsersTable = async () => {
  ipcMain.handle('ajustModifyUsersTable', async (e, ...args) => {
    let result = {};
    try {
      const data = JSON.parse(args[0]);
      const group = data.group
      const userData = data.userData
      let outData = [getExcelHeader(group.savePath)];
      outData = outData.concat(userData || []);
      await saveExistenceXML(outData, group.group_name, group.savePath)
      // result = await hanldeExportDataFn();
    } catch (error) {
      console.log(error, '2348092384')
      return false
    }
    return result; 
  }) 
}


const dbPath = path.join(__dirname,  `${isBuild ? '../../../' : '../electron/'}assets/xlsx_write`)

const readExcelFilesInDirectory = () => {
  const files = fs.readdirSync(dbPath); // 读取目录下所有文件和文件夹
  const saveFolderPath = path.join(dbPath);
  const excelFiles = files.filter(file => {
    const filePath = path.join(dbPath, file);
    // 检查文件是否是Excel文件
    return fs.statSync(filePath).isFile() && path.extname(filePath).toLowerCase() === '.xlsx';
  });
  const filesInfo = excelFiles.map(file => {
    const filePath = path.join(dbPath, file);
    return {
      fileName: file,
      filePath: filePath,
      saveFolderPath
    };
  });

  return filesInfo;
}

const getSaveExcelFileInfoList = async () => {
  ipcMain.handle('getSaveExcelFileInfoList', async (e, ...args) => {
    let result = {};
    try {
      result = await readExcelFilesInDirectory();
    } catch (error) {
      console.log(error, '2348092384')
    }
    return result; 
  })
}

// 打开目录或文件
let usersTemplatePath = path.join(__dirname, `${isBuild ? '../../../' : '../../electron/'}assets/xlsx_read/users_template.xlsx`);
const destPath = path.join(path.join(__dirname, `${isBuild ? '../../../' : '../../electron/'}assets/xlsx_write`), 'users_template.xlsx')
const openFileOrFolder = async (data) => {
  ipcMain.handle('openFileOrFolder', async (e, ...args) => {
    let isOpen = false;
    let resultObj = {
      type: "success",
      code: 0,
      isPass: false,
      msg: "打开文件成功！",
      dirname: __dirname,
      positionPath:  path.join(__dirname, '../../../'),
      env: isBuild ? 'production' : 'development'
    };
    let filePath = args[0]
    try {
      if (filePath === "users_template") {
        fs.copyFileSync(usersTemplatePath, destPath)
        filePath = url.pathToFileURL(destPath).href
      }
      try {
        resultObj.isPass = await shell.openPath(filePath)
      } catch (error) {
        resultObj.isPass = await shell.showItemInFolder(filePath)
        resultObj.msg = error
      }
    } catch (error) {
      resultObj.isPass = false
      resultObj.msg = error
      console.log(error, '2348092384')
    }
    resultObj.isPass = true
    return resultObj; 
  }) 
}

// 查看文件
export {
  getStaticUsersData,
  setData,
  resetData,
  handleExportData,
  ajustModifyUsersTable,
  resetOneRoundLuckyData,
  saveOneRoundLuckyData,
  getSaveExcelFileInfoList,
  openFileOrFolder
};
