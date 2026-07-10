// === loadDll / freeDll / getProcAddr: 句柄与地址原语 ===
//
// 对照 quick/invokeDll.js(自动加载/释放的便捷模式), 这里把生命周期拆开:
// JS 显式 load -> 查找导出地址 -> 显式 free。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

// ---- 1. loadDll: 拿到模块句柄(number) ----
var handle = W.loadDll(dllPath);
if (!handle) {
    console.error("loadDll 失败, DLL 路径不对或位数不符(注意 weso 是 x64 进程, DLL 也必须是 x64)");
    throw new Error("loadDll failed");
}
console.log("loadDll OK, handle = " + handle + "\n");

// ---- 2. getProcAddr: 把导出名解析成函数地址(number) ----
// 地址在模块存活期间稳定, 可缓存复用。
var addrAdd    = W.getProcAddr(handle, "add");
var addrStrlen = W.getProcAddr(handle, "strlen_ptr");
console.log("getProcAddr:");
console.log("  add        @ " + addrAdd);
console.log("  strlen_ptr @ " + addrStrlen + "\n");

// ---- 3. freeDll: 释放模块 ----
// 释放后句柄不再可用, JS 必须自己管理生命周期。
var ok = W.freeDll(handle);
console.log("freeDll -> " + ok + "   (期望 true)");
console.log("已释放模块, handle " + handle + " 不再可用");
