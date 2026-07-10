# Weso JS — DLL Interop 模块参考

覆盖 DLL 加载/调用/释放及 `Dll` 封装类共 7 个函数。所有调用为**异步**（返回
`Promise`）；`loadDll`/`freeDll`/`getProcAddr` 为**同步**。

> 只能加载 **x64 DLL**，32 位 DLL 让 `loadDll` 返回 `0`。

---

## 共用说明

- **`proto`**：描述 C 函数签名的类型字符串或结构对象，所有调用函数通用。见类型
 定义 DllProto。
- **`args`**：调用参数数组，按 `proto` 中的形参顺序排列。`p` 类型传 JS string 当
  字符串指针、传 number 当原始地址。

---

## 类型定义

### DllProto

以下两种之一：

- 字符串形式：返回类型字符 + 形参字符拼接，如 `"iii"` = `int(int,int)`、`"v"` =
  `void()`
- 对象形式：

```ts
{ ret?: string; params?: string[] }   // 如 { ret: "int", params: ["pointer","string"] } == "ipp"
```

类型字符映射（名字不分大小写）：

| 名字 | 字符 | C 类型 |
|------|------|--------|
| `void` | `v` | void（仅返回） |
| `int` | `i` | int |
| `uint` | `u` | unsigned int |
| `long` | `l` | long |
| `ulong` | `L` | unsigned long |
| `short` | `s` | short |
| `ushort` | `S` | unsigned short |
| `char` | `c` | char |
| `uchar`/`byte` | `b` | unsigned char |
| `float` | `f` | float |
| `double` | `d` | double |
| `pointer`/`ptr`/`string` | `p` | 通用指针 |

### `p`（指针）类型规则

- 传 JS **string** → 转为 **UTF-16 宽字符指针**（`wchar_t*` / `LPCWSTR`），仅适用于
  Unicode（`-W` 后缀）导出（如 `MessageBoxW`）。调用 ANSI（`-A` 后缀）导出时不要传
  JS string（应自行取得 `char*` 地址后以 number 传入）。
- 传 JS **number** → 当作原始地址，可把一次调用的返回指针喂给下一次调用。

---

## 函数列表

### `W.invokeDll`

异步一次性调用（加载→调用→释放），适合只调一次。

**参数：**

- `dll`* string：DLL 路径或系统名
- `func`* string：导出函数名
- `proto`* DllProto → 见共用说明
- `args`? unknown[]：参数数组

```js
W.invokeDll({
  dll: "user32.dll",
  func: "MessageBoxW",
  proto: { ret: "int", params: ["pointer", "string", "string", "uint"] },
  args: [0, "内容", "标题", 0]
}).then(function (r) { console.log(r); });
```

---

### `W.loadDll`

同步加载 DLL，返回模块句柄（`number`，`0` = 失败）。

**参数：**

- `path`* string

```js
var handle = W.loadDll(W.getRes("weso_test_dll.dll"));
if (!handle) throw new Error("loadDll 失败");
```

> 每个 `loadDll` 必须配对 `freeDll`，否则泄漏。

---

### `W.freeDll`

同步释放模块，对 `0` 句柄幂等，返回 `boolean`。

**参数：**

- `handle`* number

```js
W.freeDll(handle);
```

---

### `W.getProcAddr`

同步把导出名解析为函数地址（`number`，`0` = 未找到）。模块存活期间稳定，可缓存。

**参数：**

- `handle`* number
- `func`* string

```js
var addr = W.getProcAddr(handle, "add");
```

---

### `W.invokeByHandle`

异步按句柄 + 导出名调用（不缓存地址）。

**参数：**

- `handle`* number
- `func`* string
- `proto`* DllProto → 见共用说明
- `args`? unknown[]

```js
var ret = await W.invokeByHandle({ handle: handle, func: "add", proto: "iii", args: [7, 8] });
```

---

### `W.invokeByAddr`

异步按原始地址调用。

**参数：**

- `addr`* number
- `proto`* DllProto → 见共用说明
- `args`? unknown[]

```js
var ret = await W.invokeByAddr({ addr: addr, proto: "iii", args: [5, 6] });
```

---

### `new W.Dll(path?)`

`Dll` 封装类，缓存导出地址以加速重复调用。**必须手动 `free()`**。

**方法：**

| 方法 | 同步/异步 | 说明 |
|------|----------|------|
| `constructor(path?)` | 同步 | 传 `path` 时加载 DLL，失败（句柄 0）抛错；**省略 `path` 时不加载、`handle` 保持 0、不抛错**（后续可手动加载） |
| `addr(func)` | 同步 | 取缓存地址（`number`），不调用 |
| `invoke(func, proto, args)` | 异步 | 缓存地址后调用（反复调用首选） |
| `call(func, proto, args)` | 异步 | 不缓存地址（一次性） |
| `callAddr(addr, proto, args)` | 异步 | 按已有地址调用 |
| `free()` / `dispose()` | 同步 | 释放模块，多次调用安全 |

```js
var dll = new W.Dll(W.getRes("weso_test_dll.dll"));

// 缓存地址反复调用
console.log(await dll.invoke("add", "iii", [7, 8]));      // 15
console.log(await dll.invoke("add", "iii", [100, 1]));    // 101（地址已缓存）

// 指针流转：greet() 返回地址再喂回 strlen_ptr
var greetPtr = await dll.invoke("greet", { ret: "pointer", params: [] }, []);
console.log(await dll.invoke("strlen_ptr", { ret: "int", params: ["pointer"] }, [greetPtr]));

dll.free();
```

> `free()` 后 `handle === 0`：再调 `call` 会 **reject**；再调 `invoke`
> 会**同步抛错**（报 `Dll: module not loaded`）。`callAddr` 仅在 `addr` 为 0 时
> reject；若传入 `free()` 前缓存的非零地址，不会 reject 而是对已释放模块发起
> 调用（未定义行为），因此 `free()` 后**切勿再使用旧地址**。

---

## 常见工作流

### 工作流 1：一次性调用系统 DLL

```js
W.invokeDll({
  dll: "user32.dll",
  func: "MessageBoxW",
  proto: { ret: "int", params: ["pointer", "string", "string", "uint"] },
  args: [0, "Hello", "Title", 0]
}).then(function (r) { console.log("返回:", r); });
```

### 工作流 2：反复调用同一 DLL（Dll 类）

```js
var dll = new W.Dll(W.getRes("my.dll"));
try {
  console.log(await dll.invoke("add", "iii", [1, 2]));
  console.log(await dll.invoke("add", "iii", [3, 4]));   // 地址已缓存
} finally {
  dll.free();
}
```

### 工作流 3：指针链式流转

```js
var dll = new W.Dll(dllPath);
var ptr = await dll.invoke("greet", { ret: "pointer", params: [] }, []);
var len = await dll.invoke("strlen_ptr", { ret: "int", params: ["pointer"] }, [ptr]);
console.log("len =", len);
dll.free();
```

### 工作流 4：手动句柄管理（不用类）

```js
var h = W.loadDll(dllPath);
var addr = W.getProcAddr(h, "add");
var ret = await W.invokeByAddr({ addr: addr, proto: "iii", args: [5, 6] });
W.freeDll(h);
```
