# Weso JS — Paths & Assets 模块参考

覆盖标准目录解析与打包资源读取共 7 个函数。用于拼接文件 I/O 所需的磁盘绝对路径。

---

## 函数列表

### `W.getWorkspace`

同步返回应用工作区根路径（`www/`、`res/`、`python/` 所在目录），`string`。

```js
var root = W.getWorkspace();
var outDir = root + "\\output";
```

---

### `W.getResFolder`

同步返回 `res/` 资源目录的绝对路径，`string`。`res/` 落盘，可按路径访问。

```js
var resDir = W.getResFolder();
```

---

### `W.getLocalFolder`

同步返回应用专属的 `LocalAppData` 子目录路径，`string`。即
`<LocalAppData>\<appNameEN>`（`appNameEN` 取自 `weso.json`，目录不存在会自动创建），
并非裸 `LocalAppData` 根。

```js
var local = W.getLocalFolder();   // C:\Users\<u>\AppData\Local\<appNameEN>
```

---

### `W.getRoamingFolder`

同步返回应用专属的 `RoamingAppData` 子目录路径，`string`。即
`<RoamingAppData>\<appNameEN>`（`appNameEN` 取自 `weso.json`，自动创建）。

```js
var roaming = W.getRoamingFolder();   // C:\Users\<u>\AppData\Roaming\<appNameEN>
```

---

### `W.getTempFolder`

同步返回应用专属的临时子目录路径，`string`。即 `<系统Temp>\<appNameEN>`
（`appNameEN` 取自 `weso.json`，自动创建），并非裸系统临时目录。

```js
var tmp = W.getTempFolder();
```

---

### `W.getRes`

同步把 `res/` 相对路径解析为磁盘绝对路径，`string`。仅解析路径，不读取内容。

**参数：**

- `path`* string | { path: string }：相对 `res/` 的路径

```js
var abs = W.getRes("config.json");
var text = await W.readFile({ path: abs, encoding: "utf8" });

var dllPath = W.getRes("weso_test_dll.dll");
var handle = W.loadDll(dllPath);
```

---

### `W.getAssets`

异步读取打包资源树中的文件，返回 `Promise<string>`。打包资源不能按磁盘路径
访问，只能走此接口。

**参数：**

- `path`* string：相对资源根的路径
- `encoding`? `"utf8"` | `"base64"`，默认 `"utf8"`

```js
var html = await W.getAssets({ path: "template.html", encoding: "utf8" });
var b64 = await W.getAssets({ path: "img/logo.png", encoding: "base64" });
```

---

## 常见工作流

### 工作流 1：读取 res/ 配置

```js
var path = W.getRes("config.json");
var text = await W.readFile({ path: path, encoding: "utf8" });
```

### 工作流 2：按用户保存设置到 RoamingAppData

```js
var cfgDir = W.getRoamingFolder() + "\\MyApp";
W.mkdirs(cfgDir);
await W.writeFile({ path: cfgDir + "\\settings.json", data: JSON.stringify(opts), encoding: "utf8" });
```

### 工作流 3：res/ vs 打包资源怎么选

| 关注点 | `res/`（getRes） | 打包资源（getAssets） |
|--------|------------------|----------------------|
| 落盘、可按路径访问 | 是 | 否 |
| 可直接路径读写（readFile/loadDll） | 是 | 否 |
| 典型用途 | DLL、默认配置、大媒体 | 页面模板、随包文本/媒体 |

需要按路径寻址（DLL 加载、`openInExplorer`）放 `res/`；只需 JS 读取的放打包
资源。
