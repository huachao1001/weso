export type FileEncoding = 'binary' | 'utf8' | 'utf-8' | 'base64';

export type ProtoType =
    | 'void' | 'int' | 'uint' | 'long' | 'ulong' | 'short' | 'ushort'
    | 'char' | 'uchar' | 'byte' | 'float' | 'double'
    | 'pointer' | 'ptr' | 'string';

export type DllProto = string | { ret?: ProtoType | string; params?: (ProtoType | string)[] };

export interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface KeyboardEvent {
    type: 'keydown' | 'keyup';
    code: number;
}

export interface MouseEvent {
    type: 'move' | 'down' | 'up' | 'scroll';
    extra: string | number;
    x: number;
    y: number;
}

export interface WesoError {
    Code: Record<number, string>;
    check(code: number, extra?: string | null): boolean;
}

export interface InstallPythonOpts {
    version: string;
    pythonProxy?: string;
    pyDir?: string;
    force?: boolean;
}

export declare const WinMode: {
    readonly Windowed: 0;
    readonly WindowedNoTaskbar: 1;
    readonly Borderless: 2;
    readonly BorderlessNoTaskbar: 3;
};

export type WinModeValue = 0 | 1 | 2 | 3;

export declare class Dll {
    handle: number;
    constructor(path?: string);
    addr(func: string): number;
    call(func: string, proto: DllProto, args?: unknown[]): Promise<unknown>;
    callAddr(addr: number, proto: DllProto, args?: unknown[]): Promise<unknown>;
    invoke(func: string, proto: DllProto, args?: unknown[]): Promise<unknown>;
    free(): void;
    dispose(): void;
}

export interface Weso {
    readFile(args: { path: string; encoding?: 'binary' }): Promise<Uint8Array>;
    readFile(args: { path: string; encoding?: 'base64' }): Promise<string>;
    readFile(args: { path: string; encoding?: 'utf8' | 'utf-8' }): Promise<string>;
    readFile(args: { path: string; encoding?: FileEncoding }): Promise<string | Uint8Array>;
    readLines(args: { path: string }): Promise<string[]>;
    writeFile(args: { path: string; data: string | ArrayBuffer | Uint8Array | number[]; encoding?: FileEncoding; offset?: number }): Promise<boolean>;
    listdir(args: string | { path: string; filter?: number }): Promise<string[]>;
    mkdirs(args: string | { path: string }): boolean;
    exists(args: string | { path: string }): boolean;
    rename(args: { path: string; newName: string }): boolean;
    delPath(args: string | { path: string }): boolean;
    createFile(args: string | { path: string }): boolean;
    openInExplorer(args: string | { path: string }): unknown;
    openFileSelector(args: { path?: string; multiSelect?: boolean; onlyFolder?: boolean } | string): Promise<string[]>;
    /** 工作区根路径。debug=开发工程根目录; release=安装路径(=exe所在目录)。 */
    getWorkspace(): string;
    /** exe 所在目录。debug=开发工程根目录; release=安装路径。res/python 在此目录旁。 */
    getExeFolder(): string;
    /** res 资源目录绝对路径。 */
    getResFolder(): string;
    /** LocalAppData 路径。 */
    getLocalFolder(): string;
    /** RoamingAppData 路径。 */
    getRoamingFolder(): string;
    /** 系统临时目录路径。 */
    getTempFolder(): string;
    /** 从加密资产包读取内容(path 相对 src/)。 */
    getAssets(args: { path: string; encoding?: 'utf8' | 'base64' }): Promise<string>;
    /** 将 res 目录下的相对路径解析为绝对磁盘路径。 */
    getRes(args: string | { path: string }): string;

    /** 弹出系统消息框。 */
    alert(msg: string | { msg: string }): unknown;
    /** 异步执行系统命令 (NativeWorker 线程, 不阻塞 UI); resolve 返回 stdout+stderr 合并输出。 */
    system(cmd: string | { cmd: string }): Promise<string>;
    /** 取环境变量。 */
    getEnv(name: { name: string }): unknown;
    /** 设置环境变量; append=true 时追加。 */
    setEnv(args: { name: string; val: string; append?: boolean }): unknown;
    /** 捕获 native stdout/stderr 转给 cb; 不传 cb 则关闭并移除监听。 */
    captureConsoleOutput(cb?: (output: string, isStdOut: boolean) => void): void;
    exitApp(): void;
    openDevTools(): void;

    /** 一次性调用 DLL 导出(内部自动加载/释放)。 */
    invokeDll(params: { dll: string; func: string; proto: DllProto; args?: unknown[] }): Promise<unknown>;
    /** 加载 DLL, 返回模块句柄(0 表示失败)。需配对 freeDll。 */
    loadDll(path: string): number;
    /** 释放 DLL。对 0 句柄幂等。 */
    freeDll(handle: number): boolean;
    /** 查找导出函数地址(0 表示失败)。 */
    getProcAddr(handle: number, func: string): number;
    /** 按模块句柄 + 导出名调用。 */
    invokeByHandle(params: { handle: number; func: string; proto: DllProto; args?: unknown[] }): Promise<unknown>;
    /** 按函数地址调用。 */
    invokeByAddr(params: { addr: number; proto: DllProto; args?: unknown[] }): Promise<unknown>;
    /** DLL 封装类构造器。 */
    Dll: typeof Dll;

    /** 窗口样式枚举: 边框状态 × 任务栏可见性。 */
    WinMode: typeof WinMode;
    createWin(args: {
        entry: string;
        width: number;
        height: number;
        x?: number;
        y?: number;
        title?: string;
        mode?: WinModeValue;
        bgColor?: string;
        /** 创建即透明: 创建时传 WS_EX_NOREDIRECTIONBITMAP, 透明像素直显桌面。
         *  真透明窗口必须创建时指定此选项 (运行时 setTransparent 无法补上)。
         *  配合页面 html/body 无背景 + setTransparent 切 webview alpha。 */
        transparent?: boolean;
    }): unknown;
    destroyWin(hwnd: number): void;
    /** 当前窗口是否无边框样式。 */
    isBorderless(): boolean;
    /** 当前窗口模式, 与 WinMode 一一对应。 */
    getWinMode(): WinModeValue;
    showWindow(): void;
    hideWindow(): void;
    minWindow(): void;
    maxWindow(): void;
    normWindow(): void;
    isWindowMaximized(): boolean;
    isWindowVisible(): boolean;
    getMainHWND(): number;
    getHWND(): number;
    getTaskbarRect(): Rect;
    getScreenRect(): Rect;
    /** 绑定拖拽移动窗口; 双击触发 onDlbClick。 */
    bindDragWin(obj: HTMLElement, onDlbClick?: ((x: number, y: number) => void) | null): void;
    /** 拦截关闭按钮, 点击时回调 listener。 */
    setOnClickCloseIconListener(listener: () => void): void;
    /** 显示托盘图标及菜单, 菜单项点击回调 cb(key)。 */
    showTray(icon: string, title: string, items: Map<number, string>, cb: (key: number) => void): void;

    /**
     * 启用/关闭目标窗口的真透明背景。
     * - webview 与原生窗口背景一并置透明, 页面任意 transparent 区域直接显示桌面。
     * - 重要: 想让透明像素显示桌面, 窗口必须用 createWin({transparent:true}) 创建
     *   (WS_EX_NOREDIRECTIONBITMAP 只在创建时生效)。本接口仅切换 webview alpha;
     *   对非"创建即透明"的窗口调用, 透明像素会露出窗口 #F0F0F0 背景, 不是桌面。
     * - enable 为开关; hwnd 缺省作用于调用方窗口, 传入则作用于指定子窗口。
     */
    setTransparent(enable: boolean, hwnd?: number): void;
    /**
     * 启用/关闭鼠标点击穿透(透形窗口常用)。
     * - enable=true 时该窗口只显示不响应任何鼠标事件, 适合只观赏的桌面挂件。
     * - hwnd 缺省作用于调用方窗口, 传入则作用于指定子窗口。
     */
    setClickThrough(enable: boolean, hwnd?: number): void;
    /**
     * 启用/关闭始终置顶(topmost)。
     * - enable=true 时窗口浮在所有非 topmost 窗口之上, 全屏窗口也盖不住。
     * - hwnd 缺省作用于调用方窗口, 传入则作用于指定子窗口。
     */
    setAlwaysOnTop(enable: boolean, hwnd?: number): void;
    /**
     * 显式控制原生 aero 投影阴影(仅无边框窗口生效; 有边框窗口阴影由系统标题栏管理)。
     * - 覆盖 setTransparent 的默认联动(透明->关阴影, 不透明->开阴影);
     *   想强制特定阴影状态时, 在 setTransparent 之后调用本接口。
     * - hwnd 缺省作用于调用方窗口, 传入则作用于指定子窗口。
     */
    setShadow(enable: boolean, hwnd?: number): void;

    /** 注册键盘钩子, 事件经 cb 回调。 */
    hookKeyboard(cb: (e: KeyboardEvent) => void): void;
    unhookKeyboard(): void;
    /** 注册鼠标钩子, 事件经 cb 回调。 */
    hookMouse(cb: (e: MouseEvent) => void): void;
    unhookMouse(): void;

    initPython(version: string, pyDir?: string): Promise<boolean>;
    deinitPython(): Promise<void>;
    /** 运行 Python 脚本, 返回退出码(0=成功)。 */
    runPythonScript(script: string): Promise<number>;
    /** 运行 Python 文件, 返回退出码(0=成功)。 */
    runPythonFile(filePath: string): Promise<number>;
    installPython(opts: InstallPythonOpts): Promise<boolean>;
    isPythonInstalled(version: string): Promise<boolean>;
    addPythonMsgListener(listener: (msg: unknown) => void): void;
    removePythonMsgListener(listener: (msg: unknown) => void): void;

    /** 向目标窗口发送 Windows 消息。 */
    postWinMsg(toHWND: number, data: unknown): unknown;
    addWinMsgListener(cb: (data: unknown) => void): void;
    /** 监听文件拖拽到窗口。 */
    addFileDragListener(cb: (path: string, isDir: boolean) => void): void;
    /** 注册 native 消息监听(type 为消息类型字符串)。 */
    addNativeMsgListener(type: string, cb: (data: unknown) => void): void;
}

declare global {
    interface Window {
        weso: Weso;
        W: Weso;
    }
    const weso: Weso;
    const W: Weso;
}
