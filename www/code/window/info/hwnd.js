console.log("=== 获取窗口句柄 ===\n");

console.log("1. 获取主窗口句柄 (getMainHWND):");
var mainHwnd = W.getMainHWND();
console.log("   " + mainHwnd);

console.log("\n2. 获取当前激活窗口句柄 (getHWND):");
var hwnd = W.getHWND();
console.log("   " + hwnd);

console.log("\n注: 句柄是 native 侧窗口的 HWND 数值, 可传给 destroyWin 等 API 使用");
