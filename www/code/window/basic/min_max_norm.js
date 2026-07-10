console.log("=== 最小化 / 最大化 / 还原 ===\n");

console.log("1. 最小化窗口 (2 秒后继续)");
console.log("   调用 W.minWindow()");
W.minWindow();

setTimeout(function () {
    console.log("\n2. 最大化窗口 (2 秒后继续)");
    console.log("   调用 W.maxWindow()");
    W.maxWindow();
}, 2000);

setTimeout(function () {
    console.log("\n3. 还原为正常大小");
    console.log("   调用 W.normWindow()");
    W.normWindow();
}, 4000);
