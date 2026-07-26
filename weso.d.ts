interface WesoError$1 {
    Code: Record<number, string>;
    check(code: number, extra?: string | null): boolean;
}

type InvokeFunc = (...args: unknown[]) => unknown;
interface NativeHost {
    native: Record<string, InvokeFunc>;
}
interface ChromeWebview {
    hostObjects: {
        sync: NativeHost;
        native: NativeHost;
    };
}
interface Chrome {
    webview: ChromeWebview;
}
declare global {
    interface Window {
        chrome: Chrome;
    }
}
declare function addNativeMsgListener(type: string | number, cb: (data: unknown) => void): void;

declare function readFile(args: {
    path: string;
    encoding?: 'binary';
}): Promise<Uint8Array>;
declare function readFile(args: {
    path: string;
    encoding?: 'base64';
}): Promise<string>;
declare function readFile(args: {
    path: string;
    encoding?: 'utf8' | 'utf-8';
}): Promise<string>;
declare function readFile(args: {
    path: string;
    encoding?: string;
}): Promise<string | Uint8Array>;
declare function readLines(path: string): Promise<string[]>;
type FileEncoding = 'binary' | 'utf8' | 'utf-8' | 'base64';
declare function writeFile(args: {
    path: string;
    data: string | ArrayBuffer | Uint8Array | number[];
    encoding?: FileEncoding;
    offset?: number;
}): Promise<boolean>;
declare function listdir(args: string | {
    path: string;
    filter?: number;
}): Promise<string[]>;
declare function mkdirs(args: string | {
    path: string;
}): boolean;
declare function exists(args: string | {
    path: string;
}): boolean;
declare function rename(args: {
    path: string;
    newName: string;
}): boolean;
declare function delPath(args: string | {
    path: string;
}): boolean;
declare function createFile(args: string | {
    path: string;
}): boolean;
declare function openInExplorer(args: string | {
    path: string;
}): unknown;
declare function openFileSelector(args: {
    path?: string;
    multiSelect?: boolean;
    onlyFolder?: boolean;
} | string): Promise<string[]>;
declare function getWorkspace(): string;
declare function getExeFolder(): string;
declare function getResFolder(): string;
declare function getLocalFolder(): string;
declare function getRoamingFolder(): string;
declare function getTempFolder(): string;
declare function getAssets(args: {
    path: string;
    encoding?: 'utf8' | 'base64';
}): Promise<string>;
declare function getRes(args: string | {
    path: string;
}): string;

declare function alert(msg: string | {
    msg: string;
}): unknown;
declare function system(cmd: string | {
    cmd: string;
}): Promise<string>;
declare function getEnv(name: {
    name: string;
}): unknown;
declare function setEnv(args: {
    name: string;
    val: string;
    append?: boolean;
}): unknown;
declare function captureConsoleOutput(cb?: (output: string, isStdOut: boolean) => void): void;
declare function exitApp(): void;
declare function openDevTools(): void;
declare function setAutoStart(enable: boolean): unknown;
declare function isAutoStart(): unknown;

declare function invokeDll(params: {
    dll: string;
    func: string;
    proto: string | {
        ret?: string;
        params?: string[];
    };
    args?: unknown[];
}): Promise<unknown>;
declare function loadDll(path: string): number;
declare function freeDll(handle: number): boolean;
declare function getProcAddr(handle: number, func: string): number;
declare function invokeByHandle(params: {
    handle: number;
    func: string;
    proto: string | {
        ret?: string;
        params?: string[];
    };
    args?: unknown[];
}): Promise<unknown>;
declare function invokeByAddr(params: {
    addr: number;
    proto: string | {
        ret?: string;
        params?: string[];
    };
    args?: unknown[];
}): Promise<unknown>;
declare class Dll {
    handle: number;
    private _path;
    private _cache;
    constructor(path?: string);
    addr(func: string): number;
    call(func: string, proto: string | {
        ret?: string;
        params?: string[];
    }, args?: unknown[]): Promise<unknown>;
    callAddr(addr: number, proto: string | {
        ret?: string;
        params?: string[];
    }, args?: unknown[]): Promise<unknown>;
    invoke(func: string, proto: string | {
        ret?: string;
        params?: string[];
    }, args?: unknown[]): Promise<unknown>;
    free(): void;
    dispose(): void;
}

declare const WinMode: {
    readonly Windowed: 0;
    readonly WindowedNoTaskbar: 1;
    readonly Borderless: 2;
    readonly BorderlessNoTaskbar: 3;
};
type WinModeValue = (typeof WinMode)[keyof typeof WinMode];
declare function createWin(args: {
    entry: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
    title?: string;
    mode?: WinModeValue;
    bgColor?: string;
    transparent?: boolean;
}): unknown;
declare function destroyWin(hwnd: number): void;
declare function isBorderless(): boolean;
declare function getWinMode(): WinModeValue;
declare function showWindow(): void;
declare function hideWindow(): void;
declare function minWindow(): void;
declare function maxWindow(): void;
declare function normWindow(): void;
declare function isWindowMaximized(): boolean;
declare function isWindowVisible(): boolean;
declare function getMainHWND(): number;
declare function getHWND(): number;
declare function getTaskbarRect(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
declare function getScreenRect(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
declare function setTransparent(enable: boolean, hwnd?: number): void;
declare function setClickThrough(enable: boolean, hwnd?: number): void;
declare function setAlwaysOnTop(enable: boolean, hwnd?: number): void;
declare function setShadow(enable: boolean, hwnd?: number): void;
declare function bindDragWin(obj: HTMLElement, onDlbClick?: ((x: number, y: number) => void) | null): void;
declare function setOnClickCloseIconListener(listener: () => void): void;
declare function showTray(icon: string, title: string, items: Map<number, string>, cb: (key: number) => void): void;

interface KeyboardEvent {
    type: "keydown" | "keyup";
    code: number;
}
interface MouseEvent {
    type: "move" | "down" | "up" | "scroll";
    /** "left" | "mid" | "right" for down/up; numeric delta for scroll; "" for move. */
    extra: string | number;
    x: number;
    y: number;
}
declare function hookKeyboard(cb: (e: KeyboardEvent) => void): void;
declare function unhookKeyboard(): void;
declare function hookMouse(cb: (e: MouseEvent) => void): void;
declare function unhookMouse(): void;

declare function initPython(version: string, pyDir?: string): Promise<boolean>;
declare function deinitPython(): Promise<void>;
declare function runPythonScript(script: string): Promise<number>;
declare function runPythonFile(filePath: string): Promise<number>;
interface InstallPythonOpts {
    version: string;
    pythonProxy?: string;
    pipProxy?: string;
    pyDir?: string;
    force?: boolean;
}
declare function installPython(opts: InstallPythonOpts): Promise<boolean>;
declare function isPythonInstalled(version: string): Promise<boolean>;
declare function addPythonMsgListener(listener: (msg: unknown) => void): void;
declare function removePythonMsgListener(listener: (msg: unknown) => void): void;

declare function postWinMsg(toHWND: number, data: unknown): unknown;
declare function addWinMsgListener(cb: (data: unknown) => void): void;

declare function addFileDragListener(cb: (path: string, isDir: boolean) => void): void;

interface ProcessFailedInfo {
    kind: number;
    reason: number;
    exitCode: number;
    recovered: boolean;
}
interface NavigationCompletedInfo {
    success: boolean;
    errorStatus: number;
}
declare function onProcessFailed(cb: (info: ProcessFailedInfo) => void): void;
declare function onNavigationCompleted(cb: (info: NavigationCompletedInfo) => void): void;
declare function onLastSessionCrashed(cb: () => void): void;
declare function removeProcessFailedListener(cb: (info: ProcessFailedInfo) => void): void;
declare function removeNavigationCompletedListener(cb: (info: NavigationCompletedInfo) => void): void;
declare function removeLastSessionCrashedListener(cb: () => void): void;

declare const WesoError: WesoError$1;
interface Weso {
    readFile: typeof readFile;
    readLines: typeof readLines;
    writeFile: typeof writeFile;
    listdir: typeof listdir;
    mkdirs: typeof mkdirs;
    exists: typeof exists;
    rename: typeof rename;
    delPath: typeof delPath;
    createFile: typeof createFile;
    openInExplorer: typeof openInExplorer;
    openFileSelector: typeof openFileSelector;
    getWorkspace: typeof getWorkspace;
    getExeFolder: typeof getExeFolder;
    getResFolder: typeof getResFolder;
    getLocalFolder: typeof getLocalFolder;
    getRoamingFolder: typeof getRoamingFolder;
    getTempFolder: typeof getTempFolder;
    getAssets: typeof getAssets;
    getRes: typeof getRes;
    alert: typeof alert;
    system: typeof system;
    getEnv: typeof getEnv;
    setEnv: typeof setEnv;
    setAutoStart: typeof setAutoStart;
    isAutoStart: typeof isAutoStart;
    captureConsoleOutput: typeof captureConsoleOutput;
    exitApp: typeof exitApp;
    invokeDll: typeof invokeDll;
    loadDll: typeof loadDll;
    freeDll: typeof freeDll;
    getProcAddr: typeof getProcAddr;
    invokeByHandle: typeof invokeByHandle;
    invokeByAddr: typeof invokeByAddr;
    Dll: typeof Dll;
    openDevTools: typeof openDevTools;
    createWin: typeof createWin;
    WinMode: typeof WinMode;
    destroyWin: typeof destroyWin;
    isBorderless: typeof isBorderless;
    getWinMode: typeof getWinMode;
    setTransparent: typeof setTransparent;
    setClickThrough: typeof setClickThrough;
    setAlwaysOnTop: typeof setAlwaysOnTop;
    setShadow: typeof setShadow;
    showWindow: typeof showWindow;
    hideWindow: typeof hideWindow;
    minWindow: typeof minWindow;
    maxWindow: typeof maxWindow;
    normWindow: typeof normWindow;
    isWindowMaximized: typeof isWindowMaximized;
    isWindowVisible: typeof isWindowVisible;
    getMainHWND: typeof getMainHWND;
    getHWND: typeof getHWND;
    getTaskbarRect: typeof getTaskbarRect;
    getScreenRect: typeof getScreenRect;
    bindDragWin: typeof bindDragWin;
    setOnClickCloseIconListener: typeof setOnClickCloseIconListener;
    showTray: typeof showTray;
    hookKeyboard: typeof hookKeyboard;
    unhookKeyboard: typeof unhookKeyboard;
    hookMouse: typeof hookMouse;
    unhookMouse: typeof unhookMouse;
    initPython: typeof initPython;
    deinitPython: typeof deinitPython;
    runPythonScript: typeof runPythonScript;
    runPythonFile: typeof runPythonFile;
    installPython: typeof installPython;
    isPythonInstalled: typeof isPythonInstalled;
    addPythonMsgListener: typeof addPythonMsgListener;
    removePythonMsgListener: typeof removePythonMsgListener;
    postWinMsg: typeof postWinMsg;
    addWinMsgListener: typeof addWinMsgListener;
    addFileDragListener: typeof addFileDragListener;
    addNativeMsgListener: typeof addNativeMsgListener;
    onProcessFailed: typeof onProcessFailed;
    removeProcessFailedListener: typeof removeProcessFailedListener;
    onNavigationCompleted: typeof onNavigationCompleted;
    removeNavigationCompletedListener: typeof removeNavigationCompletedListener;
    onLastSessionCrashed: typeof onLastSessionCrashed;
    removeLastSessionCrashedListener: typeof removeLastSessionCrashedListener;
}
declare const weso: Weso;
declare function initWeso(): void;

export { WesoError, addNativeMsgListener, weso as default, initWeso, weso };
export type { KeyboardEvent, MouseEvent };
