// === invokeByAddr: 按函数地址调用 ===
//
// 用 getProcAddr 拿到的地址直接调用, 不再经过导出名查找, 最快路径。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
var handle = W.loadDll(dllPath);
if (!handle) {
    console.error("loadDll 失败");
    throw new Error("loadDll failed");
}
console.log("DLL: " + dllPath + ", handle = " + handle + "\n");

// 先用 getProcAddr 把导出名解析成地址(模块存活期间稳定)
var addrAdd     = W.getProcAddr(handle, "add");
var addrAddd    = W.getProcAddr(handle, "addd");
var addrEcho    = W.getProcAddr(handle, "echo_ptr");
var addrStrlen  = W.getProcAddr(handle, "strlen_ptr");
var addrPtrSize = W.getProcAddr(handle, "ptr_size");
console.log("getProcAddr 完成, 用这些地址直接调用:\n");

async function main() {
    console.log("--- invokeByAddr ---");

    var a1 = await W.invokeByAddr({ addr: addrAdd, proto: "iii", args: [10, 20] });
    console.log("add(10,20)        = " + a1 + "   (期望 30)");

    var a2 = await W.invokeByAddr({ addr: addrAddd, proto: "ddd", args: [100.5, 200.5] });
    console.log("addd(100.5,200.5) = " + a2 + "   (期望 301)");

    // echo_ptr(void*) -> void*  proto 'pp'
    // 传一个 number 当指针, 原样回传, 验证 64 位指针往返不截断
    var magic = 0x12345678ABCDEF00;
    var a3 = await W.invokeByAddr({
        addr: addrEcho,
        proto: { ret: "pointer", params: ["pointer"] },
        args: [magic]
    });
    console.log("echo_ptr(0x" + magic.toString(16) + ") = 0x" + Number(a3).toString(16) + "   (期望原值回传)");

    // ptr_size() -> int  proto 'i'  (x64 应为 8)
    var a4 = await W.invokeByAddr({ addr: addrPtrSize, proto: "i", args: [] });
    console.log("ptr_size()        = " + a4 + "   (期望 8, x64 进程)");

    // 按地址调用时字符串入参同样可用
    var a5 = await W.invokeByAddr({
        addr: addrStrlen,
        proto: { ret: "int", params: ["pointer"] },
        args: ["abcdef"]
    });
    console.log("strlen_ptr(addr)(\"abcdef\") = " + a5 + "   (期望 6)");

    W.freeDll(handle);
    console.log("\n已释放模块");
}
main().catch(function (e) { console.error(e); });
