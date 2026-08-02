# Weso JS — Network 模块参考

weso 对标准 `fetch` 做了两点增强，**API 不变**，仍按浏览器写法用 `fetch(url, init)`：

1. **CORS 已放开**（`--disable-web-security`）——本地页面可直接 `fetch` 任意外部网站，
   无需代理、无需后端转发。
2. **Referer 由 C++ 网络层 (`WebResourceRequested`) 改写**——WebView2 会忽略
   `init.referrer`、且 `Referer` 是 forbidden header 不能经 `fetch` headers 设置，
   weso 把 `init.referrer` 转成真实 `Referer` 发出。

> 无新增 `W.*` 函数。下面按 Referer 行为分三种用法。

---

## 用法 1：自动补目标域名（默认）

不传 `referrer` 时，weso 自动把**目标请求的域名 origin** 作为 `Referer` 发出，
使目标接口视为同源请求。用户无需任何额外设置。

```js
var r = await fetch("https://www.baidu.com/");
// 发出去的 Referer = https://www.baidu.com
```

验证（httpbin 原样回显请求头）：

```js
var d = await (await fetch("https://httpbin.org/headers")).json();
console.log(d.headers["Referer"] || d.headers["referer"]);
// -> "https://httpbin.org"
```

---

## 用法 2：自定义 Referer

`init.referrer` 传非空字符串，按自定义值发出。

```js
var myReferer = "https://www.example.com/";
var r = await fetch(url, { referrer: myReferer });
// 发出去的 Referer = https://www.example.com/
```

---

## 用法 3：不发 Referer

`init.referrer` 传空串 `""`，不发送 `Referer`。

```js
var r = await fetch(url, { referrer: "" });
// 回显里不含 Referer
```

---

## 常见工作流

### 工作流 1：跨域抓取外网页面

```js
var r = await fetch("https://www.baidu.com/");
var html = await r.text();
console.log("HTTP 状态: " + r.status);
console.log("<title>: " + (html.match(/<title>([\s\S]*?)<\/title>/i)
  ? RegExp.$1.trim() : "(未找到)"));
```

### 工作流 2：调需要同源 Referer 的接口

很多接口校验 `Referer`。直接 `fetch(url)` 即可——weso 自动补目标域名，
接口视为同源请求放行，无需手动设置。

```js
// 不传 referrer, weso 自动补 https://target.example
var r = await fetch("https://target.example/api/data");
```

### 工作流 3：伪装 Referer / 完全不发

```js
// 伪装成某站来源
await fetch(url, { referrer: "https://www.google.com/" });

// 完全不发, 避免被指纹识别
await fetch(url, { referrer: "" });
```

---

## 注意事项

- **外网连通性**：跨域放开只解决浏览器侧 CORS，仍需本机能访问目标域名
  （公司网络/防火墙等限制照常生效）。`httpbin.org` 偶有波动，失败重试即可。
- **仅 `init.referrer` 生效**：不要尝试用 `headers: { "Referer": ... }` 设置——
  `Referer` 是 forbidden header，浏览器会静默丢弃。只能走 `init.referrer`。
- **其他 `fetch` 选项照常**：`method`/`headers`/`body`/`credentials` 等浏览器
  标准选项行为不变，weso 不干预。
