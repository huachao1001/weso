// === 混型参数: int 与 double 交错 ===
//
// 验证不同类型交错传递时各参数能正确对齐。proto 'idid'。
// 10 + 1.5 + 20 + 2.5 = 34.0, 任何参数错位都会得到明显不同的数。
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("DLL: " + dllPath + "\n");

    // double add_mixed(int,double,int,double)  proto 'idid'
    // 注意顺序: a/b 是 int, c/d 是 double
    console.log("add_mixed(10,1.5,20,2.5) = " + await dll.invoke("add_mixed",
        { ret: "double", params: ["int", "double", "int", "double"] },
        [10, 1.5, 20, 2.5]) + "   (期望 34)");

    dll.free();
}
main().catch(function (e) { console.error(e); });
