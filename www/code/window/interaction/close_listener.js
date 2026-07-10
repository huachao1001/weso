console.log("=== 拦截关闭按钮 ===\n");

console.log("W.setOnClickCloseIconListener(listener)");
console.log("  设置后点击窗口关闭按钮不会退出, 而是触发 listener\n");

W.setOnClickCloseIconListener(function () {
    console.log("用户点击了关闭按钮, 已拦截");

    confirm("确认退出吗?", function () {
        console.log("用户确认退出");
        W.exitApp();
    }, function () {
        console.log("用户取消退出, 继续运行");
    });
});

console.log("已注册, 现在点击窗口右上角关闭按钮试试");
