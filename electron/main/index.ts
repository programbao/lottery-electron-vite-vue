import { app, BrowserWindow, shell, ipcMain, protocol, Menu, dialog } from 'electron'
import { release } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from 'path'
// import WinState from 'electron-win-state';
const NODE_ENV = process.env.NODE_ENV
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import openDialog from '../controller/openDialog'
import { getTempData } from '../controller/getTempData'
import { getStaticUsersData, setData, resetData, resetOneRoundLuckyData, 
  saveOneRoundLuckyData, handleExportData, getSaveExcelFileInfoList, 
  openFileOrFolder } from '../controller/dataHandle'
import { toggleFullScreen, savePrizesConfig, openDevTools } from '../controller/systemEventHandle'
import { importFile } from '../controller/prizesConfigHandle'

// 全局变量
global.sharedObject = {
  curData: {},
  luckyData: {},
  errorData: [],
  defaultPage: `default data`,
  cfg: {},
  win: null
}
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.mjs    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const isBuild = process.env.NODE_ENV !== 'development';
const iconPath = path.join(__dirname, `${isBuild ? '../' : '../../electron/'}controller/data/img/lottery_icon.png`)
async function createWindow() {
  // const winState = new WinState({
  //   // defaultWidth: 1000,
  //   // defaultHeight: 800
  // })
  win = new BrowserWindow({
    title: 'Main window',
    // ...winState.winOptions,
    // icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    icon: iconPath, // 设置程序图标
    webPreferences: {
      preload,

      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      webSecurity: false, // 取消跨域
      // enableRemoteModule: true,
      // allowRunningInsecureContent: true,
      // allowRunningInsecureContent: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      contextIsolation: true,
    },
  })
  // winState.manage(win);
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url).then(() => {
      win.maximize();
      win.show(); 
    })
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

   // 监听关闭窗口的事件
   win.on('close', (event) => {
    // 阻止默认的窗口关闭行为
    event.preventDefault();
    
    // 弹出确认对话框
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['是', '否'],
      title: '确认关闭',
      message: '确定要关闭应用吗？'
    });

    // 如果用户选择“是”，则关闭窗口
    if (choice === 0) {
      win.destroy();
      // 发送确认关闭窗口的事件到渲染进程
      // event.sender.send('confirm-close-window');
    }
  });

  win.on('closed', () => {
    win = null;
  });
  global.sharedObject.win = win;

  // 打开dialog
  openDialog();

  // 获取奖品配置
  getTempData();

  // 获取静态用户数据
  getStaticUsersData();

  // 设置和保存数据 
  setData();

  // 重置数据
  resetData();

  // 重置当前或上一轮奖项所有中奖名单
  resetOneRoundLuckyData();

  // 保存当前或上一轮奖项所有中奖名单
  saveOneRoundLuckyData();

  // 获取导出文件列表
  getSaveExcelFileInfoList();

  // 打开文件/文件夹
  openFileOrFolder();

  // 处理数据导出
  handleExportData();

  // 全屏切换
  toggleFullScreen();

  // 导入文件
  importFile();

  // 保存配置文件
  savePrizesConfig();

  // 打开开发者工具
  openDevTools();

  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
app.on('ready', () => {
  Menu.setApplicationMenu(null);
  protocol.registerFileProtocol('file', (request, callback) => {
    const filePath = path.normalize(request.url.replace(/^file:\/\//, ''));
    callback({ path: filePath });
  });
});