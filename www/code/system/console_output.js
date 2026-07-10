// === 捕获控制台输出 ===

// 自定义 DLL: res/console_print_dll.dll (经 getRes 解析绝对路径)
var dllPath = W.getRes("console_print_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    // ------------------------------------------------------------
    // 自检: 仅主窗口能捕获。非主窗口直接退出并提示。
    // ------------------------------------------------------------
    if (W.getHWND() !== W.getMainHWND()) {
        console.log("!! 当前不是主窗口 (getHWND=" + W.getHWND()
            + " != getMainHWND=" + W.getMainHWND() + ")");
        console.log("!! captureConsoleOutput 在子窗口里无效");
        console.log("!! 子窗口需主窗口捕获后再用 W.postWinMsg 转发, 见下方说明\n");

        console.log("--- 子窗口转发说明 ---");
        console.log("  主窗口: W.captureConsoleOutput(function (out) {");
        console.log("      W.postWinMsg(childHWND, out);  // 转发给子窗口");
        console.log("  });");
        console.log("  子窗口: W.addWinMsgListener(function (data) {");
        console.log("      console.log(data);                                          ");
        console.log("  });");
        console.log("(postWinMsg / addWinMsgListener 用法见 窗口 -> 交互功能 -> 窗口间通信)");
        return;
    }
    console.log("当前是主窗口, 开始捕获\n");

    // ------------------------------------------------------------
    // 1. 注册 captureConsoleOutput 回调
    // ------------------------------------------------------------
    W.captureConsoleOutput(function (output, isStdOut) {
        var tag = isStdOut ? "[stdout]" : "[stderr]";
        // output 本身已带尾换行 (std::endl), 用 appendLog 直接写入,
        // 走 console.log 会被再追加一个 '\n' 导致每次输出多一空行。
        appendLog(tag + " " + output);
    });
    console.log("捕获已启动, 等待 DLL 打印...\n");

    // ------------------------------------------------------------
    // 2. 加载 DLL 并启动后台打印线程
    // ------------------------------------------------------------
    var dll = new W.Dll(dllPath);
    console.log("Dll 加载 OK, handle = " + dll.handle);

    var ret = await dll.invoke("start_print", "i", []);
    console.log("start_print -> " + ret + "   (1 = 新启动, 0 = 已在运行)");
    console.log("(DLL 后台线程每秒往 std::cout 打印, 每 5 次往 std::cerr 打一条)\n");

    // ------------------------------------------------------------
    // 3. 让它打印 6 秒, 然后停止并释放
    // ------------------------------------------------------------
    console.log("运行 6 秒后停止...\n");
    await new Promise(function (r) { setTimeout(r, 6000); });

    await dll.invoke("stop_print", "v", []);
    console.log("\nstop_print 已调用");

    dll.free();
    console.log("Dll 已 free, handle = " + dll.handle);

    // ------------------------------------------------------------
    // 4. 关闭捕获
    // ------------------------------------------------------------
    W.captureConsoleOutput();   // 不传 cb 即关闭
    console.log("控制台输出捕获已关闭");
}

main()