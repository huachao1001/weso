# Weso JS — Messaging 模块参考

覆盖窗口间通信、通用事件监听、文件拖拽共 4 个函数。所有注册函数为**同步**，
回调异步触发。

---

## 共用说明

- **监听器叠加**：所有 `add*Listener` 注册的回调可叠加，多次调用注册多个回调（同一函数引用被去重）。
- **监听器移除（重要限制）**：`addNativeMsgListener` 注册后**无法移除**（没有对应的
  公开 remove 方法，`W.removeNativeMsgListener` 不存在，调用会报错）。真正能移除回调的只有：
  - `W.removePythonMsgListener(listener)`（Python 消息）
  - `W.captureConsoleOutput()`（不传 cb 关闭控制台监听）
  
  仅停捕获但不移除回调的：
  - `W.unhookKeyboard()` / `W.unhookMouse()`（停止 Hook，但已注册回调仍在，见 `hooks.md`）
  
  `addWinMsgListener` / `addFileDragListener` 无对应移除方法。

---

## 函数列表

### `W.postWinMsg`

同步向指定 HWND 窗口发送消息。`data` 必须可 JSON 序列化（无函数、无环）。

**参数：**

- `toHWND`* number：目标窗口句柄
- `data`* unknown

```js
W.postWinMsg(W.getMainHWND(), { hello: "from child" });
```

---

### `W.addWinMsgListener`

同步注册回调，接收经 `postWinMsg` 发到当前窗口的消息。

**参数：**

- `cb`* (data: unknown) => void

> 叠加式——多次调用注册多个回调。

```js
W.addWinMsgListener(function (data) {
  console.log("received:", JSON.stringify(data));
});
```

---

### `W.addNativeMsgListener`

同步为具名事件 type 注册回调。仅用于自定义事件；内置事件已有专用 helper
（`addWinMsgListener`、`addPythonMsgListener`、`addFileDragListener`、各 hook）。

**参数：**

- `type`* string：事件类型名
- `cb`* (data: unknown) => void

> 内置事件请用专用 helper，不要自行注册其内部 type 字符串。

```js
function onCustom(data) { console.log("custom:", data); }
W.addNativeMsgListener("myCustomType", onCustom);
```

> ⚠️ `addNativeMsgListener` **无对应移除方法**（`W.removeNativeMsgListener` 不存在，
> 调用会报错）。需要可移除的监听请用专用方法（如 `addPythonMsgListener` 配
> `removePythonMsgListener`）。若用自定义事件且后续要“停用”，用固定分发函数加
> 开关控制是否转发，而非尝试移除。

---

### `W.addFileDragListener`

同步注册文件拖拽回调，文件/文件夹拖入窗口时触发。每个拖入项回调一次。

**参数：**

- `cb`* (path: string, isDir: boolean) => void

> ⚠️ 拖到自带拖拽处理的控件（CodeMirror、`<textarea>`）上不会触发，拖到空白区。

```js
W.addFileDragListener(function (path, isDir) {
  var type = isDir ? "[目录]" : "[文件]";
  console.log(type + " " + path);
});
```

---

## 常见工作流

### 工作流 1：主窗口创建子窗口并通信

```js
// 主窗口
W.addWinMsgListener(function (data) { console.log("from child:", data); });
var childHwnd = W.createWin({ entry: "child.html", width: 420, height: 220 });

// child.html 里：
//   W.postWinMsg(W.getMainHWND(), { msg: "hi" });
```

### 工作流 2：主窗口转发控制台输出给子窗口

```js
// 主窗口（captureConsoleOutput 仅主窗口可用）
var childHwnd = W.createWin({ entry: "child.html", width: 420, height: 220 });
W.captureConsoleOutput(function (output) {
  W.postWinMsg(childHwnd, { kind: "console", text: output });
});

// 子窗口 (child.html)
W.addWinMsgListener(function (data) {
  if (data.kind === "console") console.log(data.text);
});
```

### 工作流 3：自定义事件的“停用”

> 自定义 `addNativeMsgListener` 注册后无法移除。要“停用”，注册一个固定分发函数，
> 靠开关控制是否转发即可：

```js
var customActive = true;
function handler(data) { if (customActive) console.log(data); }
W.addNativeMsgListener("myEvent", handler);   // 只注册一次

// “停用”：不再转发，但 handler 仍已注册（只是不做事）
customActive = false;
// 重新启用：customActive = true;
```
