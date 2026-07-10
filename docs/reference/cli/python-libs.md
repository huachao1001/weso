# 安装 Python 第三方库 (`-i` / `-r` / `--pip-proxy`)

用 pip 为项目已安装的 Python 版本添加第三方库；`-i pip` 专用于安装 pip 本身。

> 前置：Python 运行时已由 `-e` 装好（`python/py3/<版本>/python.exe` 存在）。
> 所有库安装命令都必须带 `-v <版本>` 指定目标 Python。

## 安装单个库 `-i`

```
weso.exe -i <name>[<specifier>] -v <version> [-w <path>] [--pip-proxy <url>]
```

| 参数 | 说明 |
|------|------|
| `-i <name>` | 库名，如 `requests` |
| `-i <name><specifier>` | 带版本约束，**specifier 直接用 pip 原生语法**如 `requests==2.32.3` |
| `-i pip` | **特例**：安装 pip 本身（大小写不敏感匹配 `pip`） |
| `-v <version>` | 目标 Python 版本，**必需** |
| `--pip-proxy <url>` | pip index，默认 `https://mirrors.aliyun.com/pypi/simple/` |

实际执行等价于（`-i` 后的整段原样拼进命令）：
```
python/py3/<版本>/python.exe -m pip install <name><specifier> --index-url=<pip-proxy>
```

> ⚠️ `-i` 后的版本约束**原样传给 pip**，不做任何 `=`→`==` 转换。pip 不认单 `=`，
> 故写 `-i requests=2.32.3` 会被 pip 报 `Invalid requirement`。必须用 pip 语法
> `-i requests==2.32.3`（或 `>=`/`~=`/`!=` 等）。

### `-i pip` 的特殊性

`-i pip` 不是“安装名为 pip 的库”——它是**安装 pip 本身**的动作。匹配规则对
`pip` 大小写不敏感：

- `-i pip` → 安装 pip
- `-i requests` → 安装 requests 库

如检测到某版本尚未装 pip，主动提示用户先 `weso.exe -i pip -v <版本>`。

## 按文件批量安装 `-r`

```
weso.exe -r <requirements_file> -v <version> [-w <path>] [--pip-proxy <url>]
```

| 参数 | 说明 |
|------|------|
| `-r <file>` | requirements 文件路径（相对工作区或绝对） |
| `-v <version>` | 目标 Python 版本，**必需** |
| `--pip-proxy <url>` | pip index |

实际执行等价于：
```
python/py3/<版本>/python.exe -m pip install -r <file> --index-url=<pip-proxy>
```

## 安装位置

- `-i <lib>` / `-r` 安装的库进入**该 Python 自身的**
  `python\py3\<版本>\Lib\site-packages`。
- `-i pip`（安装 pip 本身）则装进**独立目录** `<LocalAppData>\weso\pip\<主><次>\`，
  不放项目 Python 内。

二者装好的包都能被该版本 Python import（路径已自动配置）。打包 `-p` 时这些库随
`python/` 一起进资源包。

## 换源

| 默认 | 覆盖 |
|------|------|
| `https://mirrors.aliyun.com/pypi/simple/` | `--pip-proxy <url>` |

常见替代：
- 官方：`https://pypi.org/simple/`
- 清华：`https://pypi.tuna.tsinghua.edu.cn/simple/`

## 常见错误

| 现象 | 原因 | 解决 |
|------|------|------|
| `Please specify Python version via -v` | 缺 `-v` | 补 `-v <版本>` |
| pip 命令不存在/装库失败 | 该版本未装 pip | 先 `weso.exe -i pip -v <版本>` |
| 装库超时/网络错误 | pip index 不可达 | `--pip-proxy` 换源 |
| `-i` 后无参数 | 命令行缺库 | 补库名：`-i <name>` |

## 示例

```bat
:: 先装 pip（每个新装的 Python 版本通常需要）
weso.exe -i pip -v 3.12.9

:: 装单个库（带版本用 pip == 语法，不会自动把 = 转成 ==）
weso.exe -i requests -v 3.12.9
weso.exe -i requests==2.32.3 -v 3.12.9

:: 按 requirements.txt 批量装，用清华源
weso.exe -r requirements.txt -v 3.12.9 --pip-proxy https://pypi.tuna.tsinghua.edu.cn/simple/

:: 完整从零配 Python 环境
weso.exe -e -v 3.12.9
weso.exe -i pip -v 3.12.9
weso.exe -r requirements.txt -v 3.12.9
```
