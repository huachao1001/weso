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

    // runPythonScript(script): script 是一段完整的 Python 源码, 可含多行/缩进。

    W.captureConsoleOutput(function (output) {
        // output 本身已带 print 的尾换行, 用 appendLog 直接写入,
        // 走 console.log 会被再追加一个 '\n' 导致每次输出多一空行。
        appendLog(output);
    });

    // 1. 简单 print
    await W.runPythonScript("print('Hello from Python!')");

    // 2. 数学运算
    await W.runPythonScript(`
print('1 + 2 =', 1 + 2)
print('10 * 10 =', 10 * 10)`);

    // 3. 列表推导
    await W.runPythonScript(`
squares = [x*x for x in range(1, 6)]
print('squares:', squares)
    `);

    // 4. 字符串处理
    await W.runPythonScript(`
name = 'weso'
print(name.upper())
print('-'.join(name))
    `);

    W.captureConsoleOutput();
    await W.deinitPython();
}
main();
