// === 回调事件 ===
// W.onProcessFailed(cb)        cb(info)  渲染进程崩溃/卡死
// W.onNavigationCompleted(cb)  cb(info)  每次导航结束
// W.onLastSessionCrashed(cb)   cb()      上次会话异常退出
// 每个 on* 配套 remove*Listener(cb) 注销, 须传同一 cb 引用

console.log("=== 回调事件 ===\n");

// ---- 1. 本窗口注册三个监听 ----
var onProcFail = function (info) {
    console.log("[onProcessFailed] " + JSON.stringify(info));
};
var onNavDone = function (info) {
    console.log("[onNavigationCompleted] " + JSON.stringify(info));
};
var onCrash = function () {
    console.log("[onLastSessionCrashed] 上次会话异常退出");
};
W.onProcessFailed(onProcFail);
W.onNavigationCompleted(onNavDone);
W.onLastSessionCrashed(onCrash);

// ---- 2. 接收子窗口转发的事件 ----
W.addWinMsgListener(function (data) {
    console.log("[子窗口转发] " + JSON.stringify(data));
});

// ---- 3. 创建子窗口触发 onNavigationCompleted ----
var childHwnd = W.createWin({
    entry: "code/system/evt_child.html",
    width: 420,
    height: 220,
    x: -1,
    y: -1,
    title: "事件子窗口",
    mode: W.WinMode.Windowed
});
console.log("子窗口 hwnd = " + childHwnd + ", 等待其加载完成事件...");

// ---- 4. 6 秒后注销 onProcessFailed (演示 remove*) ----
setTimeout(function () {
    W.removeProcessFailedListener(onProcFail);
    console.log("[removeProcessFailedListener] 已注销 onProcFail");
}, 6000);
