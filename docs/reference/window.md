# Weso JS — Window 模块参考

覆盖窗口创建/销毁、状态控制、几何查询、拖拽、托盘、关闭拦截共 **18 个函数** +
1 个 `WinMode` 常量枚举。除特别说明外均为**同步**。"当前窗口" = 运行当前脚本的窗口。

---

## 类型定义

### WinMode

窗口样式常量枚举，`W.WinMode` 暴露以下成员：

| 常量 | 值 | 含义 |
|------|----|------|
| `W.WinMode.Windowed` | 0 | 标准：有边框/标题栏，显示在任务栏 |
| `W.WinMode.WindowedNoTaskbar` | 1 | 有边框/标题栏，不显示在任务栏 |
| `W.WinMode.Borderless` | 2 | 无边框/无标题栏，显示在任务栏 |
| `W.WinMode.BorderlessNoTaskbar` | 3 | 无边框/无标题栏，不显示在任务栏 |

### WinModeValue

`0 | 1 | 2 | 3`，`getWinMode()` 返回值、`createWin({ mode })` 参数类型。

### Rect

- `left`* number
- `top`* number
- `right`* number
- `bottom`* number

`getTaskbarRect()` / `getScreenRect()` 返回此结构。

---

## 函数列表

### `W.createWin`

同步创建子窗口，返回子窗口 HWND（`number`）。

**参数：**

- `entry`* string：相对 `www/` 的 HTML 路径
- `width`* number：`<=0` 取屏幕宽度；**当 width 与 height 同时为 `-1` 时窗口以最大化打开**
- `height`* number：`<=0` 取屏幕高度；**同时为 `-1` 时同上（最大化）**
- `x`? number：`-1` = 居中显示
- `y`? number：`-1` = 居中显示
- `title`? string
- `mode`? WinModeValue：默认 `0`
- `bgColor`? string

```js
var hwnd = W.createWin({ entry: "child.html", width: 500, height: 400, mode: W.WinMode.Borderless });
```

---

### `W.destroyWin`

同步按 HWND 销毁窗口。

**参数：**

- `hwnd`* number：`createWin` 返回值

```js
W.destroyWin(childHwnd);
```

---

### `W.showWindow` / `W.hideWindow`

同步显示/隐藏当前窗口，无参数。

```js
W.hideWindow();
setTimeout(W.showWindow, 1000);
```

---

### `W.minWindow` / `W.maxWindow` / `W.normWindow`

同步最小化/最大化/还原当前窗口，无参数。

```js
if (W.isWindowMaximized()) W.normWindow(); else W.maxWindow();
```

---

### `W.isWindowMaximized` / `W.isWindowVisible`

同步查询状态，返回 `boolean`，无参数。

---

### `W.isBorderless` / `W.getWinMode`

同步查询当前窗口模式。

- `isBorderless()` → `boolean`
- `getWinMode()` → `WinModeValue`

---

### `W.getMainHWND` / `W.getHWND`

同步返回窗口句柄，`number`。

- `getMainHWND()`：主窗口 HWND
- `getHWND()`：当前窗口 HWND（子窗口里与 `getMainHWND()` 不同）

```js
var isMain = W.getHWND() === W.getMainHWND();
```

> `captureConsoleOutput` 仅主窗口可用，借此判断。

---

### `W.getTaskbarRect` / `W.getScreenRect`

同步返回几何信息，`Rect` 结构，无参数。

```js
var screen = W.getScreenRect();
console.log(screen.right - screen.left, screen.bottom - screen.top);
```

---

### `W.bindDragWin`

同步把 HTMLElement 设为拖拽手柄——按住鼠标拖动窗口，双击触发回调。对无边框窗口
尤其关键。

**参数：**

- `obj`* HTMLElement：手柄元素
- `onDlbClick`? (x: number, y: number) => void：双击回调

> 仅点击 `obj` 本身触发，不响应其子元素（可忽略拖拽栏内按钮点击）。

```js
W.bindDragWin(document.getElementById("titlebar"), function () {
  if (W.isWindowMaximized()) W.normWindow(); else W.maxWindow();
});
```

---

### `W.setOnClickCloseIconListener`

同步拦截关闭按钮。调用后点 X 不退出，触发 `listener`。要真正退出在 listener 里
调 `W.exitApp()`。

**参数：**

- `listener`* () => void

> 重复调用会**叠加**监听器（无替换语义）：调两次会有两个 listener 同时触发。
> 无对应 remove 方法，如需单一处理请用同名函数引用并在内部做去重。

```js
W.setOnClickCloseIconListener(function () {
  if (confirm("确认退出?")) W.exitApp();
});
```

---

### `W.showTray`

同步显示系统托盘图标及菜单。

**参数：**

- `icon`* string：图标路径（`""` = 默认）
- `title`* string：托盘提示
- `items`* Map<number, string>：key 必须整数，value 字符串。**`key === 0` 时插入
  菜单分隔符**，该 id 不会触发 `cb`
- `cb`* (key: number) => void：菜单项点击回调（分隔符除外）

> `items` 类型不符会抛错。

```js
var items = new Map();
items.set(1, "显示");
items.set(2, "退出");
W.showTray("", "我的应用", items, function (key) {
  if (key === 1) W.showWindow();
  else if (key === 2) W.exitApp();
});
```

---

## 常见工作流

### 工作流 1：无边框窗口自绘标题栏

```js
var titlebar = document.getElementById("titlebar");
W.bindDragWin(titlebar, function () {
  if (W.isWindowMaximized()) W.normWindow(); else W.maxWindow();
});
document.getElementById("minBtn").addEventListener("click", W.minWindow);
document.getElementById("closeBtn").addEventListener("click", W.exitApp);
```

### 工作流 2：创建子窗口并通信

```js
W.addWinMsgListener(function (data) { console.log("from child:", data); });
var childHwnd = W.createWin({ entry: "child.html", width: 420, height: 220 });
// child.html 里：W.postWinMsg(W.getMainHWND(), { hello: "from child" });
```
