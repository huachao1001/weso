// === Dll 类: .call / .callAddr ===
//
// .call(func, proto, args): 不缓存地址, 适合只调用一次的导出。
// .callAddr(addr, proto, args): 直接按地址调, 适合 addr 来自外部。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    var dll = new W.Dll(dllPath);

    // .call: 不缓存地址, 适合一次性调用
    console.log("--- .call (不缓存地址) ---");
    console.log("call('add4','iiiii',[1,2,3,4]) = " + await dll.call("add4", "iiiii", [1, 2, 3, 4]) + "   (期望 10)");

    // 字符串入参同样可用
    console.log("call('strlen_ptr','ip',['测试ABC']) = " + await dll.call("strlen_ptr",
        { ret: "int", params: ["pointer"] }, ["测试ABC"]) + "   (期望 5)");

    // .addr: 取导出地址(number)
    console.log("\n--- .addr 取地址 ---");
    var addr = dll.addr("add");
    console.log("dll.addr('add') = " + addr);

    // .callAddr: 直接按地址调
    console.log("callAddr(addr,'iii',[5,6]) = " + await dll.callAddr(addr, "iii", [5, 6]) + "   (期望 11)");

    dll.free();
}
main().catch(function (e) { console.error(e); });
