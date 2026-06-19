如果是以typescript开发，可以创建`global.d.ts`,目前最新的接口如下：
```javascript

export { };

declare enum FileDirFilter {
    None = 0,
    OnlyFile = 1,
    OnlyDir = 2
}
type Integer = number;
interface NativeInterface {

    openDevTools(): void;
    bindDragWin(obj: HTMLElement): void;
    readFile(path: string): string;
    writeFile(path: string, content: string): boolean;
    system(cmd: string): string;
    addSysPath(path: string): void;
    alert(msg: string);

    getAppRoot(): string;
    getExeDir(): string;

    invokeDll(dllFileName: string, funcName: string, proto: string, ...args): any;
    addNativeMsgListener(type: string, cb: Function);

    addFileDragListener(cb: Function);

    //append: default is false
    setEnv(name: string, val: string, append?: boolean): void;
    //default filter is None
    listdir(dir: string, filter?: FileDirFilter): string[];
    mkdirs(dirpath: string): boolean;
    exists(path: string): boolean;
    openInExplorer(path: string): boolean;
    rename(path: string, newName: string): boolean;
    delPath(path: string): boolean;
    createFile(path: string): boolean;
    exitApp();
    showTray(iconPath: string, title: string, items: Map<Integer, string>, callback: (data: any) => void): void;
    //default:defaultDirPath="", multiSelect=true, onlyFolder=false
    openFileSelector(defaultDirPath?: string, multiSelect?: boolean, onlyFolder?: boolean):string[];

    showWindow(): void;
    hideWindow(): void;
    minWindow(): void;
    maxWindow(): void;
    normWindow(): void;
    isWindowMaximized(): boolean;
    isWindowVisible(): boolean;
    hookKeyboard(callback: (data: any) => void);
    hookMouse(callback: (data: any) => void);

    setOnClickCloseIconListener(listener: () => void): void;

    captureConsoleOutput(cb: (output: string, isStdOut: boolean) => void);
    initPython(ver: string): void;
    runPythonFile(path: string): void;
    getWorkspace(): string;

    getTaskbarRect(): any;//return {"left":left, "right":right, "top":top, "bottom":bottom}
    getScreenRect(): any;// return {"left":left, "right":right, "top":top, "bottom":bottom}

    getHWND(): HWND; // Get the HWND of current window
    getMainHWND(): HWND; // Get the HWND of main window

    //default=>  x=-1 (center), y=-1 (center), title="", borderless=false, borderWidth=1, bgColor="#F0F0F0"
    createWin(entry: string, width: number, height: number, x?: number, y?: number,
                title?: string, borderless?: boolean, borderWidth?: number, bgColor?: string): HWND;//return HWND
    destroyWin(hwnd: number): void;//
    postWinMsg(toHWND: HWND, data: any): void;
    addWinMsgListener(cb: (data: any) => void): void;

}
declare global {
    interface Window {
        Native: NativeInterface;
    }
}

```