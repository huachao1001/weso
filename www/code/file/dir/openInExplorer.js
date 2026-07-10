var outputDir = W.getWorkspace() + "\\output";
W.mkdirs(outputDir);

console.log("=== 在资源管理器中显示文件 ===\n");

console.log("\n1. 先构建一个示例文件")
var testFile = outputDir + "\\open_explorer_test.txt";
W.writeFile({ path: testFile, data: "测试文件", encoding: "utf-8" });

console.log("\n2. 在文件管理器中显示文件")
console.log("文件路径: " + testFile);

var rs = W.openInExplorer(testFile);

console.log(rs ? "已打开" : "打开失败");
