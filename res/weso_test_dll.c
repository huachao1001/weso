/* ========================================================================
 *  weso_test_dll —— weso JS 调用 DLL API 的测试用 DLL
 *
 *  编译(x64):
 *      cl /LD weso_test_dll.c /Fe:weso_test_dll.dll
 *  或带 vcvars64:
 *      "...\VC\Auxiliary\Build\vcvars64.bat" && cl /LD weso_test_dll.c /Fe:weso_test_dll.dll
 *
 *  导出函数刻意覆盖 weso proto 支持的各种类型, 给 example 里的 demo
 *  (loadFree.js / dllClass.js)当靶子。所有导出用 __cdecl(x64 下名字不修饰,
 *  可直接按导出名查找)。
 *
 *  proto 类型代码:
 *    v void   i int   u uint   l long   L ulong   f float   d double   p pointer
 *    s short  S ushort  c schar  b uchar
 *
 *    add         (int,int)         -> int        proto 'iii'
 *    add4        (int,int,int,int) -> int        proto 'iiiii'
 *    addf        (float,float)     -> float      proto 'fff'
 *    addd        (double,double)   -> double     proto 'ddd'
 *    add_u       (uint,uint)       -> uint       proto 'uuu'
 *    add_s       (short,short)     -> short      proto 'sss'
 *    add_S       (ushort,ushort)   -> ushort     proto 'SSS'
 *    byte_and    (uchar,uchar)     -> uchar      proto 'bbb'
 *    add_mixed   (int,double,int,double) -> double  proto 'idid'  (混型参数, 验证不同类型交错传递)
 *    strlen_ptr  (string)          -> int        proto 'ip'   (返回字符串长度)
 *    first_char  (string)          -> int        proto 'ip'   (读字符串内容, 返回首字符码点)
 *    greet       ()                -> string     proto 'p'    (返回静态串指针, JS 拿到地址后可喂回 strlen_ptr)
 *    echo_ptr    (void*)           -> void*      proto 'pp'   (指针原样回传)
 *    ptr_size    ()                -> int        proto 'i'     (x64 应为 8)
 *    next_counter()                -> int        proto 'i'    (有状态)
 *    reset_counter()               -> void       proto 'v'    (有状态)
 *
 *  字符串说明: JS 侧 proto 用 'p', 传 JS string 即当作字符串处理。
 *  DLL 侧形参统一用 wchar_t*(weso 的字符串约定类型), JS 侧无需关心。
 * ======================================================================== */

#include <windows.h>
#include <string.h>

/* 整数加法: 最朴素的 int 返回 + 两个 int 入参。proto 'iii'。 */
__declspec(dllexport) int __cdecl add(int a, int b)
{
    return a + b;
}

/* 四入参整数加法: 验证多参数传递。proto 'iiiii'。 */
__declspec(dllexport) int __cdecl add4(int a, int b, int c, int d)
{
    return a + b + c + d;
}

/* 单精度浮点加法: proto 'fff'。 */
__declspec(dllexport) float __cdecl addf(float a, float b)
{
    return a + b;
}

/* 双精度浮点加法: proto 'ddd'。 */
__declspec(dllexport) double __cdecl addd(double a, double b)
{
    return a + b;
}

/* unsigned int 加法: proto 'uuu'。JS 传两个 >INT_MAX 的数验证无符号处理
 * (3000000000+1000000000=4000000000 仍 < UINT_MAX=4294967295)。 */
__declspec(dllexport) unsigned int __cdecl add_u(unsigned int a, unsigned int b)
{
    return a + b;
}

/* short 加法: proto 'sss'。2 字节有符号整型。1000+2000=3000 < SHRT_MAX。 */
__declspec(dllexport) short __cdecl add_s(short a, short b)
{
    return (short)(a + b);
}

/* unsigned short 加法: proto 'SSS'。2 字节无符号。40000+20000=60000 < USHRT_MAX。 */
__declspec(dllexport) unsigned short __cdecl add_S(unsigned short a, unsigned short b)
{
    return (unsigned short)(a + b);
}

/* uchar 按位与: proto 'bbb'。1 字节无符号。JS 传数字(0xAB & 0x0F=0x0B=11)。 */
__declspec(dllexport) unsigned char __cdecl byte_and(unsigned char a, unsigned char b)
{
    return (unsigned char)(a & b);
}

/* 混型参数加法: proto 'idid'。int 与 double 交错, 验证不同类型交错传递时
 * 各参数能正确对齐(别名: a/b 是 int, c/d 是 double, 注意顺序)。
 * 10 + 1.5 + 20 + 2.5 = 34.0, 任何参数错位都会得到明显不同的数。 */
__declspec(dllexport) double __cdecl add_mixed(int a, double c, int b, double d)
{
    return (double)a + c + (double)b + d;
}

/* 字符串长度: proto 'ip'。JS 传 string 即按字符串处理, 这里返回字符数。 */
__declspec(dllexport) int __cdecl strlen_ptr(const wchar_t* s)
{
    if (!s) return 0;
    return (int)wcslen(s);
}

/* 取首字符码点: proto 'ip'。和 strlen_ptr 同形参, 但返回 s[0] 而非长度,
 * 用来证明 DLL 能读到 JS 传来的字符串内容(不只是指针本身), 例如传 "ABC"
 * 应返回 65('A')。空串或 NULL 返回 0。 */
__declspec(dllexport) int __cdecl first_char(const wchar_t* s)
{
    if (!s || !*s) return 0;
    return (int)s[0];
}

/* 返回静态字符串指针: proto 'p'。内容固定 "Hello, weso!"(12 字符)。
 * JS 拿到的是地址(number), 不能直接读到串内容(指针返回只给出地址,
 * 不解码字符串)。但可把该地址再喂回 strlen_ptr / first_char 验证:
 * 链式调用证明 DLL 返回的指针在 JS 里能当作 number 流转, 再作为入参传回去。
 *
 * 静态存储: 模块存活期间指针稳定且常量, 多次调用 greet 返回同一地址。 */
__declspec(dllexport) const wchar_t* __cdecl greet(void)
{
    static const wchar_t s[] = L"Hello, weso!";
    return s;
}

/* 指针原样回传: proto 'pp'。JS 传一个数字当指针(地址), native 原样回传,
 * JS 拿到的 number 应与传入一致。验证 64 位指针往返不被截断。 */
__declspec(dllexport) void* __cdecl echo_ptr(void* p)
{
    return p;
}

/* 返回 sizeof(void*): x64 上应为 8, x86 上为 4。demo 里用来确认
 * 当前 weso 进程的位宽, 提醒用户传指针时用 number 装得下。 */
__declspec(dllexport) int __cdecl ptr_size(void)
{
    return (int)sizeof(void*);
}

/* ---- 有状态导出: 用来证明 loadDll 得到的句柄跨调用保持模块状态 ----
 * next_counter 每次调用自增并返回新值。如果 JS 用同一个 Dll 实例连调三次,
 * 应得 1,2,3 —— 说明模块始终保持着加载状态, 静态变量存活。
 * reset_counter 清零。proto 分别为 'i' / 'v'。 */
static int g_counter = 0;

__declspec(dllexport) int __cdecl next_counter(void)
{
    return ++g_counter;
}

__declspec(dllexport) void __cdecl reset_counter(void)
{
    g_counter = 0;
}

/* DllMain: 只为在调试器里能看到加载/卸载时机。返回 TRUE 即可。 */
BOOL WINAPI DllMain(HINSTANCE hinst, DWORD reason, LPVOID reserved)
{
    (void)hinst; (void)reserved;
    switch (reason)
    {
    case DLL_PROCESS_ATTACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
