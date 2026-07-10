console.log("=== 创建新窗口 ===\n");

console.log("W.createWin({ entry, width, height, x, y, title, mode, bgColor })");
console.log("  x/y 传 -1 表示由系统自动定位");
console.log("  mode 指定窗口样式, 取值见 W.WinMode:\n");

console.log("  W.WinMode.Windowed            (0)  标准窗口, 有边框, 显示在任务栏");
console.log("  W.WinMode.WindowedNoTaskbar   (1)  有边框, 不显示在任务栏");
console.log("  W.WinMode.Borderless          (2)  无边框, 显示在任务栏");
console.log("  W.WinMode.BorderlessNoTaskbar (3)  无边框, 不显示在任务栏\n");

var entry = "code/window/create/win.html";
var modes = [
    { mode: W.WinMode.Windowed, title: "Windowed 标准窗口" },
    { mode: W.WinMode.WindowedNoTaskbar, title: "WindowedNoTaskbar 有边框无任务栏" },
    { mode: W.WinMode.Borderless, title: "Borderless 无边框" },
    { mode: W.WinMode.BorderlessNoTaskbar, title: "BorderlessNoTaskbar 无边框无任务栏" }
];

console.log("依次创建 4 种模式的窗口, 每个错开一段距离方便观察:");
console.log("  win.html 内部通过 W.getWinMode() / W.isBorderless() 读取自身模式,");
console.log("  仅 Borderless / BorderlessNoTaskbar 才渲染自定义拖拽栏 + 关闭按钮\n");

modes.forEach(function (m, i) {
    var offset = i * 60;
    var hwnd = W.createWin({
        entry: entry,
        width: 500,
        height: 400,
        x: 120 + offset,
        y: 120 + offset,
        title: m.title,
        mode: m.mode,
        bgColor: "#F0F0F0"
    });
    console.log("  [" + i + "] mode=" + m.mode + "  " + m.title + "  hwnd=" + hwnd);
});

console.log("\n如需关闭, 可运行 destroy 示例, 或手动关闭");
