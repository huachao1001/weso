// ============================================================================
//  inject.js  ——  由 weso.json 的 "injectJS" 属性声明
// ----------------------------------------------------------------------------
//  injectJS 是 weso.json 的静态字段: weso 启动时读取它, 把本文件注入到
//  **主入口窗口**(entry 声明的页面)。
//
//  injectJS 主要面向 **在线网页**: 把 weso.json 的 entry 指向在线网站
//  (如 "https://example.com/"), 再配 injectJS, 即可往该网站注入自定义逻辑
//  (改造 UI / 拦截请求 / 注入 API 等)。本地页面同样会被注入, 但通常无此需要。
//
//  注意:
//  · 只作用于主入口窗口, *不会* 注入 W.createWin 动态创建的子窗口。
//  · 部分在线网站设有 CSP(Content-Security-Policy) 会拦截注入脚本, 可能不生效;
//    CSP 宽松的站点(example.com / bing.com 等)演示最稳定。
// ============================================================================

(function () {
    if (window.__wesoInjected) return;
    window.__wesoInjected = true;

    // 把一组示例函数挂到全局, 供页面 / 示例脚本调用
    window.__wesoInject = {
        version: "1.0.0",

        // 返回固定问候语
        greet: function (name) {
            return "Hello " + (name || "Weso") + " from inject.js!";
        },

        // 返回当前页面信息
        pageInfo: function () {
            return {
                href: location.href,
                host: location.hostname || "(local)",
                readyState: document.readyState,
                title: document.title
            };
        },

        // 在页面右上角弹一条 toast, 3 秒后自动消失
        toast: function (msg) {
            var el = document.createElement("div");
            el.textContent = msg;
            el.style.cssText = [
                "position:fixed",
                "left:50%",
                "top:50%",
                "transform:translate(-50%,-50%)",
                "z-index:2147483647",
                "padding:8px 14px",
                "background:#2563eb",
                "color:#fff",
                "font:13px/1.4 system-ui,sans-serif",
                "border-radius:8px",
                "box-shadow:0 4px 14px rgba(0,0,0,0.25)"
            ].join(";");
            document.body.appendChild(el);
            setTimeout(function () { el.remove(); }, 3000);
        }
    };
})();