# Weso JS — System 模块参考

覆盖弹窗、命令执行、环境变量、控制台捕获、DevTools、退出、开机自启、运行时回调事件共 15 个函数。

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

异步执行 cmd.exe 命令并返回 **stdout 与 stderr 的合并输出**。命令在 NativeWorker
线程上跑（`cmd /c` + 管道读输出 + 等待进程退出），不阻塞 UI 线程；返回 Promise，
resolve 拿到合并输出字符串。

**参数：**

- `cmd`* string | { cmd: string }

```js
var out = await W.system("dir C:\\");
console.log(out);
```

> 必须用 `await`。长任务也无需再改走 Python——`system` 本身已异步不卡 UI。

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

### `W.setAutoStart`

同步开启/关闭开机自启：在用户启动文件夹（`shell:startup`）创建/删除指向当前 exe 的快捷方式。快捷方式文件名取自 `weso.json` 的 `appNameCN`。

**参数：**

- `enable`* boolean：true 创建（已存在则覆盖），false 删除（不存在视为成功）

返回 `true`/`false` 表示操作是否成功。

```js
W.setAutoStart(true);   // 开启
W.setAutoStart(false);  // 关闭
```

---

### `W.isAutoStart`

同步查询当前是否已开启开机自启（解析启动文件夹中 `.lnk` 的目标并比对当前 exe 路径）。

```js
if (W.isAutoStart() === true) {
  console.log("已开启自启");
}
```

---

### `W.onProcessFailed` / `W.removeProcessFailedListener`

注册/注销渲染进程异常回调（进程崩溃或卡死，白屏根因）。native 已自动 Reload，此回调在新页面加载完成时投递，`info.recovered=true`。注册同步，回调异步触发。

**info：**

- `kind` number、`reason` number、`exitCode` number、`recovered` boolean

```js
function onFail(info) { console.log("recovered=" + info.recovered); }
W.onProcessFailed(onFail);
// ...
W.removeProcessFailedListener(onFail);   // 须传同一函数引用
```

---

### `W.onNavigationCompleted` / `W.removeNavigationCompletedListener`

注册/注销导航完成回调：首次加载、Reload、站内跳转结束时触发。

**info：**

- `success` boolean、`errorStatus` number

```js
function onNav(info) { console.log("success=" + info.success); }
W.onNavigationCompleted(onNav);
```

> 主窗口的脚本由用户点击"运行"触发，那时初始导航早已完成，本窗口难以捕获自身的初始 `onNavigationCompleted`（导航会销毁 JS 上下文）。要捕获初始导航，在子窗口的文档加载阶段注册（见工作流 3）。

---

### `W.onLastSessionCrashed` / `W.removeLastSessionCrashedListener`

注册/注销"上次会话异常退出"回调。仅在进程启动后**首个窗口首次导航**时触发一次，表明上次进程被强杀或崩溃（`session.lock` 残留）。

```js
W.onLastSessionCrashed(function () {
  console.log("上次未正常退出");
});
```

> 三个 `on*` 均同步注册、回调异步触发；注销必须传同一个 cb 引用。监听器随所在窗口生命周期结束自动失效。

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

### 工作流 3：子窗口转发运行时回调

主窗口初始导航在脚本运行前已完成，难以捕获自身的 `onNavigationCompleted`；开一个子窗口，它的脚本在文档加载阶段执行，能捕获自身初始导航事件并转发回主窗口：

```js
// 主窗口
W.addWinMsgListener(function (data) {
  console.log("[子窗口转发]", JSON.stringify(data));
});
W.createWin({ entry: "child.html", width: 420, height: 220 });

// child.html
var mainHwnd = W.getMainHWND();
W.onNavigationCompleted(function (info) {
  W.postWinMsg(mainHwnd, { event: "onNavigationCompleted", info: info });
});
```
