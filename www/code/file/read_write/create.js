var outputDir = W.getWorkspace() + "\\output";
W.mkdirs(outputDir);

var testFile = outputDir + "\\test_file.txt";

console.log("1. 创建空文件: " + testFile);
var created = W.createFile(testFile);
console.log("  创建结果: " + created);
if (!created) {
    if (W.exists(testFile)) {
        console.error("  文件已存在，请勿重复创建！")
    } else {
        console.log("  文件创建失败！请检查是否有权限创建文件。")
    }
}