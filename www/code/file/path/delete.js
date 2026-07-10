var outputDir = W.getWorkspace() + "\\output";
W.mkdirs({ dir: outputDir });

var testFile = outputDir + "\\temp.txt";

console.log("1. 创建空文件用于演示");
W.createFile(testFile);


console.log("\n2. 执行删除");
if (W.exists(testFile)) {
    var deleted = W.delPath(testFile);
    console.log("   删除结果: " + deleted);
}


