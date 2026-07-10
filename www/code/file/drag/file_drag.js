console.log("=== 文件拖拽监听 ===\n");

console.log("W.addFileDragListener(cb)");
console.log("  把文件/文件夹拖入窗口时触发 cb(path, isDir)");
console.log("  path:  拖入项的绝对路径");
console.log("  isDir: 是否为目录\n");

console.log("监听已启动, 把任意文件或文件夹拖入本窗口查看输出");
console.log("(支持多选, 一次拖入多个会分别回调)\n");

console.error("!! 注意: 请拖到右侧 [输出日志] 区域或窗口空白处");
console.error("!! 不要拖到左侧 [脚本编辑器] 代码框里 ——");
console.error("!! 代码框有自己的拖拽事件, 会拦截本监听, 导致收不到回调\n");

W.addFileDragListener(function (path, isDir) {
    var type = isDir ? "[目录]" : "[文件]";
    console.log(type + " " + path);
});
