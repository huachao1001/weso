// === DLL -> JS 消息通道: DLL 主动回推消息 ===
//
// 自定义 DLL: res/weso_msg_dll.dll
//   导出: Weso_SetHostAPI(host 注入入口) + start()/stop() (后台线程开关)

var dllPath = W.getRes("weso_msg_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("Dll 加载 OK, handle = " + dll.handle + "\n");

    // 1. 挂 listener + 注入 host 函数指针。DLL 没导出 Weso_SetHostAPI 时 reject。
    function onMsg(msg) {
        console.log("[from dll] " + JSON.stringify(msg));
    }

    console.log("--- addMsgListener: 注入 host 函数指针 ---");
    var ok = await dll.addMsgListener(onMsg);
    console.log("注入结果: " + ok + "   (期望 true)\n");

    // 2. 启动后台线程: DLL 每秒 post 一条 {"event":"tick","n":N}
    console.log("--- start: 启动 DLL 后台 post ---");
    var started = await dll.invoke("start", "i", []);
    console.log("start -> " + started + "   (期望 1, 已挂 listener 即可看到 tick)\n");

    // 让它跑 3.5 秒, 应能收到约 3 条 tick
    console.log("等待 3.5 秒, 观察 [from dll] 输出...");
    await new Promise(function (r) { setTimeout(r, 3500); });

    // 3. 停止后台线程
    console.log("\n--- stop: 停止 ---");
    await dll.invoke("stop", "v", []);
    console.log("已停止, 不应再有 tick\n");

    // 4. 解挂 listener
    dll.removeMsgListener(onMsg);
    console.log("listener 已解挂");

    dll.free();
    console.log("Dll 已 free, handle = " + dll.handle);
}

main().catch(function (e) { console.error(e); });
