async function main() {
    console.log("=== 安装 Python ===\n");

    // 推荐版本 (USTC 镜像实测可下载的稳定版, 含 python-<ver>-embed-amd64.zip)。
    // 完整可装版本列表见 https://mirrors.ustc.edu.cn/python (3.10+ 稳定版目录),
    // 部分补丁版本目录存在但缺 Windows embed 包 (如 3.10.12-20), 不要选。
    //   3.10.11  — 3.10 分支最新稳定版
    //   3.11.9   — 3.11 分支最新稳定版
    //   3.12.10  — 3.12 分支最新稳定版
    //   3.13.14  — 3.13 分支最新稳定版
    //   3.14.6   — 3.14 分支最新稳定版 (当前最新可用)
    var version     = "3.12.10";
    var urlRoot     = "https://mirrors.ustc.edu.cn/python";  // 空 = 用默认镜像
    // pyDir 是「用户 .py 源码目录名」(相对 workspace), 不是解释器安装目录。
    // 解释器固定装到 python\py3\<version>\;
    // pyDir 只影响 sys.path (initPython 后 runPythonScript import 用户模块时的搜索路径)
    // 和打包时 .py 编译为 .pyc 的源码目录。两者是独立路径, 不要混淆。
    var pyDir       = "python/src";
    var pipProxy    = "";          // pip index url, 暂未使用, 预留给未来运行时 pip
    var force       = false;       // true = 跳过 isPythonInstalled 强制重下

    if (await W.isPythonInstalled(version)) {
        console.log("[1/1] Python " + version + " 已安装, 跳过下载\n");
    } else {
        console.log("[1/1] 正在下载并解压 Python " + version + ", 包约 10MB+, 可能需要一两分钟, 请耐心等待...");
        console.log("      镜像: " + urlRoot);
        var ok = await W.installPython({
            version: version,
            pythonProxy: urlRoot,
            pipProxy: pipProxy,
            pyDir: pyDir,
            force: force
        });
        if (ok) {
            console.log("      安装完成: " + version + "\n");
        } else {
            console.log("!! 安装失败: 下载或解压出错, 请重试或检查网络\n");
            return;
        }
    }


}
main();
