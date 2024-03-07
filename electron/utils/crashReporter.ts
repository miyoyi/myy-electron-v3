import { crashReporter, dialog , app } from 'electron'


export function crashedActions (detail: string) {
    // let cpuUsage = JSON.stringify(process.cpuUsage()) // cpu 使用情况
    // let heapStatistics = JSON.stringify(process.getHeapStatistics()) // 返回包含 V8 堆统计的对象。 备注：所有数据值以KB为单位(下同)
    // let blinkMemoryInfo = JSON.stringify(process.getBlinkMemoryInfo()) // 返回带有Blink内存信息的对象。 可以用于调试渲染/DOM相关内存问题。
    // let processMemoryInfo = JSON.stringify(process.getProcessMemoryInfo()) // 返回一个对象，提供当前进程的内存使用统计。
    // let systemMemoryInfo = JSON.stringify(process.getSystemMemoryInfo()) // 返回一个对象，提供整个系统的内存使用统计
    // let systemVersion = JSON.stringify(process.getSystemVersion()) // 返回 string - 操作系统的版本

    // const data = {detail,cpuUsage,heapStatistics,blinkMemoryInfo,processMemoryInfo,systemMemoryInfo,systemVersion}
    // console.log(data);
    dialog.showErrorBox('应用崩溃', `我们已经发送崩溃信息至终端，请注意您的注册邮箱，我们将尽快联系您。崩溃信息：${detail}`)
}

export function startCrashReporter () {
    crashReporter.start({
      productName: app?.getName(),
      submitURL: 'http://127.0.0.1:5173', // 上传报错地址,这里开发不报错写的本地
      uploadToServer: true,
    // 加入需要传的其他参数
    //   globalExtra: {
    //     userAccount: '',
    //     userName: ''
    //   }
    })

    app.on('child-process-gone', (event, details) => {
      const detail = JSON.stringify(details)
      crashedActions(detail)
    })
}