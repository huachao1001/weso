// === Dll 类: 字符串与指针返回链式 ===
//
// greet() 返回静态串的地址(number), 把它喂回 first_char / strlen_ptr,
// 端到端验证 DLL 返回的指针能在 JS 里当 number 流转再传回去。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");
console.log("DLL 路径: " + dllPath + "\n");

async function main() {
    var dll = new W.Dll(dllPath);

    console.log("--- 字符串内容读取 / 指针返回链式 ---");
    console.log("first_char(\"ABC\") = " + await dll.invoke("first_char",
        { ret: "int", params: ["pointer"] }, ["ABC"]) + "   (期望 65='A')");

    var greetPtr = await dll.invoke("greet", { ret: "pointer", params: [] }, []);
    console.log("greet() -> 地址 " + greetPtr + "   (内容 JS 读不到, 但地址可流转)");

    var greetLen = await dll.invoke("strlen_ptr",
        { ret: "int", params: ["pointer"] }, [greetPtr]);
    console.log("strlen_ptr(greet()) = " + greetLen + "   (期望 12, \"Hello, weso!\")");

    dll.free();
}
main().catch(function (e) { console.error(e); });
