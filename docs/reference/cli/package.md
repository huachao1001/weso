# 打包与调试 (`-p` / `-d` / `-w` / `-h`)

把 Weso 项目打包成单文件 exe，或在不打包的情况下直接调试运行。

## 帮助

```
weso.exe -h
```

别名：`--help`、`help`。打印所有命令用法后退出。

## 工作区

```
weso.exe <动作> -w <project_path>
```

- `-w <path>` 指定项目工作区路径，未指定时用**当前工作目录**。
- 工作区应是含 `weso.json` 的项目根（`-d` 例外，可缺省并自动创建）。

## 调试 `-d`

```
weso.exe -d [-w <path>]
```

- 直接以工作区为根启动应用（不经打包），用于本地开发预览。
- 工作区缺 `weso.json` 时自动写一份默认配置。

## 打包 `-p`

```
weso.exe -p [-w <path>] [-v <version>] [-y <py_dir>]
```

| 参数 | 说明 |
|------|------|
| `-w <path>` | 工作区，默认当前目录 |
| `-v <version>` | 可选。**仅当 `python\py3\` 下无已装版本时作回退使用**；若有已装版本则一律用已装版本、`-v` 被忽略（不能覆盖已装版本） |
| `-y <py_dir>` | Python 源码目录名，默认 `python/src` |

### 前置条件

1. 工作区必须含 `weso.json`，否则报 `invalid path` → 先 `weso.exe -n`。
2. 若项目含 `.py` 源码（`python/src/`），必须先装好 Python（`-e`），否则报
   `No Python runtime found` / `Please install python ... first`。
3. `python\py3\` 下若存在多个版本，会报错要求只保留一个。

### 打包流程（用户须知）

1. 读取 `weso.json` 配置。
2. 若 `python/src/` 有 `.py`，调用 Python 把它们编译为 `.pyc`（源码不进包）。
3. res + python 打进 `.dotRes.wpk` 嵌入 exe 尾部（若存在 res/ 或 python/）。
4. `www/` 打成加密代码包（每次随机 `assetsKey`），追加进 exe。
5. 改写 exe 元数据（图标、版本、窗口尺寸、标题等来自 `weso.json`）。

### 安装包模式

打包后的 exe 是**安装包**，双击运行时：

1. 弹出安装路径选择对话框（输入框 + 浏览按钮），默认路径为
   `%LOCALAPPDATA%\Programs\<appNameEN>`。
2. 将 `.dotRes.wpk` 解压到用户选择的安装路径（res/ 与 python/ 并排落地）。
3. 把 exe 精简（去掉嵌入的 dotRes 字节，size 字段清零）复制到安装路径。
4. 在桌面和开始菜单创建快捷方式，指向已安装的 exe。
5. 自动启动已安装副本，安装包进程退出。

已安装的精简 exe 尾部 dotRes size=0，再次双击直接进入应用模式（无需安装）。
无 res/python 的纯 www 应用打包后 dotRes size=0，双击也直接运行。

### 输出

- 打包产物在工作区下的 `dist\` 目录：
  `dist\<appNameCN>.exe`（`appNameCN` 取自 `weso.json`）。
- 输出目录名固定为 `dist`（构建目录名常量）。

### 路径/资源过滤规则

调用方需了解哪些文件会/不会进包：

| 文件 | 是否进 www 代码包 | 是否进 res/python 资源包 |
|------|-----------------|----------------------|
| `www/**`（含 html/css/js/图片，非 .py） | 是 | — |
| `www/**` 下的 `.py`/`.pyc`/`__pycache__` | 否（被过滤） | — |
| `res/**` | — | 是 |
| `python/py3/**`（解释器运行时） | — | 是 |
| `python/src/**.py`（用户源码） | — | 否（仅 `.pyc` 进） |
| `python/src/**/__pycache__` | — | 否 |

即：`.py` 源码与 `__pycache__` 永不进包；只有编译后的 `.pyc` 随资源包下发。

## `-y` 的作用

`-y <py_dir>` 指定 Python 源码目录名（相对工作区，默认 `python/src`）。
仅当你的项目把 Python 源码放在非默认位置时才需要改，绝大多数项目用默认值即可。

## 常见错误

| 现象 | 原因 | 解决 |
|------|------|------|
| `invalid path: ...` | 工作区无 `weso.json` | `weso.exe -n` 建项目或核对 `-w` |
| `No Python runtime found under python\py3` | 含 `.py` 但未装 Python | `weso.exe -e -v <版本>` |
| `Please install python with version X first` | 指定版本未装 | 先 `-e -v X` |
| `Multiple Python versions found` | `python\py3` 下多个版本 | 删除多余版本只留一个 |
| `Please remove <dist\app.exe> first` | 输出 exe 被占用（运行中） | 关闭正在运行的应用再打包 |
| `-d` 闪退/无窗口 | 当前 weso.exe 不支持调试运行 | 换用支持 `-d` 的 weso.exe |

## 工作流示例

```bat
:: 从零开始：建项目 -> 装 Python -> 写代码 -> 打包
weso.exe -n MyApp
cd MyApp
weso.exe -e -v 3.12.9
:: ...在 www/ 写页面、python/src 写脚本...
weso.exe -p

:: 只调试不打包
weso.exe -d

:: 打包：若 python\py3 下无已装版本，用 -v 指定回退版本（有已装版本时 -v 被忽略）
weso.exe -p -v 3.12.9
```
