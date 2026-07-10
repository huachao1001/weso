console.log("=== 查询窗口状态 ===\n");

console.log("1. 当前状态:");
console.log("   isWindowMaximized: " + W.isWindowMaximized());
console.log("   isWindowVisible:   " + W.isWindowVisible());

console.log("\n2. 最大化后再次查询:");
W.maxWindow();
console.log("   isWindowMaximized: " + W.isWindowMaximized());
console.log("   isWindowVisible:   " + W.isWindowVisible());

console.log("\n3. 还原后再次查询:");
W.normWindow();
console.log("   isWindowMaximized: " + W.isWindowMaximized());
console.log("   isWindowVisible:   " + W.isWindowVisible());
