async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);

    console.log("1. 写入二进制文件")
    // 写入二进制数据
    var path = outputDir + "\\binary_output.bin";
    console.log("  写入路径: " + path);

    // 字符串转Uint8Array
    var encoder = new TextEncoder();
    var data = encoder.encode("Hello, Weso!");


    console.log("  写入内容: ", Array.from(data));
    // 写入文件
    var result = await W.writeFile({
        path: path,
        data: data,
        encoding: "binary"
    });

    console.log("  写入结果: " + result);

    // 读取二进制数据
    console.log("\n2. 读取二进制文件")
    // encoding=binary 时, W.readFile 直接返回 Uint8Array, 无需再手动 atob。
    var bytes = await W.readFile({ path: path, encoding: "binary" });
    console.log("  读取到(字节): " + JSON.stringify(Array.from(bytes)));

    // Uint8Array转回字符串
    var text = new TextDecoder('utf-8').decode(bytes);
    console.log("  解析结果: " + text);
}
main()