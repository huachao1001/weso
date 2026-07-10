# Weso 示例程序

基于 [Weso](https://github.com/huachao1001/weso) 框架开发的官方示例应用，以交互式代码编辑器的形式演示 Weso 全部页面 JS API 的用法。

## 这是什么

Weso 是一个用 Web 技术渲染界面、并为页面内的 JavaScript 提供原生（native）能力的 Windows 应用开发框架。Native 能力涵盖文件、Windows 窗口与系统操作，**并支持直接调用 C/C++/DLL 以及在页面内运行 Python 脚本**。开发者用 HTML/CSS/JS 写界面，通过 `W`（别称 `weso`）全局对象调用上述原生能力，最终用 `weso.exe` 打包成单文件 exe。

本仓库是 Weso 的**示例程序**——一个内置代码编辑器与输出日志的交互式 Playground。左侧菜单按模块组织 55 个可运行脚本，选中即可查看代码、点击运行并实时观察原生调用结果。

```
┌─────────────┬───────────────────────────────────┐
│  脚本示例    │  系统 / 系统弹窗        ↻ 刷新  ▶ 运行 │
│             │───────────────────────────────────│
│  ⚙️ 系统     │  脚本编辑器           │  输出日志     │
│  📁 文件     │                      │              │
│  🪟 窗口     │  W.alert("来自 weso    │  === 系统弹窗 │
│  ➕ C++     │   的系统弹窗！");     │  调用 W.alert │
│  🐍 Python   │                      │  弹窗已关闭   │
└─────────────┴───────────────────────┴──────────────┘
```

## 功能模块

| 模块 | 示例数 | 覆盖能力 |
|------|--------|---------|
| ⚙️ 系统 | 6 | 原生消息框、执行 cmd 命令、环境变量读写、捕获 stdout/stderr、DevTools、退出应用 |
| 📁 文件 | 17 | 文本/二进制/base64 读写、多行读取、目录创建与列举、文件选择器、路径操作、资源包读取、文件拖拽监听 |
| 🪟 窗口 | 14 | 显示/隐藏/最小化/最大化、创建与销毁子窗口、窗口句柄与屏幕几何、拖拽移动、关闭拦截、系统托盘、窗口间通信、键盘/鼠标 Hook |
| ➕ C++ | 13 | DLL 一次性调用、整数/浮点/字符串/混合类型传参、句柄加载与地址调用、`Dll` 封装类 |
| 🐍 Python | 5 | 运行时下载安装、运行脚本/文件、模块搜索路径、JS ↔ Python 双向通信 |

## 目录结构

```
weso-github/
├── www/                  # Web 资产（界面 + 示例脚本）
│   ├── index.html        # 入口页面
│   ├── index/            # 主界面逻辑、菜单配置、样式
│   ├── code/             # 55 个分类示例脚本
│   │   ├── system/       #   系统能力
│   │   ├── file/         #   文件 I/O
│   │   ├── window/       #   窗口管理
│   │   ├── cpp/          #   DLL 互操作
│   │   └── python/       #   Python 集成
│   └── lib/              # CodeMirror 代码编辑器
├── res/                  # 磁盘资源（DLL、配置），经 getRes API 读取
│   ├── config.json
│   ├── weso_test_dll.dll # 示例用测试 DLL
│   └── console_print_dll.dll
├── python/src/           # Python 源码示例
├── weso.json             # 项目配置（窗口尺寸、应用名、打包选项等）
├── weso.d.ts             # Weso API TypeScript 类型定义
├── jsconfig.json         # JS IntelliSense 配置
└── skills/               # Weso 开发参考文档
```

## 快速开始

### 前置条件

- Windows 10/11
- `weso.exe`（从 [Weso](https://github.com/huachao1001/weso) 获取）

### 调试运行

```bat
weso.exe -d -w <your-workspace>/weso
```

以工作区为根直接启动应用，无需打包。启动后页面自动打开 DevTools，左侧选择示例，点击「▶ 运行」即可执行。

### 打包为 exe

```bat
weso.exe -p -w <your-workspace>/weso
```

产物输出到 `dist\Weso示例.exe`。`weso.json` 中 `packAll: false`，res 与 python 以散文件放在 exe 同级目录。

## API 概览

页面运行时，`window.W`（及 `window.weso`）已就绪，提供以下能力域：

```js
// 文件 I/O —— 同步/异步混合，路径用 Windows 反斜杠
var path = W.getRes("config.json");          // res/ 相对路径 → 绝对路径
var text = await W.readFile({ path: path, encoding: "utf8" });
await W.writeFile({ path: "C:\\out.txt", data: "hello", encoding: "utf8" });

// 系统与 OS
W.alert("原生消息框");
W.system("echo hello");                      // 执行 cmd，返回 stdout+stderr

// DLL 互操作 —— 声明 proto，native 自动处理类型转换
W.invokeDll({
    dll: "user32.dll",
    func: "MessageBoxW",
    proto: { ret: "int", params: ["pointer", "string", "string", "uint"] },
    args: [0, "内容", "标题", 0]
}).then(function (r) { console.log(r); });

// 窗口管理
W.bindDragWin(document.getElementById("titlebar"));
W.showTray(icon, "Weso", menuItems, function (key) { /* ... */ });

// Python 集成
await W.installPython({ version: "3.12.10" });
await W.initPython("3.12.10");
W.addPythonMsgListener(function (data) { console.log(data); });
await W.runPythonScript("import weso\nweso.post_msg({'msg': 'hi'})");
```

完整类型定义见 [`weso.d.ts`](weso.d.ts)，开发参考文档见 [`skills/`](skills/)。
