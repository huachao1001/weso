// === 字符串 ===
//
// 'p'(pointer/string)为通用指针类型, 传 JS string 即当作字符串处理。
// 涵盖字符串入参与字符串指针返回(链式流转)。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("DLL: " + dllPath + "\n");

    // int strlen_ptr(string)  proto 'ip'  —— 返回字符串长度
    console.log("strlen_ptr(\"你好weso\") = " + await dll.invoke("strlen_ptr",
        { ret: "int", params: ["pointer"] },
        ["你好weso"]) + "   (期望 6)");

    // int first_char(string)  proto 'ip'  —— 返回首字符码点, 证明 DLL 能读到内容
    console.log("first_char(\"ABC\")     = " + await dll.invoke("first_char",
        { ret: "int", params: ["pointer"] },
        ["ABC"]) + "   (期望 65='A')");

    // greet() -> string  proto 'p'  —— 返回静态串指针(JS 拿到的是地址 number)
    var greetPtr = await dll.invoke("greet", { ret: "pointer", params: [] }, []);
    console.log("greet() -> 地址 " + greetPtr + "   (内容 JS 读不到, 但地址可流转)");

    // 把 greet 返回的地址再作为字符串入参喂回 strlen_ptr —— 端到端指针往返
    var greetLen = await dll.invoke("strlen_ptr",
        { ret: "int", params: ["pointer"] },
        [greetPtr]);
    console.log("strlen_ptr(greet())  = " + greetLen + "   (期望 12, \"Hello, weso!\")");

    dll.free();
}
main().catch(function (e) { console.error(e); });
