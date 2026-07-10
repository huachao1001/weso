async function main() {
    var outputDir = W.getWorkspace() + "\\output";
    W.mkdirs(outputDir);

    W.createFile(outputDir + "\\test_file.txt");
    W.mkdirs(outputDir + "\\test_dir");

    console.log("=== 列出目录内容 ===\n");
    console.log("目录: " + outputDir);

    // filter: 0=全部, 1=仅文件, 2=仅目录

    console.log("\n1. 全部内容 (filter=0):");

    // 等价于 W.listdir({ path: outputDir, filter: 0 });
    var allItems = await W.listdir(outputDir);
    console.log("  共 " + allItems.length + " 个");

    var files = await W.listdir({ path: outputDir, filter: 1 });
    console.log(`\n2. 仅文件 (filter=1, 共${files.length}个):`);
    files.forEach(function (item) {
        console.log("  " + item);
    });

    var dirs = await W.listdir({ path: outputDir, filter: 2 });
    console.log(`\n3. 仅目录 (filter=2, 共${dirs.length}个):`);
    dirs.forEach(function (item) {
        console.log("  " + item);
    });
}
main()

