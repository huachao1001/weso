# 新建项目 (`-n`)

用 `weso.exe -n` 创建一个空白 Weso 项目：生成标准目录结构、默认 `weso.json`
配置，以及一个最小入口 `www/index.html`。

## 命令

```
weso.exe -n [project_name] [-w project_path]
```

| 参数 | 是否必需 | 说明 |
|------|---------|------|
| `-n` | 是 | 动作标志，表示新建项目。别名：`init`、`--new` |
| `project_name` | 否 | 项目名。给出则在 `<工作区>` 下创建同名子目录作为项目根；不给则直接用 `<工作区>` 本身作项目根 |
| `-w <path>` | 否 | 工作区路径，默认当前工作目录 |

## 用法分支

- **`weso.exe -n`** — 当前目录即项目根，直接在其中建目录与文件。
- **`weso.exe -n MyApp`** — 在当前目录下创建 `MyApp/` 子目录作为项目根。
- **`weso.exe -n MyApp -w D:\Apps`** — 在 `D:\Apps\MyApp\` 下建项目。
- **`weso.exe -n -w D:\Apps`** — 直接把 `D:\Apps` 作为项目根（无子目录）。

> 别名 `init` / `--new` 等价于 `-n`，例如 `weso.exe init MyApp`。

## 生成的目录结构

```
<项目根>/
├── www/              # web 资产（HTML/CSS/JS/图片），打包时加密进代码包
│   └── index.html    # 默认入口，对齐 weso.json 的 entry
├── res/              # 资源文件（dll/数据等），磁盘访问，经 getRes API 读取
├── python/
│   └── src/          # Python 源码（.py），打包时编译为 .pyc 下发
└── weso.json         # 项目配置
```

| 目录 | 对应打包语义 |
|------|-------------|
| `www/` | 加密代码包（内存资源），运行时经 `getAssets` 读取；避免放大文件 |
| `res/` | 磁盘资源，运行时经 `getRes`/`getResFolder` 读取 |
| `python/src/` | 用户 Python 源码；打包时编译为 `.pyc`，源码不进包 |
| `python/py3/` | （由 `-e` 安装产生，不在 `-n` 生成范围）Python 解释器运行时 |

## weso.json 默认值

`-n` 通过 `Config::writeDefaultJson` 写入如下默认配置；若 `weso.json` 已存在则
**保留不动**，不覆盖：

```json
{
  "entry": "index.html",
  "injectJS": "",
  "width": 600,
  "height": 400,
  "bgColor": "#F0F0F0",
  "appNameCN": "新建项目",
  "appNameEN": "NewProject",
  "borderless": false,
  "transparent": false,
  "ico": "",
  "key": "",
  "fileVer": "0.0.0.1",
  "productVer": "0.0.0.1-apha",
  "copyright": "Copyright(C) 2024-2026 WESO",
  "companyName": "weso Company",
  "fileDesc": "这是个weso应用",
  "packAll": true
}
```

字段含义速览：

| 字段 | 含义 |
|------|------|
| `entry` | `www/` 下入口文件名，也可是在线 URL（如 `https://...`） |
| `injectJS` | 注入到主入口页面的额外 JS 文件名（可空）。**主要面向在线网页**：把 `entry` 指向在线网站后，用 `injectJS` 往该网站注入自定义逻辑，本地页面亦可注入但通常无此需要。仅作用于主入口窗口，不注入 `W.createWin` 动态创建的子窗口 |
| `width`/`height` | 窗口初始尺寸 |
| `bgColor` | 窗口背景色（`#RRGGBB`） |
| `appNameCN`/`appNameEN` | 中/英文应用名，`appNameEN` 亦作窗口类名 |
| `borderless` | 是否无边框窗口 |
| `transparent` | 主窗口是否创建即透明（`true` 时创建带 `WS_EX_NOREDIRECTIONBITMAP`，透明像素直显桌面）。仅种子主窗口；子窗口透明用 `W.createWin({transparent:true})`。打包时同样写入 exe 字符串表 |
| `ico` | 图标路径（相对工作区或绝对，留空用默认） |
| `key` | 授权 key，留空=免费应用 |
| `fileVer`/`productVer` | 版本信息（写入 exe 属性） |
| `copyright`/`companyName`/`fileDesc` | exe 属性元数据 |
| `packAll` | `true`=单 exe（res+python 嵌入）；`false`=散文件（res+python 放 exe 旁） |

`assetsKey` 不写入配置：每次 `-p` 打包随机生成，写进 exe 字符串表。

## 幂等性

- `weso.json` 已存在 → 保留，仅提示。
- `www/index.html` 已存在 → 不覆盖。
- 目录已存在 → `makedirs` 静默跳过。

因此 `-n` 可安全地在已有项目上补建缺失的目录/文件，不会破坏用户改动。

## 注意事项

- `-n` 不联网，只建目录和配置文件。
- 创建后默认不含 Python；如需 Python，再执行 `weso.exe -e -v <版本>`
  （见 `python-runtime.md`）。
- 默认 `index.html` 背景色与 `weso.json` 的 `bgColor` 一致（`#F0F0F0`），
  改色时两处同步更稳妥。
