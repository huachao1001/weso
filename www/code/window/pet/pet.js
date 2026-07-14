console.log("=== 桌面萌宠 (透明窗口 API 综合) ===\n");

console.log("用一个右下角猫咪挂件, 把 4 个新窗口 API 串起来:\n");
console.log("  createWin({transparent:true})  创建即透明 (WS_EX_NOREDIRECTIONBITMAP, 真透明关键)");
console.log("  setTransparent(true, hwnd)     webview alpha=0, 透明像素直显桌面");
console.log("  setAlwaysOnTop(true, hwnd)     始终置顶, 全屏窗口也盖不住");
console.log("  setShadow(false, hwnd)         显式关 aero 阴影 (覆盖透明窗口默认联动)");
console.log("  setClickThrough(false, hwnd)   显式可点击 (改 true 即幽灵模式)\n");

// 屏幕右下角, 避开任务栏
var screen = W.getScreenRect();
var taskbar = W.getTaskbarRect();
var w = 220, h = 220, margin = 24;
var x = screen.right - w - margin;
var y = taskbar.top - h - margin;            // 任务栏在底部最常见
if (y < screen.top + margin) {               // 任务栏不在底部 -> 回退屏幕底
    y = screen.bottom - h - margin - 48;
}

// 1) 创建即透明的无边框子窗口
//    transparent:true 是真透明的关键: 创建时传 WS_EX_NOREDIRECTIONBITMAP,
//    跳过 class hbrBackground 的 #F0F0F0 填充, 透明像素才能直显桌面。
//    该 exStyle 只在创建时生效, 运行时 setTransparent 无法补上。
var hwnd = W.createWin({
    entry: "code/window/pet/pet.html",
    width: w, height: h, x: x, y: y,
    title: "桌面萌宠",
    mode: W.WinMode.BorderlessNoTaskbar,
    transparent: true
});
console.log("createWin -> hwnd=" + hwnd);

// 2) 把 webview 背景也置透明 + 始终置顶 + 显式关阴影 + 显式可点击
//    (透明窗口构造时已默认关阴影并 pre-arm webview 透明, 这里幂等显式调用, 便于演示 API)
W.setTransparent(true, hwnd);
W.setAlwaysOnTop(true, hwnd);
W.setShadow(false, hwnd);
W.setClickThrough(false, hwnd);

console.log("\n扩展 (改本脚本参数即可观察效果):");
console.log("  setClickThrough(true, " + hwnd + ")    幽灵模式: 鼠标穿透, 只观赏");
console.log("  setShadow(true, " + hwnd + ")          强制开阴影 (透明窗口加方形 Halo)");
console.log("  setTransparent(false, " + hwnd + ")    关闭透明, 恢复 #F0F0F0 不透明底");
console.log("  setAlwaysOnTop(false, " + hwnd + ")    取消置顶");
