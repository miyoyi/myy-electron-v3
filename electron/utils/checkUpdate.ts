import { dialog } from "electron";
import Store from "electron-store";
import { autoUpdater } from 'electron-updater';

const store = new Store();  

export function checkUpdate (Window: { webContents: { send: (arg0: string, arg1: number) => void; }; }) {
  const feedURL = process.platform === 'darwin' ? 'http://127.0.0.1:8080/darwin' : 'http://127.0.0.1:8080/win32'

  autoUpdater.setFeedURL(feedURL)
  // 不自动下载新版本
  autoUpdater.autoDownload = false
  // 检测更新
  autoUpdater.checkForUpdates()
  
  // 监听'error'事件
  autoUpdater.on('error', (err) => {
    dialog.showMessageBox({
      type: 'error',
      title: '更新检测错误',
      message: err.toString(),
    })
  })
  
  // 监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', (info) => {
    const skippedVersion = store.get("skippedVersion");
    if (info.version === skippedVersion) return
      dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新版本，是否更新？',
        buttons: ['是', '跳过更新', '否']
      }).then((buttonIndex) => {
        if(buttonIndex.response === 0) {  // 选择是，下载新版本
          autoUpdater.downloadUpdate() 
        } else if (buttonIndex.response === 1) {
          store.set("skippedVersion", info.version);
        }
      })
  })

  // 监听'download-progress'事件，下载进度
  autoUpdater.on('download-progress', async (progress) => {
    const downloadPercent = Math.round(progress.percent * 100) / 100;
    Window.webContents.send('download-progress', downloadPercent);
  })
  
  // 监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '更新下载完成',
      message: '更新下载完成是否立即重启？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if(buttonIndex.response === 0) {  // 选择是，则重启程序，安装新版本
        store.delete("skippedVersion");
        autoUpdater.quitAndInstall()
      }
    })
  })
}

