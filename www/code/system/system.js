console.log("=== 执行系统命令 ===\n");

var cmd = "dir c:\\";
console.log("执行命令: " + cmd);

var output = await W.system(cmd);
console.log("命令输出: " + output);
