async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);
    var path = outputDir + "\\text_output.txt";

    var content = "Hello, Weso!";

    console.log("1. 写入文本文件");
    console.log("  写入内容: " + content);
    var result = await W.writeFile({ path: path, data: content, encoding: "utf-8" });

    console.log("  写入结果: " + result);
    console.log("  文件路径: " + path);

    console.log("\n2. 读取文本文件");
    var readContent = await W.readFile({ path: path, encoding: "utf-8" });
    console.log("  读取内容: " + readContent);
}
main();
