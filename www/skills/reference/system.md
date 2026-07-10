# Weso JS — System 模块参考

覆盖弹窗、命令执行、环境变量、控制台捕获、DevTools、退出共 7 个函数。

---

## 函数列表

### `W.alert`

同步弹出原生 Windows 消息框（阻塞）。

**参数：**

- `msg`* string | { msg: string }

```js
W.alert("保存成功");
W.alert({ msg: "对象写法" });
```

---

### `W.system`

同步执行 cmd.exe 命令并返回 **stdout 与 stderr 的合并输出**。会阻塞 UI 线程，不要跑长任务。

**参数：**

- `cmd`* string | { cmd: string }

```js
var out = W.system("dir C:\\");
console.log(out);
```

> 长任务请走 Python（`runPythonScript`），不要用 `system`。

---

### `W.getEnv`

同步读取进程环境变量。

**参数：**

- `name`* { name: string }

```js
var path = W.getEnv({ name: "PATH" });
```

---

### `W.setEnv`

同步写入环境变量。

**参数：**

- `name`* string
- `val`* string
- `append`? boolean：true 时追加到现有值（PATH 风格拼接）

> `name` 或 `val` 为空时打印错误并返回 `null`。

```js
W.setEnv({ name: "MY_APP_DIR", val: W.getWorkspace() });
W.setEnv({ name: "PATH", val: "C:\\tools", append: true });
```

---

### `W.captureConsoleOutput`

捕获原生代码（DLL/Python）产生的 stdout/stderr 并转给 JS 回调。注册同步，回调
异步触发。

**参数：**

- 传 `cb`：启动捕获（替换旧回调）
- 不传 `cb`：停止捕获

```js
W.captureConsoleOutput(function (output, isStdOut) {
  var tag = isStdOut ? "[stdout]" : "[stderr]";
  console.log(tag + " " + output);   // output 已含尾换行
});
// ... 触发原生打印 ...
W.captureConsoleOutput();   // 停止
```

> ⚠️ 仅**主窗口**能捕获。子窗口收不到，需主窗口捕获后经 `postWinMsg` 转发。
> `output` 已带尾换行，别再经 `console.log` 多加 `\n`。空行或纯换行的输出不转发。

---

### `W.openDevTools`

同步打开 DevTools 窗口。仅 **debug 构建**生效；release 构建为 no-op。

```js
W.openDevTools();
```

---

### `W.exitApp`

同步退出当前窗口。仅从**主窗口**调用时才退出整个应用（所有窗口）；从子窗口调用只关闭该子窗口。

```js
W.exitApp();
```

> 拦截关闭按钮而非直接退出，见 `window.md` 的 `setOnClickCloseIconListener`。

---

## 常见工作流

### 工作流 1：限时捕获 DLL stdout

```js
var dll = new W.Dll(W.getRes("console_print_dll.dll"));

W.captureConsoleOutput(function (output, isStdOut) {
  console.log((isStdOut ? "[out] " : "[err] ") + output);
});

await dll.invoke("start_print", "i", []);
await new Promise(function (r) { setTimeout(r, 6000); });
await dll.invoke("stop_print", "v", []);

dll.free();
W.captureConsoleOutput();
```

### 工作流 2：子窗口转发控制台输出

```js
// 主窗口
var childHwnd = W.createWin({ entry: "child.html", width: 420, height: 220 });
W.captureConsoleOutput(function (output) {
  W.postWinMsg(childHwnd, { kind: "console", text: output });
});

// 子窗口 (child.html)
W.addWinMsgListener(function (data) {
  if (data.kind === "console") console.log(data.text);
});
```
