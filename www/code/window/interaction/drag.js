console.log("=== 绑定窗口拖拽 ===\n");

console.log("W.bindDragWin(element, onDlbClick)");
console.log("  把某元素绑定后, 在该区域按住鼠标可拖动窗口");
console.log("  双击触发 onDlbClick(x, y) 回调\n");

console.log("在页面顶部插入一条可拖动的伪标题栏...");
var bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:30px;background:#2563eb;color:#fff;text-align:center;line-height:30px;z-index:99999;cursor:default;';
bar.textContent = '拖动我移动窗口 / 双击我切换最大化';
document.body.appendChild(bar);

W.bindDragWin(bar, function (x, y) {
    console.log("双击标题栏: x=" + x + ", y=" + y);
    if (W.isWindowMaximized()) {
        W.normWindow();
        console.log("  -> 已还原窗口");
    } else {
        W.maxWindow();
        console.log("  -> 已最大化窗口");
    }
});

console.log("已绑定, 试着拖动顶部蓝条或双击它");
