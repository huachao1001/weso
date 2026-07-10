console.log("=== 系统托盘 ===\n");

console.log("W.showTray(icon, title, items, cb)");
console.log("  items: Map<key, label>  ——  key 必须是整数, label 是菜单文本");
console.log("  点击菜单项时, cb 收到对应 key\n");

var items = new Map();
items.set(1, "显示主窗口");
items.set(2, "隐藏主窗口");
items.set(3, "最大化窗口");
items.set(4, "退出");

W.showTray("", "Weso 示例", items, function (key) {
    console.log("托盘菜单点击: key=", key);
    if (key === 1) {
        W.showWindow();
        console.log("  -> 显示主窗口");
    } else if (key === 2) {
        W.hideWindow();
        console.log("  -> 隐藏主窗口");
    } else if (key === 3) {
        W.maxWindow();
        console.log("  -> 最大化窗口");
    } else if (key === 4) {
        W.exitApp();
        console.log("  -> 退出应用");
    }
});

console.log("托盘已显示, 鼠标移到右下角查看");
