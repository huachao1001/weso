# Weso JS — Hooks 模块参考

覆盖全局键盘/鼠标 Hook 共 4 个函数。Hook 是**全局**的——窗口不在前台也能捕获。
用完务必 `unhook`。

> ⚠️ 事件经**主窗口**分发。从子窗口安装 hook 时回调收不到事件，请从主窗口安装
> （或主窗口捕获后用 `postWinMsg` 转发，与 `captureConsoleOutput` 同理）。

---

## 类型定义

### KeyboardEvent

- `type`* `"keydown"` | `"keyup"`
- `code`* number：Windows 虚拟键码（VK_*），如 `13` = Enter

### MouseEvent

- `type`* `"move"` | `"down"` | `"up"` | `"scroll"`
- `extra`* string | number：按 `type` 含义不同（见下）
- `x`* number：屏幕坐标
- `y`* number

`extra` 按 `type` 的含义：

| type | extra |
|------|-------|
| `"down"` / `"up"` | `"left"` \| `"mid"` \| `"right"` |
| `"scroll"` | 数值型滚轮 delta |
| `"move"` | `""`（空） |

> `x`/`y` 是**屏幕**坐标，非客户区坐标。

---

## 函数列表

### `W.hookKeyboard`

同步安装键盘 Hook，事件流向 `cb` 直到 `unhookKeyboard()`。

**参数：**

- `cb`* (e: KeyboardEvent) => void

```js
W.hookKeyboard(function (e) {
  console.log("type=" + e.type + "  code=" + e.code);
});
```

---

### `W.unhookKeyboard`

同步停止键盘 Hook，无参数，未安装时 no-op。

```js
W.unhookKeyboard();
```

---

### `W.hookMouse`

同步安装鼠标 Hook。

**参数：**

- `cb`* (e: MouseEvent) => void

> `move` 事件极频繁，打印前先节流。

```js
var lastMove = 0;
W.hookMouse(function (e) {
  if (e.type === "move") {
    if (Date.now() - lastMove < 300) return;
    lastMove = Date.now();
  }
  console.log(e.type, e.x, e.y);
});
```

---

### `W.unhookMouse`

同步停止鼠标 Hook，无参数。

```js
W.unhookMouse();
```

---

## 常见工作流

### 工作流 1：限时捕获键盘输入

```js
W.hookKeyboard(function (e) {
  console.log(e.code, e.type);
});
setTimeout(function () { W.unhookKeyboard(); }, 5000);
```

### 工作流 2：节流鼠标 move 事件

```js
var MOVE_THROTTLE_MS = 300;
var lastMoveLog = 0;

W.hookMouse(function (e) {
  var label = e.type;
  if (e.type === "down" || e.type === "up") label += " (" + e.extra + ")";
  else if (e.type === "scroll") label += " delta=" + e.extra;
  else if (e.type === "move") {
    var now = Date.now();
    if (now - lastMoveLog < MOVE_THROTTLE_MS) return;
    lastMoveLog = now;
  }
  console.log(label + "  x=" + e.x + "  y=" + e.y);
});

setTimeout(function () { W.unhookMouse(); }, 5000);
```

### 工作流 3：替换回调的注意事项

> ⚠️ `unhook*` 只停止捕获、**不会移除已注册的回调**。`hook*(cb)` 每次调用都会
> 注册一个新回调。因此 `unhookKeyboard()` 后再 `hookKeyboard(newCb)`，旧回调
> 仍然存在，重新启用后会与新回调**同时触发**——并不能“干净替换”。

```js
// 这并不会只剩一个监听：
W.unhookKeyboard();      // 只停止捕获
W.hookKeyboard(newCb);   // 旧回调仍在，恢复后会与 newCb 同时触发
```

目前**没有 API 能移除已注册的 hook 回调**。需要切换单一处理逻辑时，建议注册一个
固定分发函数，在内部按状态决定是否转发，而不是反复 `hook*`：

```js
var keyHandler = function (e) {};   // 当前处理逻辑
W.hookKeyboard(function (e) { keyHandler(e); });   // 只注册一次
// 切换逻辑时只改 keyHandler 指向，无需 unhook/rehook
keyHandler = function (e) { if (e.type === "keydown") console.log(e.code); };
```
