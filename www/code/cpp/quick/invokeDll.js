console.log("=== 调用 DLL 函数 ===\n");

console.log("通过 W.invokeDll({ dll, func, proto, args }) 调用原生 DLL");
console.log("proto 可传字符串(如 'ipppu')或 { ret, params } 结构,类型名:int/uint/pointer/string/void...\n");
console.log("注:'p' 为通用指针类型 —— 传 JS string 当作字符串,传 JS number 当作地址\n");

// 示例: 调用 user32.dll 的 MessageBoxW 弹出系统消息框
// JS 侧只需把字符串参数声明为 pointer/string, native 会自动按字符串处理
// 传给 DLL(JS 无需关心底层 C 类型)。
W.invokeDll({
    dll: "user32.dll",
    func: "MessageBoxW",
    proto: { ret: "int", params: ["pointer", "string", "string", "uint"] }, //等价于'ipppu'
    args: [0, "这是 weso 调用 DLL 弹出的消息框", "DLL 调用示例", 0]
}).then(function (result) {
    console.log("MessageBoxW 返回值: " + result);
});
