// === Dll 类: 有状态导出与句柄稳定验证 ===
//
// next_counter 每调一次自增。如果 Dll 实例始终保持着同一模块的加载状态,
// 连调三次应得 1, 2, 3 —— 这正是 Dll 类相比 invokeDll(每次自动加载/释放)
// 的核心价值: 不光省去重复加载的开销, 还能让 DLL 的内部状态跨调用存活。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    var dll = new W.Dll(dllPath);

    // reset_counter 清零内部计数, 然后 next_counter 连调三次
    console.log("--- 有状态导出: 验证句柄稳定(next_counter 自增) ---");
    await dll.invoke("reset_counter", "v", []);
    var c1 = await dll.invoke("next_counter", "i", []);
    var c2 = await dll.invoke("next_counter", "i", []);
    var c3 = await dll.invoke("next_counter", "i", []);
    console.log("next_counter x3 = " + c1 + ", " + c2 + ", " + c3 + "   (期望 1, 2, 3)");

    if (c1 === 1 && c2 === 2 && c3 === 3) {
        console.log("✓ 句柄稳定: 同一 Dll 实例的模块状态确实跨调用存活");
    } else {
        console.error("✗ 状态不对: 模块可能被反复加载/释放, 句柄未保持");
    }

    dll.free();
}
main().catch(function (e) { console.error(e); });
