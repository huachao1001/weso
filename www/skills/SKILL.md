---
name: weso
version: 1.0.0
description: Weso 全栈开发。既覆盖 weso.exe 命令行（新建/打包/调试项目、安装 Python 运行时与第三方库），也覆盖在 Weso 应用页面里用 JavaScript 调用原生能力（文件、窗口、DLL、Python、Hook 等）。
allowed-tools: Read, Bash
---

# Weso 开发（CLI + 页面 JS API）

Weso 开发分两个层面：

1. **CLI（`weso.exe` 命令行）** — 在应用之外操作项目：新建项目、调试运行、打包成
   单文件 exe、安装 Python 运行时、安装第三方 Python 库。
2. **页面 JS API（`W` / `weso`）** — 在 Weso 应用页面里调用文件、窗口、系统、
   DLL、Python 等原生能力。

---

## 执行流程

每次处理 Weso 任务前，**先判断属于哪个层面**，再按对应步骤确认。

### 第一步：判断层面 + 定位环境

**CLI 任务**（新建/打包/调试/装 Python/装库）：
1. 确认 `weso.exe` 路径。未指定则先在常见位置找（项目 `dist\`、工作区根、PATH），
   找不到询问用户。
2. 确定工作区路径。多数命令作用于“项目工作区”（含 `weso.json` 的目录）；未指定时
   默认用**当前工作目录**。

**JS 任务**（在应用页面里调原生能力）：先确认运行环境。Weso 页面脚本运行在浏览器
上下文，`window.W` / `window.weso` 已就绪。若不确定，先用一条无害同步调用验证：

```js
console.log(W.getWorkspace());
```

- **有输出**：环境就绪，继续。
- **报错 `W is not defined`**：当前不是 Weso 运行环境，告知用户并停止。

### 第二步：按需求匹配并读取参考文档

**CLI 命令组：**

| 用户目标 | 主命令 | 参考文档 |
|---------|--------|---------|
| 新建空白项目（生成目录与 weso.json） | `-n` | `reference/cli/create-project.md` |
| 打包成 exe / 调试运行 | `-p` / `-d` | `reference/cli/package.md` |
| 安装 Python 运行时到项目 | `-e` | `reference/cli/python-runtime.md` |
| 安装/管理 Python 第三方库 | `-i` / `-r` | `reference/cli/python-libs.md` |

**页面 JS 能力域：**

| 需求关键词 | 参考文档 |
|-----------|---------|
| 读写文件、目录、选择文件 | `reference/file-io.md` |
| 路径、资源、工作区 | `reference/paths-assets.md` |
| 弹窗、命令、环境变量、控制台、退出 | `reference/system.md` |
| 调 DLL、原生函数 | `reference/dll-interop.md` |
| 窗口、拖拽、托盘、关闭按钮、透明/穿透/置顶/阴影 | `reference/window.md` |
| 键盘/鼠标 Hook | `reference/hooks.md` |
| 运行 Python | `reference/python.md` |
| 窗口间通信、事件监听、拖拽文件 | `reference/messaging.md` |

---

## 调用约定

### CLI 约定

1. **工作区优先。** 大部分命令隐式作用于“工作区”。用 `-w <path>` 显式指定，或先
   `cd` 到项目目录。`-n` 是唯一会**创建**工作区的命令。
2. **Python 版本流转。** `-v` 不写入 `weso.json`，只在本次命令行生效。`-e`/`-i`/`-r`
   必须带 `-v`；`-p` 可不带（自动从 `python\py3\` 探测已装版本）。
3. **默认镜像。** 未传代理：Python 下载 `https://mirrors.aliyun.com/python-release/windows`，
   pip index `https://mirrors.aliyun.com/pypi/simple/`。下载慢时用 `--py-proxy` /
   `--pip-proxy` 覆盖。
4. **路径用 Windows 反斜杠。** 含空格须整体加引号：`weso.exe -p -w "D:\My Projects\App"`。
5. **参数可组合，动作互斥。** 多数标志可叠加（如 `-e -v 3.12.9 --py-proxy <url>`），
   但 `-p`/`-d`/`-e`/`-n` 等动作标志一次只执行一个。

### JS 约定

1. **同步与异步两类。** 异步函数返回 `Promise`，必须 `await` 或挂 `.then()/.catch()`；
   同步函数直接返回。各参考文档标注了每个函数属于哪一类。
2. **参数用对象或字符串。** 多数函数接收单个对象参数。很多文件/路径函数也接受纯字符串
   作为 `{ path: str }` 的简写。拿不准时用对象形式。
3. **路径用 Windows 反斜杠**（JS 字面量写 `\\`），参数为磁盘绝对路径。
4. **没有 Node API。** 无 `require`/`fs`/`path`/`process`。用浏览器 API
   （`fetch`、`TextEncoder`、`Uint8Array`、`btoa/atob`）+ `W.*`。
5. **监听器叠加。** `addNativeMsgListener` 及其衍生函数注册的回调可叠加。**移除有限**：
   通用 `addNativeMsgListener`/`addWinMsgListener`/`addFileDragListener` **无 remove API**；
   仅 `removePythonMsgListener`、`captureConsoleOutput()`（不传 cb）、`unhook*` 可停用，
   且需传同一个函数引用。

---

## 命令速查（CLI）

> 下表仅供选择命令，完整参数与前置条件见对应参考文档。

| 命令 | 作用 | 关键依赖 |
|------|------|---------|
| `-h` / `--help` / `help` | 打印用法 | 无 |
| `-w <path>` | 指定工作区路径（默认当前目录） | 无 |
| `-n [name]` | 新建空白项目（默认目录 + weso.json） | 无 |
| `-p` | 打包工作区为 exe | 工作区含 weso.json |
| `-d` | 调试运行工作区 | 工作区（可缺 weso.json，自动建） |
| `-e` | 安装 Python 运行时 | 必须带 `-v <版本>` |
| `-v <版本>` | 指定 Python 版本（如 3.12.9） | 配合 `-e`/`-i`/`-r` |
| `-y <py_dir>` | Python 源码目录名（默认 `python/src`） | 配合 `-p` |
| `--py-proxy <url>` | Python 下载镜像根 | 配合 `-e` |
| `--pip-proxy <url>` | pip index URL（仅 `-i`/`-r` 生效，对 `-e` 无效） | 配合 `-i`/`-r` |
| `-i <name>[<spec>]` | 安装库（spec 用 pip 语法如 `==2.3`，不转换 `=`）；`-i pip` 装 pip 本身 | 必须 `-v` |
| `-r <file>` | 按 requirements 文件批量安装 | 必须 `-v` |

---

## 函数速查（页面 JS）

> 下表仅供选择函数，不含完整参数。可用函数以实际环境为准。

### File I/O（11 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.readFile` | 异步 | 读取文件（utf8/binary/base64） |
| `W.readLines` | 异步 | 按行读取文本 |
| `W.writeFile` | 异步 | 写文件（文本/二进制/base64） |
| `W.createFile` | 同步 | 创建空文件 |
| `W.listdir` | 异步 | 列出目录 |
| `W.mkdirs` | 同步 | 递归创建目录 |
| `W.exists` | 同步 | 判断路径是否存在 |
| `W.rename` | 同步 | 重命名/移动 |
| `W.delPath` | 同步 | 删除文件/目录 |
| `W.openInExplorer` | 同步 | 资源管理器中显示 |
| `W.openFileSelector` | 异步 | 文件/目录选择器 |

### Paths & Assets（8 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.getWorkspace` | 同步 | 工作区根路径（debug=工程根; release=安装路径） |
| `W.getExeFolder` | 同步 | exe 所在目录（release=安装路径; res/python 在此旁） |
| `W.getResFolder` | 同步 | res/ 资源目录路径 |
| `W.getLocalFolder` | 同步 | LocalAppData 路径 |
| `W.getRoamingFolder` | 同步 | RoamingAppData 路径 |
| `W.getTempFolder` | 同步 | 系统临时目录 |
| `W.getRes` | 同步 | res/ 相对路径→绝对路径 |
| `W.getAssets` | 异步 | 读取打包资源 |

### System（7 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.alert` | 同步 | 原生消息框 |
| `W.system` | 异步 | 执行 cmd 命令，返回 stdout+stderr 合并输出 |
| `W.getEnv` | 同步 | 读环境变量 |
| `W.setEnv` | 同步 | 写环境变量 |
| `W.captureConsoleOutput` | 同步注册 | 捕获原生 stdout/stderr |
| `W.exitApp` | 同步 | 退出应用 |
| `W.openDevTools` | 同步 | 打开 DevTools |

### DLL Interop（7 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.invokeDll` | 异步 | 一次性加载+调用+释放 |
| `W.loadDll` | 同步 | 加载 DLL，返回句柄 |
| `W.freeDll` | 同步 | 释放 DLL |
| `W.getProcAddr` | 同步 | 导出名→函数地址 |
| `W.invokeByHandle` | 异步 | 按句柄+导出名调用 |
| `W.invokeByAddr` | 异步 | 按地址调用 |
| `new W.Dll(path)` | — | DLL 封装类（缓存地址，反复调用首选） |

### Window（22 函数 + WinMode 常量）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.WinMode` | 常量 | 窗口样式枚举 |
| `W.createWin` | 同步 | 创建子窗口，返回 hwnd（`transparent:true` 创建即透明, 见工作流 3） |
| `W.destroyWin` | 同步 | 按 hwnd 销毁窗口 |
| `W.showWindow`/`hideWindow` | 同步 | 显示/隐藏当前窗口 |
| `W.minWindow`/`maxWindow`/`normWindow` | 同步 | 最小化/最大化/还原 |
| `W.isWindowMaximized`/`isWindowVisible` | 同步 | 状态查询 |
| `W.isBorderless`/`getWinMode` | 同步 | 窗口模式查询 |
| `W.getMainHWND`/`getHWND` | 同步 | 窗口句柄 |
| `W.getTaskbarRect`/`getScreenRect` | 同步 | 几何信息 |
| `W.bindDragWin` | 同步 | 绑定拖拽手柄 |
| `W.setOnClickCloseIconListener` | 同步 | 拦截关闭按钮 |
| `W.showTray` | 同步 | 系统托盘菜单 |
| `W.setTransparent` | 同步 | 切透明背景（联动阴影；需 `createWin({transparent:true})` 配合） |
| `W.setClickThrough` | 同步 | 切鼠标点击穿透 |
| `W.setAlwaysOnTop` | 同步 | 切始终置顶 |
| `W.setShadow` | 同步 | 显式控阴影（覆盖 transparent 默认联动） |

### Hooks（4 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.hookKeyboard` | 同步注册 | 全局键盘 Hook |
| `W.unhookKeyboard` | 同步 | 停止键盘 Hook |
| `W.hookMouse` | 同步注册 | 全局鼠标 Hook |
| `W.unhookMouse` | 同步 | 停止鼠标 Hook |

### Python（8 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.isPythonInstalled` | 异步 | 检查是否已安装 |
| `W.installPython` | 异步 | 下载安装 |
| `W.initPython` | 异步 | 初始化解释器 |
| `W.runPythonScript` | 异步 | 运行脚本字符串 |
| `W.runPythonFile` | 异步 | 运行 .py 文件 |
| `W.deinitPython` | 异步 | 关闭解释器 |
| `W.addPythonMsgListener` | 同步注册 | 监听 Python→JS 消息 |
| `W.removePythonMsgListener` | 同步 | 移除监听 |

### Messaging（4 个）

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.postWinMsg` | 同步 | 向指定 hwnd 窗口发消息 |
| `W.addWinMsgListener` | 同步注册 | 注册窗口消息回调 |
| `W.addNativeMsgListener` | 同步注册 | 通用事件监听（无 remove） |
| `W.addFileDragListener` | 同步注册 | 文件拖拽回调 |

---

## 快速示例

### CLI

```bat
:: 新建名为 MyApp 的空白项目
weso.exe -n MyApp

:: 调试运行当前目录项目
weso.exe -d

:: 打包当前目录项目为 exe（输出到 dist\）
weso.exe -p

:: 为当前项目安装 Python 3.12.9（默认镜像）
weso.exe -e -v 3.12.9

:: 装 pip 本身，再装 requests 库
weso.exe -i pip -v 3.12.9
weso.exe -i requests==2.32.3 -v 3.12.9

:: 按 requirements.txt 批量安装
weso.exe -r requirements.txt -v 3.12.9
```

### 页面 JS

```js
// 读 res/ 下的配置文件
var path = W.getRes("config.json");
var text = await W.readFile({ path: path, encoding: "utf8" });
console.log(text);

// 写文本文件
await W.writeFile({ path: "C:\\app\\out.txt", data: "hello", encoding: "utf8" });

// 弹窗 + 查路径
W.alert("工作区: " + W.getWorkspace());

// 一次性调 DLL
W.invokeDll({
  dll: "user32.dll",
  func: "MessageBoxW",
  proto: { ret: "int", params: ["pointer", "string", "string", "uint"] },
  args: [0, "内容", "标题", 0]
}).then(function (r) { console.log(r); });

// 窗口拖拽（无边框窗口自绘标题栏）
W.bindDragWin(document.getElementById("titlebar"), function () {
  if (W.isWindowMaximized()) W.normWindow(); else W.maxWindow();
});
```

---

## 错误处理

### CLI

| 现象 | 原因 | 处理建议 |
|------|------|---------|
| `-p` 提示 `invalid path` | 工作区无 `weso.json` | 先 `weso.exe -n` 创建项目，或确认 `-w` 指对 |
| `-p` 报 Multiple Python versions | `python\py3` 下有多个版本 | 删除多余版本，只留一个再打包 |
| `-p` 报 No Python runtime found | 项目含 `.py` 但未装 Python | 先 `weso.exe -e -v <版本>` |
| `-d` 无反应/闪退 | 用的 weso.exe 不支持调试运行 | 换用支持 `-d` 的 weso.exe |
| Python 下载慢/失败 | 默认阿里云镜像不可达 | 用 `--py-proxy` 换源 |
| pip install 超时 | pip index 不可达 | 用 `--pip-proxy` 换源 |
| `-e`/`-i`/`-r` 缺版本报错 | 未带 `-v` | 补 `-v <版本>`（如 3.12.9） |
| `-i pip` 装的是名为 pip 的库 | 想装别的库却被当 pip | `-i pip` 专用于安装 pip 本身；装别的库写库名 |

### 页面 JS

| 错误类别 | 特征 | 处理建议 |
|---------|------|---------|
| 异步操作失败 | Promise reject | 挂 `.catch` 或用 `try/await` 捕获；check 错误对象 message |
| DLL 加载失败 | `loadDll` 返回 `0` | 确认路径正确、DLL 是 x64 位数 |
| DLL 调用参数不符 | `invokeDll` reject | 回参考文档核对 proto 字符串与 args 数组 |
| Python 未初始化 | `runPythonScript` 失败 | 先 `isPythonInstalled`→`installPython`→`initPython` |
| captureConsoleOutput 无输出 | 子窗口里调用 | 仅主窗口可捕获；子窗口需经 `postWinMsg` 转发 |
| 路径不存在 | `exists` 返回 false / 异步报错 | 先用 `getWorkspace`/`getRes` 拼正确绝对路径 |

---

## 参考文档

完整参数、前置条件、目录结构与多函数工作流均在对应模块文档中。

**CLI：**
- **新建项目**（目录结构 / weso.json 默认值 / -n 用法）→ `reference/cli/create-project.md`
- **打包与调试**（-p/-d/-w/-h / 输出产物 / 安装包模式）→ `reference/cli/package.md`
- **Python 运行时**（-e/-v/-y/--py-proxy / 安装目录布局）→ `reference/cli/python-runtime.md`
- **Python 第三方库**（-i/-r/--pip-proxy / 装库与装 pip）→ `reference/cli/python-libs.md`

**页面 JS：**
- **文件 I/O**（读写/目录/选择器）→ `reference/file-io.md`
- **路径与资源**（标准目录/打包资源）→ `reference/paths-assets.md`
- **系统 / OS**（弹窗/命令/环境/控制台）→ `reference/system.md`
- **DLL 互操作**（加载/调用/类/proto）→ `reference/dll-interop.md`
- **窗口管理**（创建/状态/几何/拖拽/托盘）→ `reference/window.md`
- **输入 Hook**（键盘/鼠标）→ `reference/hooks.md`
- **Python 集成**（安装/运行/通信）→ `reference/python.md`
- **消息与 IPC**（窗口通信/事件/拖拽）→ `reference/messaging.md`
