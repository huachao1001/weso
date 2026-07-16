# 安装 Python 运行时 (`-e` / `-v` / `--py-proxy`)

为 Weso 项目安装嵌入式 Python 解释器，供打包时编译 `.py`、运行时执行脚本。

> `-e` 只下载/解压 embed zip，**不运行 pip**，因此 `--pip-proxy` 对 `-e` 无效
> （该参数仅 `-i`/`-r`/`-i pip` 用到，见 `python-libs.md`）。下面命令行不再列
> `--pip-proxy`。

## 命令

```
weso.exe -e -v <version> [-w <path>] [--py-proxy <url>]
```

| 参数 | 必需 | 说明 |
|------|------|------|
| `-e` | 是 | 动作标志：安装 Python 运行时 |
| `-v <version>` | **是** | Python 版本，如 `3.12.9`。不带 `-v` 直接报错退出 |
| `-w <path>` | 否 | 工作区，默认当前目录 |
| `--py-proxy <url>` | 否 | Python embed zip 下载镜像根，默认阿里云源 |

## 版本号格式

`-v` 取完整三点版本号，例如 `3.12.9`、`3.11.8`。会拼接为
`python-<版本>-embed-amd64.zip` 下载（x64 嵌入版）。

## 安装目录布局

安装后工作区内出现：

```
<工作区>/python/py3/<版本>/
├── python.exe
├── python311.dll        # 版本相关，名如 python<主><次>.dll
├── python311._pth       # 路径配置（含 site-packages）
├── Lib/site-packages/
└── ...
```

- 嵌入版默认不含 pip；需要 pip 时用 `weso.exe -i pip -v <版本>`
  （见 `python-libs.md`）。
- 安装会精简不必要的文件以减小体积。

## 如何判断已安装

重复执行 `-e -v <版本>` 时，若该版本已装会跳过下载。查看 `python/py3/<版本>/`
目录是否存在即可判断是否已安装。

## 下载源

| 项目 | 默认 | 覆盖参数 |
|------|------|---------|
| Python embed zip | `https://mirrors.aliyun.com/python-release/windows` | `--py-proxy <url>` |

- `--py-proxy` 给的是**根**：实际下载 URL = `<根>/python-<版本>-embed-amd64.zip`
  （直接拼在根下，**不加版本子目录**）。因此镜像必须把各版本 embed zip 平铺在根下。
- ⚠️ 官方 `https://www.python.org/ftp/python` 与中科大
  `https://mirrors.ustc.edu.cn/python` 的目录结构是 `<根>/<版本>/python-<版本>-embed-amd64.zip`
  （带版本子目录），**与上述拼接方式不兼容**，直接传会 404。默认阿里云源可用时无需更换。

## 与打包的关系

- `-e` 装的 Python 供 `-p` 打包时编译 `.py` → `.pyc`，并随 res+python 打包进 exe。
  双击打包后的 exe 安装时，python/ 解压到用户选择的安装路径。
- `-p` 不带 `-v` 时自动从 `python/py3/` 探测版本；多版本会报错。
- `-y`（默认 `python/src`）在 `-p` 时指定源码目录，与 `-e` 无直接关系。

## 常见错误

| 现象 | 原因 | 解决 |
|------|------|------|
| `Please specify Python version via -v` | `-e` 未带 `-v` | 补 `-v <版本>` |
| 下载长时间无响应/失败 | 镜像不可达 | `--py-proxy` 换源 |
| `[FAIL] Failed to install Python` | 下载或解压失败 | 换源重试；检查网络/磁盘空间 |

## 示例

```bat
:: 默认源安装 3.12.9 到当前项目
weso.exe -e -v 3.12.9

:: 指定工作区（用默认阿里云镜像；注意官方 python.org ftp 与当前扁平 URL 逻辑不兼容，见上文）
weso.exe -e -v 3.12.9 -w D:\Apps\MyApp

:: 安装后通常接着装 pip 与依赖
weso.exe -i pip -v 3.12.9
weso.exe -r requirements.txt -v 3.12.9
```
