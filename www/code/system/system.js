console.log("=== 执行系统命令 ===\n");

var cmd = "dir c:\\";
console.log("执行命令: " + cmd);

W.system(cmd).then(function (output) {
    console.log("命令输出: " + output);
});
