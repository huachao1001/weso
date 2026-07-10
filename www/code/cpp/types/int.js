// === 整数类型: int / uint / short / ushort / uchar ===
//
// 覆盖有符号/无符号、不同位宽的整型入参与返回。proto 代码:
//   i int   u uint   s short   S ushort   b uchar
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("DLL: " + dllPath + "\n");

    // int add(int,int)  proto 'iii'
    console.log("add(3,4)            = " + await dll.invoke("add", "iii", [3, 4])       + "   (期望 7)");

    // int add4(int,int,int,int)  proto 'iiiii'  —— 多参数传递
    console.log("add4(1,2,3,4)       = " + await dll.invoke("add4", "iiiii", [1, 2, 3, 4]) + "   (期望 10)");

    // unsigned int add_u(uint,uint)  proto 'uuu'  —— 两个 >INT_MAX 的数, 验证无符号
    console.log("add_u(3e9,1e9)      = " + await dll.invoke("add_u",
        { ret: "uint", params: ["uint", "uint"] },
        [3000000000, 1000000000]) + "   (期望 4000000000)");

    // short add_s(short,short)  proto 'sss'
    console.log("add_s(1000,2000)    = " + await dll.invoke("add_s",
        { ret: "short", params: ["short", "short"] },
        [1000, 2000]) + "   (期望 3000)");

    // unsigned short add_S(ushort,ushort)  proto 'SSS'
    console.log("add_S(40000,20000)  = " + await dll.invoke("add_S",
        { ret: "ushort", params: ["ushort", "ushort"] },
        [40000, 20000]) + "   (期望 60000)");

    // unsigned char byte_and(uchar,uchar)  proto 'bbb'  —— 1 字节按位与
    console.log("byte_and(0xAB,0x0F) = " + await dll.invoke("byte_and",
        { ret: "uchar", params: ["uchar", "uchar"] },
        [0xAB, 0x0F]) + "   (期望 11=0x0B)");

    dll.free();
}
main().catch(function (e) { console.error(e); });
