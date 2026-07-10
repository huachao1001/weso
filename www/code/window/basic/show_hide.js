console.log("=== 显示 / 隐藏窗口 ===\n");

console.log("当前主窗口句柄: " + W.getMainHWND());

console.log("\n1. 隐藏主窗口 (3 秒后自动恢复)");
console.log("   调用 W.hideWindow()");
W.hideWindow();

setTimeout(function () {
    W.showWindow();
    console.log("\n2. 已重新显示窗口");
    console.log("   调用 W.showWindow()");
}, 3000);
