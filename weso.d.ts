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
    /** 工作区根路径。 */
    getWorkspace(): string;
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
    /** 执行系统命令, 返回输出。 */
    system(cmd: string | { cmd: string }): string;
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
