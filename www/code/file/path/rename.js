var outputDir = W.getWorkspace() + "\\output";
W.mkdirs({ dir: outputDir });

var testFile = outputDir + "\\temp.txt";

console.log("1. 创建空文件用于演示");
W.createFile(testFile);


console.log("\n2. 执行重命名");
var newName = "renamed.txt"
console.log(`  将${testFile}重命名为${newName}`)
if (W.exists(outputDir + "\\" + newName)) {
    console.error("目标文件已存在，请换个文件名")
} else {
    if (W.exists(testFile)) {
        var renamed = W.rename({ path: testFile, newName: newName });
        console.log("   重命名结果: " + renamed);
    }
}
