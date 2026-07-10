async function main() {
    var version = "3.12.10";

    // 先检查是否已安装, 未装则提示用户先跑 init.js 安装, 不直接 initPython (会失败)。
    if (!await W.isPythonInstalled(version)) {
        console.log("!! Python " + version + " 未安装, 请先运行 install.js 示例完成安装。");
        return;
    }

    // 初始化解释器: 加载 installPython 解压出的 python<XY>.dll 并启动子解释器,
    // 之后才能调用 runPythonScript / runPythonFile。
    // pyDir 可选, 指定 .py 源码目录名 (相对 workspace), 默认 "python/src"。
    if (!await W.initPython(version)) return;

    // runPythonFile(filePath): filePath 为 .py 文件的绝对路径。
    // .py 源码放在 workspace/python/src/ 下 (debug 模式直接读磁盘; release 模式
    // 建议 runPythonScript 经 meta_path importer 加载编译后的 .pyc)。
    W.captureConsoleOutput(function (output) {
        // output 本身已带 print 的尾换行, 用 appendLog 直接写入,
        // 走 console.log 会被再追加一个 '\n' 导致每次输出多一空行。
        appendLog(output);
    });

    var pyPath = W.getWorkspace() + "\\python\\src\\hello.py";
    // 返回 PyRun_SimpleFile 退出码, 0=成功
    await W.runPythonFile(pyPath);

    var pyPath2 = W.getWorkspace() + "\\python\\src\\compute.py";
    await W.runPythonFile(pyPath2);

    W.captureConsoleOutput();
    await W.deinitPython();
}
main();
