/* ========================================================================
 *  weso_msg_dll —— DLL -> JS 消息通道示例 DLL
 *
 *  导出函数:
 *    Weso_SetHostAPI(post_msg) -> void  host 注入函数指针(只调一次)
 *    start()                   -> int   启动后台线程, 每秒 post 一条 JSON, 返回 1
 *    stop()                    -> void  停止后台线程
 *
 *  编译 (x64, 需在 Visual Studio 的 x64 Native Tools 命令行里):
 *      cl /LD weso_msg_dll.c /Fe:weso_msg_dll.dll
 *
 *  调用 (JS, 配合 code/cpp/msg/basic.js):
 *      var dll = new W.Dll(W.getRes("weso_msg_dll.dll"));
 *      await dll.addMsgListener(function (msg) { console.log(msg); });
 *      await dll.invoke("start", "i", []);
 *      ... 此时 cb 每秒收到 {event:"tick", n:N}
 *      await dll.invoke("stop", "v", []);
 *      dll.free();
 * ======================================================================== */

#include <windows.h>
#include <stdio.h>

/* host 注入的 post_msg 函数指针。调它即可把 JSON 字符串推回 JS。 */
typedef void (*WesoPostMsgFn)(const char* json);
static volatile WesoPostMsgFn g_post = NULL;

static volatile LONG  g_running = 0;
static HANDLE         g_thread  = NULL;

/* host 注入入口。host 调一次把 post_msg 函数指针塞进来, 存下即可。 */
__declspec(dllexport) void __cdecl Weso_SetHostAPI(WesoPostMsgFn post_msg)
{
    g_post = post_msg;
}

/* 后台线程: 每秒拼一条 JSON tick 消息推回 JS。 */
static DWORD WINAPI msg_thread(LPVOID arg)
{
    (void)arg;
    int tick = 0;
    char buf[128];
    while (InterlockedCompareExchange(&g_running, 1, 1) == 1)
    {
        tick++;
        sprintf_s(buf, sizeof(buf), "{\"event\":\"tick\",\"n\":%d}", tick);
        WesoPostMsgFn post = g_post;
        if (post) post(buf);
        Sleep(1000);
    }
    return 0;
}

/* 启动后台线程。返回 1=新启动, 0=已在运行。proto 'i'。 */
__declspec(dllexport) int __cdecl start(void)
{
    if (InterlockedCompareExchange(&g_running, 1, 0) != 0)
        return 0;
    g_thread = CreateThread(NULL, 0, msg_thread, NULL, 0, NULL);
    if (!g_thread)
    {
        g_running = 0;
        return 0;
    }
    return 1;
}

/* 停止后台线程并 join。proto 'v'。未启动时调用安全。 */
__declspec(dllexport) void __cdecl stop(void)
{
    if (InterlockedExchange(&g_running, 0) == 0)
        return;
    if (g_thread)
    {
        WaitForSingleObject(g_thread, 2000);
        CloseHandle(g_thread);
        g_thread = NULL;
    }
}

BOOL WINAPI DllMain(HINSTANCE hinst, DWORD reason, LPVOID reserved)
{
    (void)hinst;
    if (reason == DLL_PROCESS_DETACH)
    {
        if (reserved == NULL)
        {
            /* FreeLibrary 主动卸载: 安全 join */
            stop();
        }
        else
        {
            /* 进程退出: 其他线程可能已死, 不能 join, 只发停止信号 */
            g_running = 0;
        }
    }
    return TRUE;
}
