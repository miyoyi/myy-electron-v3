import * as path from "path";
import { BrowserWindow, Menu, Tray, ipcMain, nativeImage  } from "electron";
import { createWindow } from "./createWindow";
import { logoName } from "./utils";

function tray() {
  // 定义右键菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item 1", type: "normal" },
    { label: "Item 2", type: "normal" },
    { type: "separator" },
    { label: "Quit", role: "quit" }
  ]);
  const logo = logoName()
  let ToolTip = 'myy-electron'
  let flashFlag = false;
  let timer = null;
  let msgFlag = false;
  let tray = new Tray(path.join(__dirname, logo));

  tray.setContextMenu(contextMenu);
  tray.setToolTip(ToolTip);
  tray.on("click", () => {
    if (flashFlag) {
      ToolTip = 'myy-electron'
      tray.setToolTip(ToolTip);
      flashFlag = false
      clearInterval(timer); 
      tray.setImage(path.join(__dirname, logo));
    }
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      BrowserWindow.getAllWindows()[0].show();
    }
  });
  
  ipcMain.on('flash', (event,arg:boolean) => {
    flashFlag = arg
    ToolTip = '执行登录后闪烁,单击停止'
    if (flashFlag) {
      timer = setInterval(() => {
        msgFlag = !msgFlag;
        if (msgFlag) {
          tray.setImage(nativeImage.createEmpty());
        } else {
          tray.setImage(path.join(__dirname, logo));
        }
        tray.setToolTip(ToolTip);
      }, 300);
    }
  });
}
export { tray };
