console.log("=== 查询窗口模式 ===\n");

console.log("W.isBorderless()");
console.log("  返回当前窗口是否为无边框样式 (mode >= 2)\n");
console.log("W.getWinMode()");
console.log("  返回当前窗口的 mode, 与 W.WinMode 枚举对应:\n");
console.log("  W.WinMode.Windowed            (0)  有边框, 任务栏可见");
console.log("  W.WinMode.WindowedNoTaskbar   (1)  有边框, 任务栏不可见");
console.log("  W.WinMode.Borderless          (2)  无边框, 任务栏可见");
console.log("  W.WinMode.BorderlessNoTaskbar (3)  无边框, 任务栏不可见\n");

var modeNames = {};
modeNames[W.WinMode.Windowed]            = "Windowed";
modeNames[W.WinMode.WindowedNoTaskbar]   = "WindowedNoTaskbar";
modeNames[W.WinMode.Borderless]          = "Borderless";
modeNames[W.WinMode.BorderlessNoTaskbar] = "BorderlessNoTaskbar";

var mode = W.getWinMode();
var borderless = W.isBorderless();
var name = modeNames[mode] || ("Unknown(" + mode + ")");

console.log("当前窗口:");
console.log("  getWinMode()    = " + mode + "  (" + name + ")");
console.log("  isBorderless()  = " + borderless);

console.log("\n注: 与 hwnd.js 一样, 这两个接口针对调用方所在窗口,");
console.log("    新窗口里调用即返回新窗口的属性");
