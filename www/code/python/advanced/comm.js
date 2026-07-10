async function main() {
    var version = "3.12.10";

    // 先检查是否已安装, 未装则提示用户先跑 install.js 安装, 不直接 initPython (会失败)。
    if (!await W.isPythonInstalled(version)) {
        console.log("!! Python " + version + " 未安装, 请先运行 install.js 示例完成安装。");
        return;
    }

    // JS <-> Python 双向通信:
    //   Python -> JS: Python 调 weso.post_msg(obj), 经 native __post_str_msg 转发
    //                 到 __pyMsg 通道, JS 用 addPythonMsgListener 接收 (cb 收到的
    //                 是 JSON 解析后的对象, 不是字符串)。
    //   JS -> Python: 把数据 JSON.stringify 后拼进 runPythonScript 传给 Python。
    // removePythonMsgListener 需传同一引用 (与 add 配对), 匿名函数无法 remove。
    function onPyMsg(data) {
        console.log(data);
    }
    W.addPythonMsgListener(onPyMsg);

    if (!await W.initPython(version)) return;

    // 1. Python 主动向 JS 发一条消息
    await W.runPythonScript(
        "import weso\n" +
        "weso.post_msg({'type': 'greeting', 'msg': 'hello from python'})"
    );

    // 2. JS -> Python -> JS: 把数组传给 Python 求和后回传
    var nums = [1, 2, 3, 4, 5];
    await W.runPythonScript(
        "import weso\n" +
        "nums = " + JSON.stringify(nums) + "\n" +
        "weso.post_msg({'type': 'sum', 'input': nums, 'result': sum(nums)})"
    );

    // 3. 取消监听, 之后 Python 的 post_msg 不再触发 onPyMsg
    W.removePythonMsgListener(onPyMsg);
    await W.runPythonScript(
        "import weso\n" +
        "weso.post_msg({'type': 'after_remove'})" // 这条不会被打印
    );

    await W.deinitPython();
}
main();
