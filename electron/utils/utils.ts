import path from "path";
import * as fs from "fs";
import { BrowserWindow, session } from "electron";

/** 获取被选中(拥有焦点/前台显示)的窗口实例 */
export function getfocusWindow(): BrowserWindow | null {
  return BrowserWindow.getFocusedWindow();
}

/** 打开控制台 */
export function openDevTools() {
  getfocusWindow()?.webContents.openDevTools();
}
/** 刷新页面 */
export function reloadWeb() {
  getfocusWindow()?.webContents.reload();
}
/** 刷新页面（不刷缓存） */
export function reloadNoCacheWeb() {
  getfocusWindow()?.webContents.reloadIgnoringCache();
}

export function dealy(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function logoName() {
  const filePath = path.join(__dirname, "Logo.cjs");
  let logo: string;
  try {
    const logoContent = fs.readFileSync(filePath, "utf8");
    const pattern = /var\sLogo_default\s=\s"(.*?)";/;
    const result = pattern.exec(logoContent);
    const logoPath = result[1];
    logo = logoPath.substring(2);
  } catch (error) {
    console.error("无法读取Logo.cjs文件:", error);
  }
  return logo
}
