import * as path from "path";
import { BrowserWindow } from "electron";
import { mainContextMenu } from "./mainContextMenu";
import { logoName } from "./utils";

const {NODE_ENV} = process.env;

/** 创建窗口方法 */
function createWindow() {
  const logo = logoName()
  const iconPath = path.join(__dirname, logo); // 替换为您的图标文件路径
  // 生成窗口实例
  const Window = new BrowserWindow({
    minWidth: 1120,
    minHeight: 645,
    width: 1120, // * 指定启动app时的默认窗口尺寸
    height: 645, // * 指定启动app时的默认窗口尺寸
    frame: false, // * app边框(包括关闭,全屏,最小化按钮的导航栏) @false: 隐藏
    transparent: false, // * app 背景透明
    hasShadow: true, // * app 边框阴影
    show: false, // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
    resizable: true, // 禁止手动修改窗口尺寸
    webPreferences: {
      contextIsolation: true, // 启用沙箱环境以隔离渲染进程和主进程
      sandbox: true, 
      // 加载脚本
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  Window.setIcon(iconPath);

  // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
  Window.once("ready-to-show", () => {
    Window.show(); // 显示窗口
  });

  // windows10处在窗口最大化状态,拖动窗口使其退出最大化时,允许尺寸变化
  Window.on("unmaximize", (event: Electron.WindowEvent) => {
    event.sender.setResizable(true);
    setTimeout(() => {
      event.sender.setResizable(false);
    }, 1);
  });

  /** 设置全局右键菜单 */
  mainContextMenu(Window);

  // * 主窗口加载外部链接
  if (NODE_ENV === "development") Window.loadURL(process.env.LoadUrl as string); // 开发环境,加载vite启动的vue项目地址
  if (NODE_ENV !== "development") Window.loadFile(path.join(__dirname, "..", "vite/index.html")); // 生产环境加载打包后文件
}
export { createWindow };
