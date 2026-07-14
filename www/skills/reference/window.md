# Weso JS — Window 模块参考

覆盖窗口创建/销毁、状态控制、几何查询、拖拽、托盘、关闭拦截,
以及透明背景/鼠标穿透/置顶/阴影 4 个桌面挂件相关 API, 共 **22 个函数** +
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
- `transparent`? boolean：默认 `false`。`true` 时窗口创建即带 `WS_EX_NOREDIRECTIONBITMAP`,
  透明像素直显桌面（真透明背景的**关键**, 运行时 `setTransparent` 无法补上该 exStyle）。
  需配合页面 html/body 无背景 + `setTransparent(true, hwnd)` 切 webview alpha=0。

```js
var hwnd = W.createWin({ entry: "child.html", width: 500, height: 400, mode: W.WinMode.Borderless });
// 透明桌面挂件 (见工作流 3)
var pet = W.createWin({
    entry: "pet.html", width: 220, height: 220,
    mode: W.WinMode.BorderlessNoTaskbar, transparent: true
});
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

### `W.setTransparent`

同步切换目标窗口的真透明背景。

**参数：**

- `enable`* boolean：`true` 把 webview 与原生窗口背景一并置透明（alpha=0），页面任何
  `transparent` 区域直接显示桌面；`false` 恢复不透明
- `hwnd`? number：目标窗口句柄。**缺省作用于调用方窗口**；操作 `createWin` 创建的子窗口
  必须传入其 hwnd

> 真透明需要窗口在创建时已带 `WS_EX_NOREDIRECTIONBITMAP`，即 `createWin({transparent:true})`
> 或主窗口 `weso.json` `"transparent": true`。本接口只切换 webview alpha；
> 对"非创建即透明"的窗口调用，透明像素会露出窗口 `bgColor`（默认 `#F0F0F0`），不是桌面。
> `enable=true` 时默认联动关闭 aero 阴影（透明窗口加阴影会显示为方形 halo）。

```js
var hwnd = W.createWin({ entry: "pet.html", /*...*/, transparent: true });
W.setTransparent(true, hwnd);
```

---

### `W.setClickThrough`

同步切换鼠标点击穿透。

**参数：**

- `enable`* boolean：`true` 时该窗口只显示不响应任何鼠标事件（点击直接穿透到下层窗口/
  桌面），适合只观赏的桌面挂件；`false` 恢复交互
- `hwnd`? number：同 `setTransparent`

> 启用穿透后该窗口自身无法再接收点击事件，**无法从窗口内部关闭穿透**；要切回交互模式需
> 从其他窗口（如主窗口）调用 `setClickThrough(false, petHwnd)`。

```js
W.setClickThrough(true, petHwnd); // 主窗口把挂件切到观赏模式
```

---

### `W.setAlwaysOnTop`

同步切换始终置顶。

**参数：**

- `enable`* boolean：`true` 时窗口浮在所有非 topmost 窗口之上（全屏窗口也盖不住）；
  `false` 恢复普通层级
- `hwnd`? number：同 `setTransparent`

```js
W.setAlwaysOnTop(true, petHwnd);
```

---

### `W.setShadow`

同步显式控制原生 aero 投影阴影（仅无边框窗口生效；有边框窗口阴影由系统标题栏管理）。

**参数：**

- `enable`* boolean：`true` 开阴影，`false` 关阴影
- `hwnd`? number：同 `setTransparent`

> 覆盖 `setTransparent` 的默认联动（透明→关阴影，不透明→开阴影）；想强制特定阴影状态
> 时，在 `setTransparent` **之后**调用本接口。

```js
W.setTransparent(true, petHwnd); // 默认会关阴影
W.setShadow(true, petHwnd);      // 强制开阴影（透明窗口加方形 halo, 非常规但可演示）
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

### 工作流 3：透明桌面挂件

把 4 个新 API 串起来做一个浮在桌面的萌宠。要点：**真透明必须 `transparent:true`
创建**, `setTransparent` 只切 webview alpha 不能补 exStyle。

```js
var screen = W.getScreenRect();
var taskbar = W.getTaskbarRect();
var w = 220, h = 220, margin = 24;
var x = screen.right - w - margin;
var y = taskbar.top - h - margin; // 避开底部任务栏, 不在底部时回退屏幕底

// 1) 创建即透明（关键: WS_EX_NOREDIRECTIONBITMAP 在 CreateWindowEx 时一次性写入）
var hwnd = W.createWin({
    entry: "pet.html", width: w, height: h, x: x, y: y,
    mode: W.WinMode.BorderlessNoTaskbar, transparent: true
});

// 2) 把 webview alpha 也置 0 + 始终置顶 + 显式关阴影 + 显式可点击
W.setTransparent(true, hwnd);
W.setAlwaysOnTop(true, hwnd);
W.setShadow(false, hwnd);
W.setClickThrough(false, hwnd);
```

主窗口也支持透明：`weso.json` 加 `"transparent": true`，主窗口启动即透明
（与子窗口机制相同）。

> 完整可运行示例见 `www/code/window/pet/pet.js` + `pet.html`。
