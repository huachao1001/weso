console.log("=== 鼠标 Hook ===\n");

console.log("W.hookMouse(cb)");
console.log("  cb 收到 { type, extra, x, y }");
console.log("  type:  'move' | 'down' | 'up' | 'scroll'");
console.log("  extra: 'left'/'mid'/'right' (down/up) | 滚轮 delta (scroll) | '' (move)");
console.log("  x/y:   屏幕坐标\n");

// move 事件触发极频繁, 直接打印会刷屏; 用节流每隔 300ms 输出一次最新位置.
var MOVE_THROTTLE_MS = 300;
var lastMoveLog = 0;

W.hookMouse(function (e) {
    var label = e.type;
    if (e.type === "down" || e.type === "up") {
        label += " (" + e.extra + ")";
    } else if (e.type === "scroll") {
        label += " delta=" + e.extra;
    } else if (e.type === "move") {
        var now = Date.now();
        if (now - lastMoveLog < MOVE_THROTTLE_MS) return;
        lastMoveLog = now;
    }
    console.log(label + "  x=" + e.x + "  y=" + e.y);
});

console.log("Hook 已启动, 移动/点击/滚动鼠标查看输出, 5 秒后自动停止\n");
console.log("(move 每 " + MOVE_THROTTLE_MS + "ms 打印一次, 其余事件实时打印)\n");

setTimeout(function () {
    W.unhookMouse();
    console.log("\n鼠标 Hook 已停止");
}, 5000);
