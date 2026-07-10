console.log("=== 屏幕与任务栏尺寸 ===\n");

console.log("1. 屏幕矩形 (getScreenRect):");
var screen = W.getScreenRect();
console.log("   " + JSON.stringify(screen));
console.log("   宽: " + (screen.right - screen.left) + ", 高: " + (screen.bottom - screen.top));

console.log("\n2. 任务栏矩形 (getTaskbarRect):");
var taskbar = W.getTaskbarRect();
console.log("   " + JSON.stringify(taskbar));
console.log("   宽: " + (taskbar.right - taskbar.left) + ", 高: " + (taskbar.bottom - taskbar.top));

console.log("\n用途: 计算窗口可放置区域时, 需要避开任务栏");
