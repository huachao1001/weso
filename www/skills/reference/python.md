# Weso JS — Python 模块参考

覆盖嵌入 Python 解释器的安装/初始化/运行/通信共 8 个函数：**6 个异步**
（`installPython`/`isPythonInstalled`/`initPython`/`runPythonScript`/`runPythonFile`/`deinitPython`，
返回 `Promise`），**2 个同步**（`addPythonMsgListener`/`removePythonMsgListener`，注册/移除监听）。
Python 的 `print` 输出用 `W.captureConsoleOutput` 捕获（见 `system.md`）。

---

## 共用说明

- **`version`**：Python 版本字符串，如 `"3.12.10"`。推荐版本：`3.10.11`、
  `3.11.9`、`3.12.10`、`3.13.14`。
- **`pyDir`**：用户 `.py` 源码目录名（相对工作区），影响 `sys.path`，不是解释器
  安装位置。

---

## 类型定义

### InstallPythonOpts

- `version`* string
- `pythonProxy`? string：镜像根地址，`""` = 默认镜像
- `pipProxy`? string：预留（运行时暂未使用）
- `pyDir`? string → 见共用说明，默认 `"python/src"`
- `force`? boolean：true = 跳过 `isInstalled` 强制重下

---

## 函数列表

### `W.isPythonInstalled`

异步检查指定版本是否已安装，返回 `Promise<boolean>`。

**参数：**

- `version`* string → 见共用说明

```js
if (!await W.isPythonInstalled("3.12.10")) { /* 安装 */ }
```

---

### `W.installPython`

异步下载安装，返回 `Promise<boolean>`（true = 成功）。

**参数：**

- `opts`* InstallPythonOpts

```js
var ok = await W.installPython({
  version: "3.12.10",
  pythonProxy: "https://mirrors.ustc.edu.cn/python",
  pyDir: "python/src",
  force: false
});
```

---

### `W.initPython`

异步初始化解释器，返回 `Promise<boolean>`。必须在运行脚本前成功。

**参数：**

- `version`* string → 见共用说明
- `pyDir`? string → 见共用说明

> 未安装时 `initPython` 会失败，务必先 `isPythonInstalled`/`installPython`。

```js
if (!await W.initPython("3.12.10")) return;
```

---

### `W.runPythonScript`

异步运行 Python 源码字符串，返回退出码（`0` = 成功）。

**参数：**

- `script`* string：可多行，注意缩进

```js
await W.runPythonScript("print('Hello from Python!')");
await W.runPythonScript(`
squares = [x*x for x in range(1, 6)]
print('squares:', squares)
`);
```

---

### `W.runPythonFile`

异步运行 `.py` 文件，返回退出码（`0` = 成功）。通常传绝对路径；相对路径及打包
模式下 `.pyc` 回退亦支持。

**参数：**

- `filePath`* string

```js
var pyPath = W.getWorkspace() + "\\python\\src\\hello.py";
await W.runPythonFile(pyPath);
```

---

### `W.deinitPython`

异步关闭解释器，返回 `Promise<void>`。

```js
await W.deinitPython();
```

---

### `W.addPythonMsgListener`

同步注册回调，接收 Python 经 `weso.post_msg(obj)` 发来的消息（已解析为对象）。

**参数：**

- `listener`* (msg: unknown) => void

> Python 脚本里 `import weso` 即可使用 `weso.post_msg(obj)`。

```js
function onPyMsg(data) { console.log(data); }
W.addPythonMsgListener(onPyMsg);
```

---

### `W.removePythonMsgListener`

同步移除监听，必须传**同一个函数引用**，匿名函数无法移除。

**参数：**

- `listener`* (msg: unknown) => void

```js
W.removePythonMsgListener(onPyMsg);
```

---

## 常见工作流

### 工作流 1：标准会话

```js
async function pySession() {
  var version = "3.12.10";
  if (!await W.isPythonInstalled(version)) {
    if (!await W.installPython({ version: version, pythonProxy: "https://mirrors.ustc.edu.cn/python" })) return;
  }
  if (!await W.initPython(version)) return;

  W.captureConsoleOutput(function (output) { console.log(output); });
  try {
    await W.runPythonScript("print('running')");
  } finally {
    W.captureConsoleOutput();
    await W.deinitPython();
  }
}
pySession();
```

### 工作流 2：JS ⇄ Python 双向通信

```js
function onPyMsg(data) { console.log("python:", data); }
W.addPythonMsgListener(onPyMsg);

if (!await W.initPython("3.12.10")) return;

// Python -> JS
await W.runPythonScript(
  "import weso\n" +
  "weso.post_msg({'type':'greeting','msg':'hello'})"
);

// JS -> Python -> JS（传数组求和回传）
var nums = [1, 2, 3, 4, 5];
await W.runPythonScript(
  "import weso\n" +
  "nums = " + JSON.stringify(nums) + "\n" +
  "weso.post_msg({'type':'sum','result':sum(nums)})"
);

W.removePythonMsgListener(onPyMsg);
await W.deinitPython();
```

### 工作流 3：导入自己的模块

> `.py` 模块放 `<workspace>\python\src\`，导入前先 append 到 `sys.path`。Windows
> 路径用 Python 原始字符串避免双重转义。

```js
var dir = W.getWorkspace() + "\\python\\src";
await W.runPythonScript(
  "import sys\n" +
  "sys.path.append(r'" + dir + "')\n" +
  "import mymodule\n" +
  "mymodule.greet('weso')"
);
```
