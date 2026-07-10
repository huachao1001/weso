// === Dll 类: 基础用法 ===
//
// new Dll(path) 加载, .invoke(func, proto, args) 调用(自动缓存导出地址, 性能最优),
// .free() 释放。生命周期全归 JS 管, 不会自动释放, 必须显式 free/dispose。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("Dll 实例创建 OK, handle = " + dll.handle + "\n");

    // .invoke: 首次调用某导出时自动查找并缓存地址, 之后直接用缓存地址调用
    console.log("--- 基础调用 (.invoke) ---");
    console.log("add(7,8)        = " + await dll.invoke("add",    "iii", [7, 8])       + "   (期望 15)");
    console.log("addd(2.5,3.5)   = " + await dll.invoke("addd",   "ddd", [2.5, 3.5])   + "   (期望 6)");
    console.log("ptr_size()      = " + await dll.invoke("ptr_size", "i",  [])          + "   (期望 8)");

    // 同一导出再调一次, 命中地址缓存
    console.log("add(100,1) 再次  = " + await dll.invoke("add", "iii", [100, 1]) + "   (期望 101, 命中缓存)");

    dll.free();
    console.log("\nfree() 后 handle = " + dll.handle + "   (期望 0)");

    // 释放后再调用会被拒绝
    try {
        await dll.invoke("add", "iii", [1, 1]);
    } catch (e) {
        console.log("释放后再调用被拒绝: " + e.message + "   (符合预期)");
    }
}
main().catch(function (e) { console.error(e); });
