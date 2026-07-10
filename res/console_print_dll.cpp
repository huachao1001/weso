/* ========================================================================
 *  console_print_dll —— 供 captureConsoleOutput 示例用的测试 DLL
 *
 *  导出两个函数:
 *    start_print() -> int   启动后台线程, 每秒往 std::cout / std::cerr 打印
 *    stop_print()  -> void  停止后台线程
 *
 *  JS 侧用 W.Dll 加载后 invoke 这两个导出, native 的 captureConsoleOutput
 *  即可捕获到本 DLL 打印的内容, 演示 "DLL 往 std::cout 写 -> 宿主劫持的
 *  streambuf 转发 -> 主窗口 cb 收到文本" 的完整链路。
 *
 *  关键编译要求:
 *    DLL 的动态 CRT 配置必须和宿主 weso.exe 完全一致, 否则两边拿到的是不同
 *    CRT 实例、不同的 std::cout 对象, 宿主在启动时做的 rdbuf 劫持拦不到 DLL
 *    的写入, 捕获会静默失败。具体对应关系:
 *      宿主 Debug   (/MDd) -> DLL 也必须 /MDd, 共享 MSVCP140D.dll 的 cout
 *      宿主 Release (/MD)  -> DLL 也必须 /MD,  共享 MSVCP140.dll  的 cout
 *    切不可 /MD 和 /MDd 混用 —— 即使都是动态 CRT, MSVCP140.dll 和
 *    MSVCP140D.dll 是两个独立 DLL, 各自有独立 std::cout。也不要用 /MT 或 /MTd
 *    (静态 CRT), DLL 会有完全独立的 cout, 同样拦不到。
 *    宿主当前是 Debug 构建, 所以下面编译命令用 /MDd。
 *
 *  编译 (x64, 需在 Visual Studio 的 x64 Native Tools 命令行里):
 *     宿主 Debug  版: cl /LD /MDd /EHsc console_print_dll.cpp /Fe:console_print_dll.dll
 *     宿主 Release 版: cl /LD /MD  /EHsc console_print_dll.cpp /Fe:console_print_dll.dll
 *
 *  调用 (JS):
 *      var d = new W.Dll("...\\console_print_dll.dll");
 *      d.invoke("start_print", "i", []);   // 启动后台打印
 *      ...
 *      d.invoke("stop_print",  "v", []);   // 停止
 *      d.free();
 *
 *  线程安全:
 *    start_print 用 compare_exchange_strong 防重入, 多次调用只启动一次。
 *    DllMain 收到 DLL_PROCESS_DETACH 时, 若是 FreeLibrary 主动卸载(reserved
 *    == NULL) 会 join 线程; 若是进程退出(reserved != NULL) 仅置 flag 不 join
 *    (此时其他线程可能已被强行终止, join 会死锁)。
 * ======================================================================== */

#include <windows.h>
#include <atomic>
#include <chrono>
#include <iostream>
#include <thread>

static std::atomic<bool> g_running{ false };
static std::thread       g_thread;

/* 启动后台打印线程。返回 1 表示新启动, 0 表示已在运行(忽略)。proto 'i'。 */
extern "C" __declspec(dllexport) int __cdecl start_print(void)
{
    bool expected = false;
    if (!g_running.compare_exchange_strong(expected, true))
        return 0;
    g_thread = std::thread([]
    {
        int tick = 0;
        while (g_running.load(std::memory_order_relaxed))
        {
            // std::endl 会 flush, capturer 遇到 '\n' 即把缓冲区整行 post 出去
            std::cout << "[dll cout] tick " << ++tick << std::endl;

            // 每 5 次往 cerr 打一条, 演示 stderr 路径 (isStdOut=false)
            if (tick % 5 == 0)
                std::cerr << "[dll cerr] checkpoint at tick " << tick << std::endl;

            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    });
    return 1;
}

/* 停止后台打印线程并 join。proto 'v'。未启动时调用安全。 */
extern "C" __declspec(dllexport) void __cdecl stop_print(void)
{
    g_running.store(false, std::memory_order_relaxed);
    if (g_thread.joinable()) g_thread.join();
}

BOOL WINAPI DllMain(HINSTANCE hinst, DWORD reason, LPVOID reserved)
{
    (void)hinst;
    if (reason == DLL_PROCESS_DETACH)
    {
        if (reserved == NULL)
        {
            // FreeLibrary 主动卸载: 可以安全 join
            stop_print();
        }
        else
        {
            // 进程退出: 其他线程可能已死, 不能 join, 只发停止信号
            g_running.store(false, std::memory_order_relaxed);
        }
    }
    return TRUE;
}
