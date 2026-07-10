async function main() {
    console.log("=== getRes 读取 res 资源 ===\n");

    console.log("说明: res/ 资源不加密、落盘于 <resFolder>/, 可直接路径访问;");
    console.log("      getRes 把相对路径解析为绝对路径, 再用 readFile 读取。\n");

    console.log("1. 获取 res/config.json 的绝对路径");
    var path = W.getRes("config.json");
    console.log("  绝对路径: " + path);

    console.log("\n2. 用 readFile 读取该路径内容");
    var content = await W.readFile({ path: path, encoding: "utf8" });
    console.log("  内容:\n" + content);
}
main();
