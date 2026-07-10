console.log("=== 键盘 Hook ===\n");

console.log("W.hookKeyboard(cb)");
console.log("  cb 收到 { type: 'keydown'|'keyup', code: number }");
console.log("  code 为 Windows 虚拟键码 (VK_*)\n");

W.hookKeyboard(function (e) {
    console.log("type=" + e.type + "  code=" + e.code);
});

console.log("Hook 已启动, 按任意键查看输出, 5 秒后自动停止\n");

setTimeout(function () {
    W.unhookKeyboard();
    console.log("\n键盘 Hook 已停止");
}, 5000);
