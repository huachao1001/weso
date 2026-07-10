var name = "WESO_TEST_VAR";

console.log("=== 环境变量读写示例 ===\n");

console.log("1. 读取设置前的值");
var before = W.getEnv(name);
console.log("   " + name + " = " + before);

console.log("\n2. 设置环境变量");
var val = "hello_weso";
console.log("   " + name + " = " + val);
W.setEnv({ name: name, val: val });

console.log("\n3. 读取设置后的值");
var after = W.getEnv(name);
console.log("   " + name + " = " + after);

console.log("\n4. 追加模式 (append=true)");
console.log("   向 " + name + " 追加 _append");
W.setEnv({ name: name, val: "_append", append: true });

console.log("\n5. 读取追加后的值");
var appended = W.getEnv(name);
console.log("   " + name + " = " + appended);
