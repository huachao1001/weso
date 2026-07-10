async function main() {
    console.log("=== getAssets 读取 src 资产 (utf8) ===\n");

    console.log("说明: www/ 里的资产随包用随机 key 加密, 无法直接文件读写,");
    console.log("      只能经 getAssets 接口间接读取 (浏览器也可直接加载)。\n");

    console.log("1. 读取 www/assets/hello.txt");
    var content = await W.getAssets({ path: "assets/hello.txt", encoding: "utf8" });
    console.log("  内容:\n" + content);
}
main();
