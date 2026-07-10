async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);

    console.log("=== 文件选取示例 ===\n");
    console.log("目录：", outputDir);

    console.log("1. 选择单个文件:");
    // 等价于 W.openFileSelector({ path: outputDir, multiSelect: false, onlyFolder: false });
    var files = await W.openFileSelector(outputDir);
    console.log("   选择的文件: ", files);

    console.log("\n2. 选择多个文件:");
    var multiFiles = await W.openFileSelector({ path: outputDir, multiSelect: true, onlyFolder: false });
    console.log("   选择的文件: ", multiFiles);

    console.log("\n3. 选择单个目录:");
    var dirs = await W.openFileSelector({ path: outputDir, multiSelect: false, onlyFolder: true });
    console.log("   选择的目录: ", dirs);

    console.log("\n4. 选择多个目录:");
    var multiDirs = await W.openFileSelector({ path: outputDir, multiSelect: true, onlyFolder: true });
    console.log("   选择的目录: ", multiDirs);
}
main();
