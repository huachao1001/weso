// === 浮点类型: float / double ===
//
// 覆盖单精度与双精度入参与返回。proto 代码:
//   f float   d double
//
// 自定义 DLL: res/weso_test_dll.dll (经 getRes 解析绝对路径)

var dllPath = W.getRes("weso_test_dll.dll");

async function main() {
    var dll = new W.Dll(dllPath);
    console.log("DLL: " + dllPath + "\n");

    // float addf(float,float)  proto 'fff'
    console.log("addf(1.25,2.25)     = " + await dll.invoke("addf", "fff", [1.25, 2.25]) + "   (期望 3.5)");

    // double addd(double,double)  proto 'ddd'
    console.log("addd(1.5,2.5)       = " + await dll.invoke("addd", "ddd", [1.5, 2.5])   + "   (期望 4)");
    console.log("addd(100.5,200.5)   = " + await dll.invoke("addd", "ddd", [100.5, 200.5]) + "   (期望 301)");

    dll.free();
}
main().catch(function (e) { console.error(e); });
