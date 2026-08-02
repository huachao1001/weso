// === 跨域访问外网 (自动 Referer) ===
// weso 已放开 CORS, 本地页面可直接 fetch 外网。
// 不传 referrer 时, 会自动把目标域名作为 Referer 发出。

async function main() {
    // --- 1. 跨域抓取百度首页 ---
    var baidu = "https://www.baidu.com/";
    console.log("=== 跨域访问外网 ===\n");
    console.log("请求: " + baidu);
    try {
        var r1 = await fetch(baidu);
        var html = await r1.text();
        console.log("HTTP 状态: " + r1.status + " " + r1.statusText);
        console.log("HTML 长度: " + html.length + " 字节");
        console.log("<title>: " + (html.match(/<title>([\s\S]*?)<\/title>/i)
            ? RegExp.$1.trim() : "(未找到)"));
        console.log("-> 跨域抓取成功 (CORS 已放开)\n");
    } catch (e) {
        console.error("百度请求失败: " + e);
    }

    // --- 2. 验证自动 Referer ---
    var hb = "https://httpbin.org/headers";
    console.log("=== 自动 Referer ===\n");
    console.log("请求: " + hb + "  (httpbin 原样回显请求头)");
    console.log("未传 referrer, weso 自动补目标域名作 Referer\n");
    try {
        var r2 = await fetch(hb);
        var d = await r2.json();
        var ref = d.headers["Referer"] || d.headers["referer"];
        console.log("发出去的 Referer = " + ref);
        console.log('预期: "https://httpbin.org"  (目标域名 origin)\n');
    } catch (e) {
        console.error("httpbin 请求失败: " + e);
        console.log("(httpbin 偶有波动, 不影响上一步已验证的跨域能力)");
    }
}

main()
