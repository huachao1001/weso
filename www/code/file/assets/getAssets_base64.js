async function main() {
    console.log("=== getAssets 读取 src 资产 (base64) ===\n");

    console.log("1. 以 base64 读取 www/assets/hello.txt");
    var b64 = await W.getAssets({ path: "assets/hello.txt", encoding: "base64" });
    console.log("  base64: " + b64);

    console.log("\n2. 浏览器侧 atob 解码");
    console.log("  解码: " + atob(b64));
}
main();
