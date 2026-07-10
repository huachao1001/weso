async function main() {
    var version = "3.12.10";

    // 先检查是否已安装, 未装则提示用户先跑 install.js 安装, 不直接 initPython (会失败)。
    if (!await W.isPythonInstalled(version)) {
        console.log("!! Python " + version + " 未安装, 请先运行 install.js 示例完成安装。");
        return;
    }

    if (!await W.initPython(version)) return;

    W.captureConsoleOutput(function (output) {
        // output 本身已带 print 的尾换行, 用 appendLog 直接写入,
        // 走 console.log 会被再追加一个 '\n' 导致每次输出多一空行。
        appendLog(output);
    });

    // 用户 .py 模块在 workspace/python/src/ 下; 把该目录 append 到 sys.path
    // 后即可 import mymodule (debug 模式直接 .py; release 模式走 .pyc importer)。
    var moduleDir = W.getWorkspace() + "\\python\\src";

    await W.runPythonScript(
        "import sys\n" +
        "sys.path.append(r'" + moduleDir + "')\n" +
        "try:\n" +
        "    import mymodule\n" +
        "    mymodule.greet('weso')\n" +
        "    print('add(3, 4) =', mymodule.add(3, 4))\n" +
        "except ImportError as e:\n" +
        "    print('import failed:', e)"
    );

    W.captureConsoleOutput();
    await W.deinitPython();
}
main();
