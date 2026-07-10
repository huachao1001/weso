console.log("=== 窗口间通信 ===\n");

console.log("W.addWinMsgListener(cb)");
console.log("  在当前窗口注册监听, 其他窗口通过 postWinMsg 发来的数据会进 cb\n");
console.log("W.postWinMsg(toHWND, data)");
console.log("  把 data (任意可序列化对象) 发给 toHWND 指定的窗口\n");

console.log("1. 在主窗口注册监听");
W.addWinMsgListener(function (data) {
    console.log("   收到: ", JSON.stringify(data));
});

console.log("\n2. 创建一个子窗口 (msg.html), 它会向主窗口发 3 条消息");
var childHwnd = W.createWin({
    entry: "code/window/interaction/msg.html",
    width: 420,
    height: 220,
    x: -1,
    y: -1,
    title: "消息子窗口",
    mode: W.WinMode.Windowed
});
console.log("   子窗口句柄: " + childHwnd);

console.log("\n3. 等待子窗口发来的消息 (约 3 秒内)\n");

setTimeout(function () {
    console.log("--- 演示结束, 可手动关闭子窗口 ---");
}, 3500);
