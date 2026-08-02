// === 自定义 Referer (手动覆盖 / 不发送) ===
// 用标准 fetch 的 init.referrer 即可:
//   fetch(url, {referrer:"https://www.example.com/"})  -> 用自定义值
//   fetch(url, {referrer:""})                          -> 不发 Referer
//   fetch(url)                                         -> 自动补目标域名 (见上一个示例)

async function main() {
    var url = "https://httpbin.org/headers";   // 原样回显请求头

    // --- 1. 自定义 Referer ---
    var myReferer = "https://www.example.com/";
    console.log("=== 自定义 Referer ===\n");
    console.log("请求: " + url);
    console.log("referrer = " + myReferer + "\n");
    try {
        var r1 = await fetch(url, { referrer: myReferer });
        var d1 = await r1.json();
        console.log("发出去的 Referer = " + (d1.headers["Referer"] || d1.headers["referer"]));
        console.log('预期: "' + myReferer + '"\n');
    } catch (e) {
        console.error("请求失败: " + e);
    }

    // --- 2. 不发 Referer ---
    console.log("=== 不发 Referer ===\n");
    console.log("请求: " + url);
    console.log('referrer = ""  (空串 -> 不发送)\n');
    try {
        var r2 = await fetch(url, { referrer: "" });
        var d2 = await r2.json();
        var ref2 = d2.headers["Referer"] || d2.headers["referer"];
        console.log("发出去的 Referer = " + (ref2 === undefined ? "(无, 未发送)" : ref2));
        console.log("预期: 回显里不含 Referer");
    } catch (e) {
        console.error("请求失败: " + e);
    }
    console.log("\n(若失败请检查外网连通性, httpbin.org 偶有波动)");
}

main()
