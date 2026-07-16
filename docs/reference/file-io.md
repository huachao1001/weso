# Weso JS — File I/O 模块参考

覆盖文件读写、目录操作、路径查询、文件选择器共 11 个函数。

---

## 共用说明

以下字段在多个函数中出现，含义一致：

- **`path`**：磁盘绝对路径，Windows 反斜杠（JS 字面量写 `\\`）。多个函数支持
  传纯字符串作为 `{ path: str }` 的简写。
- **`encoding`**：读写编码，决定返回值形态与数据匹配要求，见类型定义 FileEncoding。

---

## 类型定义

### FileEncoding

- `"utf8"` | `"utf-8"`：文本。读取返回文件文本；写入时 `data` 必须是 string。
- `"binary"`：二进制。**读取返回 `Uint8Array`**（直接拿到原始字节）；写入时 `data` 必须是
  `ArrayBuffer`/`Uint8Array`/`number[]`。
- `"base64"`：base64。读取返回 base64 字符串；写入时 `data` 是 base64 字符串。需要
  base64 文本本身（如拼 data URL）时用此编码，要原始字节用 `binary`。

---

## 函数列表

### `W.readFile`

异步读取文件内容，`encoding` 决定返回字符串形态。

**参数：**

- `path`* string → 见共用说明
- `encoding`? FileEncoding，默认 `"utf8"`

```js
// 文本
var text = await W.readFile({ path: "C:\\app\\config.json", encoding: "utf8" });

// 二进制 -> 直接拿到 Uint8Array
var bytes = await W.readFile({ path: path, encoding: "binary" });
console.log(bytes.length, bytes[0]);
```

---

### `W.readLines`

异步读取文本文件并按行拆分。

**参数：**

- `path`* string → 见共用说明

按 UTF-8 文本读取并按行拆分，无 `encoding` 参数。

```js
var lines = await W.readLines({ path: logPath });
lines.forEach(function (line, i) { console.log(i, line); });
```

---

### `W.writeFile`

异步写文件（创建或覆盖），成功返回 `true`，失败 reject。

**参数：**

- `path`* string → 见共用说明
- `data`* string | ArrayBuffer | Uint8Array | number[]
- `encoding`? FileEncoding，默认 `"binary"`
- `offset`? number：字节偏移量，默认 0。**写入前会先把文件截断到 `offset` 字节**，
  因此 `offset < 当前文件长度` 会丢弃其后内容；仅当 `offset == 当前文件长度` 时
  才是无损追加。注意这不是“插入”。

> `data` 类型必须与 `encoding` 匹配：字符串配 `"binary"` 会 reject。

```js
// 文本
await W.writeFile({ path: dir + "\\out.txt", data: "Hello weso!", encoding: "utf8" });

// 二进制
var data = new TextEncoder().encode("Hello, Weso!");
await W.writeFile({ path: dir + "\\bin.bin", data: data, encoding: "binary" });

// base64 -> 解码后写字节
await W.writeFile({ path: dir + "\\b64.txt", data: btoa("Hello weso!"), encoding: "base64" });
```

---

### `W.createFile`

同步创建空文件，返回 `boolean`。**文件已存在时返回 `false` 且不修改原文件**（不会截断/清空已有文件）。

**参数：**

- `path`* string | { path: string }

```js
W.createFile("C:\\app\\empty.txt");
W.createFile({ path: "C:\\app\\empty.txt" });
```

---

### `W.listdir`

异步列出目录条目，返回 `Promise<string[]>`。

**参数：**

- `path`* string | { path: string; filter?: number }
- `filter`? number：`1`=仅文件，`2`=仅目录，省略=全部

```js
var entries = await W.listdir("C:\\app");
var files = await W.listdir({ path: "C:\\app", filter: 1 });
```

---

### `W.mkdirs`

同步递归创建目录（含所有中间父级），返回 `boolean`，幂等。

**参数：**

- `path`* string | { path: string }

```js
W.mkdirs(W.getWorkspace() + "\\output\\sub\\deep");
```

---

### `W.exists`

同步判断文件或目录是否存在，返回 `boolean`。

**参数：**

- `path`* string | { path: string }

```js
if (W.exists("C:\\app\\config.json")) { /* ... */ }
```

---

### `W.rename`

同步重命名/移动文件或目录，返回 `boolean`。

**参数：**

- `path`* string：原路径
- `newName`* string：新名称（仅名称，非完整路径）

```js
W.rename({ path: "C:\\app\\old.txt", newName: "new.txt" });
```

---

### `W.delPath`

同步删除文件或目录（目录递归），返回 `boolean`。

**参数：**

- `path`* string | { path: string }

```js
W.delPath("C:\\app\\temp_dir");
```

---

### `W.openInExplorer`

同步在 Windows 资源管理器中显示文件或文件夹。

**参数：**

- `path`* string | { path: string }

```js
W.openInExplorer(W.getWorkspace() + "\\output");
```

---

### `W.openFileSelector`

异步打开原生文件/目录选择器，返回 `Promise<string[]>`（取消则空数组）。

**参数：**

- 字符串形式：单选文件
- 对象形式：
  - `path`? string：**当前不生效**（对话框在系统默认位置打开）
  - `multiSelect`? boolean：允许多选
  - `onlyFolder`? boolean：选目录而非文件

> 需要 `multiSelect` 或 `onlyFolder` 必须用对象形式。

```js
var files = await W.openFileSelector(outputDir);                    // 单选
var multi = await W.openFileSelector({ path: outputDir, multiSelect: true });
var dirs = await W.openFileSelector({ path: outputDir, onlyFolder: true });
```

---

## 常见工作流

### 工作流 1：写入并回读文本

```js
var dir = W.getWorkspace() + "\\output";
W.mkdirs(dir);
await W.writeFile({ path: dir + "\\note.txt", data: "hello\nworld", encoding: "utf8" });
var lines = await W.readLines({ path: dir + "\\note.txt" });
console.log(lines);   // ["hello", "world"]
```

### 工作流 2：二进制文件复制

```js
var bytes = await W.readFile({ path: srcPath, encoding: "binary" });
await W.writeFile({ path: dstPath, data: bytes, encoding: "binary" });
```

### 工作流 3：让用户选文件后处理

```js
var files = await W.openFileSelector({ path: W.getWorkspace(), multiSelect: true });
for (var i = 0; i < files.length; i++) {
  var text = await W.readFile({ path: files[i], encoding: "utf8" });
  console.log(files[i], text.length);
}
```
