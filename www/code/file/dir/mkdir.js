var outputDir = W.getWorkspace() + "\\output";
W.mkdirs(outputDir);

var testDir = outputDir + "\\test_dir";

console.log("=== 目录操作示例 ===\n");

console.log("  创建目录: " + testDir);
var created = W.mkdirs(testDir);
console.log("  创建结果: " + created);
