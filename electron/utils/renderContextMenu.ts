import { BrowserWindow } from "electron";

// 打开控制台
const openDevTool = (e: Electron.IpcMainEvent) => e.sender.openDevTools();

// 刷新页面
const reloadIgnoringCache = (e: Electron.IpcMainEvent) => e.sender.reloadIgnoringCache();

// 全屏/推出全屏
/**
 * 由于electron的某个bug,无边框透明窗口在win上isSetFullScreen总是返回false
 * 所以在windows上是否全屏通过在当前窗口实例上挂载变量的方式来判断
 */
const fullScreen = (e: Electron.IpcMainEvent) => {
  const window = BrowserWindow.fromWebContents(e.sender); // 获取窗口实例
  const isMac = process.platform === "darwin"; // 判断是否是mac
  if (isMac) {
    // mac进入/退出简单全屏模式
    const isSimpleFS = window.isSimpleFullScreen();
    window.setSimpleFullScreen(!isSimpleFS);
  } else {
    // win进入/退出全屏模式
    window.isMax ? window.setFullScreen(false) : window.setFullScreen(true);
    window.isMax = !window.isMax;
  }
};

interface Methods {
  [propName: string]: Function;
}
const methods: Methods = {
  openDevTool,
  fullScreen,
  reloadIgnoringCache
};
