async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);

    var path = outputDir + "\\lines_output.txt";

    // 1. 先写入多行文本
    var content = "第一行\n第二行\n第三行";
    var result = await W.writeFile({ path: path, data: content, encoding: "utf-8" });
    console.log("1. 写入多行内容");
    console.log("  写入结果: " + result);
    console.log("  文件路径: " + path);

    // 2. 读取多行
    var lines = await W.readLines({ path: path, encoding: "utf-8" });
    console.log("\n2. 读取多行");
    lines.forEach(function (line, index) {
        console.log("  第" + (index + 1) + "行: " + line);
    });
}

main()
