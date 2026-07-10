// === invokeByHandle: 按句柄 + 导出名调用 ===
//
// 句柄在手, 不重复加载 DLL, 但每次调用仍按导出名查找。
// 适合只调用一次的导出; 频繁调用同一导出优先用 dllclass/invoke.js。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
var handle = W.loadDll(dllPath);
if (!handle) {
    console.error("loadDll 失败");
    throw new Error("loadDll failed");
}
console.log("DLL: " + dllPath + ", handle = " + handle + "\n");

async function main() {
    console.log("--- invokeByHandle ---");

    // int add(int,int)  proto 'iii'
    var r1 = await W.invokeByHandle({
        handle: handle, func: "add",
        proto: { ret: "int", params: ["int", "int"] },
        args: [3, 4]
    });
    console.log("add(3,4)          = " + r1 + "   (期望 7)");

    // double addd(double,double)  proto 'ddd'
    var r2 = await W.invokeByHandle({
        handle: handle, func: "addd",
        proto: { ret: "double", params: ["double", "double"] },
        args: [1.5, 2.5]
    });
    console.log("addd(1.5,2.5)     = " + r2 + "   (期望 4)");

    // int strlen_ptr(string)  proto 'ip' —— 传 JS string 当字符串
    var r3 = await W.invokeByHandle({
        handle: handle, func: "strlen_ptr",
        proto: { ret: "int", params: ["pointer"] },
        args: ["你好weso"]
    });
    console.log("strlen_ptr(\"你好weso\") = " + r3 + "   (期望 6)");

    // greet() -> string  proto 'p': 返回静态串指针(地址 number)
    var greetPtr = await W.invokeByHandle({
        handle: handle, func: "greet",
        proto: { ret: "pointer", params: [] },
        args: []
    });
    console.log("greet() -> 地址 " + greetPtr + "   (内容 JS 读不到)");

    W.freeDll(handle);
    console.log("\n已释放模块");
}
main().catch(function (e) { console.error(e); });
