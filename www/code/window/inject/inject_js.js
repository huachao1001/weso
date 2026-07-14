console.log("=== injectJS 属性演示 ===\n");

console.log("injectJS 是 weso.json 的静态字段, weso 启动时把指定 JS 注入到主入口窗口。");
console.log("它 **主要面向在线网页**: 把 entry 指向在线网站(如 https://example.com/),");
console.log("再配 injectJS, 即可往该网站注入自定义逻辑(改 UI / 拦截请求 / 注入 API 等)。");
console.log("本地页面同样会被注入, 但通常无此需要。\n");

console.log('本项目配置: "injectJS": "inject.js"');
console.log("inject.js 在本 playground 里执行, 往 window 上挂了 __wesoInject 对象。\n");

var api = window.__wesoInject;
console.log("__wesoInject.version = " + api.version);
console.log("api.greet('Weso')     = " + api.greet("Weso"));
console.log("api.pageInfo():");
console.log("  " + JSON.stringify(api.pageInfo(), null, 2).replace(/\n/g, "\n  "));

console.log("\n调用 api.toast(...) 在页面正中间弹一条提示(3 秒后消失):");
api.toast("inject.js 已注入本页面");
console.log("  已弹出, 请看页面正中");
