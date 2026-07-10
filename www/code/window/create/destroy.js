console.log("=== 销毁窗口 ===\n");

console.log("W.destroyWin(hwnd)  销毁指定句柄的窗口\n");

console.log("1. 先创建一个新窗口用于演示");
var entry = "code/window/create/win.html";
var hwnd = W.createWin({
    entry: entry,
    width: 500,
    height: 400,
    title: "待销毁窗口",
    bgColor: "#F0F0F0"
});
console.log("   新窗口句柄: " + hwnd);

console.log("\n2. 3 秒后销毁该窗口");
setTimeout(function () {
    W.destroyWin(hwnd);
    console.log("   已销毁窗口: " + hwnd);
    console.log("   注意: 不要用这个 API 销毁主窗口, 主窗口请用 W.exitApp()");
}, 3000);
