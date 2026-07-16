# Weso 开发文档（CLI + 页面 JS API）

Weso 开发分两个层面：

1. **CLI（`weso.exe` 命令行）** — 在应用之外操作项目：新建项目、调试运行、打包成
   单文件 exe、安装 Python 运行时、安装第三方 Python 库。
2. **页面 JS API（`W` / `weso`）** — 在 Weso 应用页面里调用文件、窗口、系统、
   DLL、Python 等原生能力。

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
| `-i <name>[<spec>]` | 安装库（spec 用 pip 语法如 `==2.3`） | 必须 `-v` |
| `-r <file>` | 按 requirements 文件批量安装 | 必须 `-v` |

---

## 函数速查（页面 JS）

### File I/O

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.readFile` | 异步 | 读取文件（utf8/binary/base64） |
| `W.writeFile` | 异步 | 写文件（文本/二进制/base64） |
| `W.listdir` | 异步 | 列出目录 |
| `W.exists` | 同步 | 判断路径是否存在 |
| `W.openFileSelector` | 异步 | 文件/目录选择器 |

### System

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.alert` | 同步 | 原生消息框 |
| `W.system` | 异步 | 执行 cmd 命令 |
| `W.getEnv` / `W.setEnv` | 同步 | 读写环境变量 |
| `W.exitApp` | 同步 | 退出应用 |

### DLL Interop

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.invokeDll` | 异步 | 一次性加载+调用+释放 |
| `W.loadDll` / `W.freeDll` | 同步 | 加载/释放 DLL |
| `new W.Dll(path)` | — | DLL 封装类 |

### Window

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.createWin` / `W.destroyWin` | 同步 | 创建/销毁子窗口 |
| `W.bindDragWin` | 同步 | 绑定拖拽手柄 |
| `W.showTray` | 同步 | 系统托盘菜单 |

### Python

| 函数名 | 同步/异步 | 用途 |
|--------|----------|------|
| `W.installPython` | 异步 | 下载安装 |
| `W.initPython` | 异步 | 初始化解释器 |
| `W.runPythonScript` | 异步 | 运行脚本字符串 |

---

## 参考文档

完整参数、前置条件、目录结构与多函数工作流均在对应模块文档中，见左侧侧边栏。
