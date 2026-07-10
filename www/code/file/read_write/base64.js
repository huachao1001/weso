async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);

    console.log("1. 写入base64内容")
    var path = outputDir + "\\base64_output.txt";
    var content = "Hello weso!";
    var b64 = btoa(content);
    console.log(" 写入内容：", content + " -> " + b64);

    //写入base64编码时，会自动解码为二进制写入文件
    var result = await W.writeFile({ path: path, data: b64, encoding: "base64", offset: 0 });

    console.log(" 写入结果: " + result);
    console.log(" 文件路径: " + path);

    console.log("\n2. 读取base64内容")
    //以base64编码读取文件时，自动将二进制文件编码为base64字符串
    var readContent = await W.readFile({ path: path, encoding: "base64" });
    console.log("读取内容: " + readContent);
}
main()