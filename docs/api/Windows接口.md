# Windows接口
## bindDragWin
绑定指定的html对象，使得鼠标在该html对象上按住左键时，可以实现拖拽整个软件窗口。
```javascript
bindDragWin(obj: HTMLElement): void;
```
- **obj：** HTMLElement类型，该对象所在的区域可以拖拽窗口。
- **返回：** 无。
---

## system
执行命令，实现类似命令提示符中执行命令的功能。
```javascript
system(cmd: string): string;
```
- **cmd：** 字符串类型，执行的命令。
- **返回：** 字符串类型。命令返回结果。
---

## addSysPath
将指定的路径加入到环境变量`path`中。
```javascript
addSysPath(path: string): void;
```
- **path：** 字符串类型，要加入到环境变量`path`的路径。
- **返回：** 无。
---

## alert
系统弹窗。
```javascript
alert(msg: string):void;
```
- **msg：** 字符串类型。弹窗显示的内容。
- **返回：** 无。
---

## setEnv
设置环境变量。
```javascript
//append: default is false
setEnv(name: string, val: string, append?: boolean): void;
```
- **name** 字符串类型。环境变量的名称。
- **val** 字符串类型。环境变量的值。
- **append** boolean，默认为`false`。是否将`val`值追加到环境变量`name`原来的值后面。
- **返回：** 无。
---

## openInExplorer
在`文件资源管理器`中打开指定的文件或目录。
```javascript
openInExplorer(path: string): boolean;
```
- **path：** 字符串类型，指定的文件或目录路径。
- **返回：** boolean，是否打开成功。
---

## showWindow
显示软件窗口。
```javascript
showWindow(): void;
```
- **返回：** 无。
---

## hideWindow
隐藏软件窗口。
```javascript
hideWindow(): void;
```
- **返回：** 无。
---

## minWindow
最小化软件窗口。
```javascript
minWindow(): void;
```
- **返回：** 无。
---

## maxWindow
最大化软件窗口。
```javascript
maxWindow(): void;
```
- **返回：** 无。
---

## normWindow
恢复正常软件窗口。
```javascript
normWindow(): void;
```
- **返回：** 无。
---

## isWindowMaximized
判断当前软件窗口是否是最大化。
```javascript
isWindowMaximized(): boolean;
```
- **返回：** boolean, 当前窗口是否是最大化。
---

## isWindowVisible
判断短期窗口是否可见。
```javascript
isWindowVisible(): boolean;
```
- **返回：** boolean, 当前窗口是否可见。
---


## setOnClickCloseIconListener
添加右上角关闭按钮点击监听。
```javascript
setOnClickCloseIconListener(listener: () => void): void;
```
- **listener：** 回调函数。如果用户点击了右上角关闭按钮，则会触发该函数的调用。
- **返回：** 无。

> 注意：如果设置了关闭按钮点击监听，则系统不再执行软件关闭，需要开发者手动执行`exitApp()`函数退出软件。
---

## showTray
显示系统托盘。
```javascript
showTray(iconPath: string, title: string, items: Map<Integer, string>, callback: (data: any) => void): void;
```
- **iconPath：** 字符串类型。系统托盘图标所在的路径，图标必须为`ico`类型。如果图标路径不正确或者图标内容错误，则默认使用软件图标。
- **title：** 字符串类型。托盘标题，鼠标移动到托盘图标时，会显示该内容。
- **items：** `Map`类型。用于显示托盘点击右键时的内容列表。其中`key`为整数，表示列表选项的`id`，当`id`为`0`时，表示间隔线条；`value`为字符串，表示列表的选项显示内容。
- **callback：** 回调函数。当点击列表选项时会触发该函数的调用，传入的`data`对象包含`itemId`字段，用于区分点击了那个选项。
- **返回：** 无。

示例：
```javascript
function onTrayMsg(msgData) {
    let itemId = msgData.itemId;
    if (itemId == 1) {//打开
        Native.showWindow();
    } else if (itemId == 2) {//退出
        Native.exitApp();
    }
}
let items = new Map();
items.set(1, "打开");
items.set(0, "");
items.set(2, "退出");
Native.showTray("favicon.ico", "这里是托盘的标题", items, onTrayMsg);
```
---

## exitApp
退出应用。
```javascript
exitApp();
```
- **返回：** 无。
---

## openFileSelector
打开文件选择器窗口，用于用户选择文件或目录。
```javascript
//default:defaultDirPath="", multiSelect=true, onlyFolder=false
openFileSelector(defaultDirPath?: string, multiSelect?: boolean, onlyFolder?: boolean):string[];
```
- **defaultDirPath：** 字符串类型。默认为`""`，表示默认打开的目录。
- **multiSelect：** boolean。默认为`true`，是否允许选择多个文件或目录。
- **onlyFolder：** boolean。默认为`false`，是否只允许选择目录。
- **返回：** 字符串数组类型，表示用户选择的文件或目录的路径列表。如果用户没有选择任何文件和目录，则返回空数组。
---

## addNativeMsgListener
监听来自`Native`的消息。
```javascript
addNativeMsgListener(type: string, cb: (data:any)=>void);
```
- **type：** 字符串类型，表示消息类型。
- **cb：** 回调函数。参数data用于接受消息数据。
- **返回：** 无。
---

## getTaskbarRect
获取任务栏所在的区域
```javascript
//return {"left":left, "right":right, "top":top, "bottom":bottom}
getTaskbarRect(): any;
```
- **返回：** 返回对象格式：`{"left":left, "right":right, "top":top, "bottom":bottom}`。

---


## getScreenRect
获取屏幕所在区域，该区域`不包含任务栏`。
```javascript
// return {"left":left, "right":right, "top":top, "bottom":bottom}
getScreenRect(): any;
```
- **返回：** 返回对象格式：`{"left":left, "right":right, "top":top, "bottom":bottom}`。

---

## getHWND
获取当前`html`所在的窗口的`HWND`句柄，句柄可以看成是一个`id`，用于区分不同窗口。
```javascript
getHWND(): HWND; // Get the HWND of current window
```
- **返回：** `HWND`类型，即整数类型，代表当前窗口的句柄。

---

## getMainHWND
获取主窗口的`HWND`句柄，句柄可以看成是一个`id`，用于区分不同窗口。
```javascript
// Get the HWND of main window
getMainHWND(): HWND;
```

- **返回：** `HWND`类型，即整数类型，代表主窗口的句柄。

---

## createWin

创建子窗口

```javascript
//default=>  x=-1 (center), y=-1 (center), title="", borderless=false, borderWidth=1, bgColor="#F0F0F0"
createWin(entry: string, width: number, height: number, x?: number, y?: number,
            title?: string, borderless?: boolean, borderWidth?: number, bgColor?: string): HWND;
```
- **entry：** 字符串类型，传入用于渲染的`html`文件路径，推荐用相对路径。
- **width：** 整数类型，表示创建的子窗口的`宽度`。
- **height：** 整数类型，表示创建的子窗口的`高度`。
- **x：** 整数类型，表示创建的子窗口的`x坐标`，默认为`-1`表示居中。
- **y：** 整数类型，表示创建的子窗口的`y坐标`，默认为`-1`表示居中。
- **title：** 字符串类型，表示创建的子窗口的`标题`。
- **borderless：** `boolean`类型，表示创建的子窗口是否是无边框，默认为`false`。
- **borderWidth：** 整数类型，表示创建的子窗口的`边框宽度`，只有`borderless`为`true`时生效。
- **bgColor：** 字符串类型，表示创建的子窗口背景色，默认为`#F0F0F0`。
- **返回：** `HWND`类型，表示创建的子窗口句柄。

---

## destroyWin
销毁指定窗口，通过`hwnd`句柄指定窗口。
```javascript
destroyWin(hwnd: number): void;
```
- **hwnd：** `HWND`类型，表示销毁的窗口的句柄。
- **返回：** 无。

---


## postWinMsg
向指定窗口发送数据。
```javascript
postWinMsg(toHWND: HWND, data: any): void;
```
- **toHWND：** `HWND`类型，表示接受数据的窗口的句柄。
- **data：** 任意能被JSON字符串化的数据，该数据会被传递给指定窗口。
- **返回：** 无。

---

## addWinMsgListener
添加监听器，用于监听其他窗口传递到当前窗口的数据
```javascript
addWinMsgListener(cb: (data: any) => void): void;
```
- **cb：** 回调函数，当有其他窗口向当前窗口发送数据时会触发该函数回调。
- **返回：** 无。
---

