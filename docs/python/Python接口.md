# Python接口
----

## initPython
初始化`python`虚拟机，将`python`虚拟机相关环境加载好。执行任何`python`脚本或文件之前，必须先执行`initPython`初始化。
> 需要注意的是，加载指定的`python`版本虚拟机之前，需要安装好`python`环境，即调用`installPython`函数。

```javascript
initPython(version:string):boolean
```
- **version：** 字符串类型，`python`版本。注意格式是由`3个数值`通过`2个点`连接组成，例如：`3.12.9`。
- **返回：** `boolean`类型，`python`环境是否加载成功。
----

## deinitPython
回收`python`虚拟机环境，将`python`虚拟机相关库等从内存释放。
> 执行该函数后，将无法再继续执行`python`相关脚本，只能重新执行`initPython`初始化才能执行`python`脚本。

```javascript
deinitPython():void
```
- **返回：**  无。
----

## runPythonScript

通过字符串构造python脚本，并运行该脚本。

```javascript
runPythonScript(script:string):int
```
- **script：** 字符串类型，`python`脚本内容。
- **返回：** `int`类型，`0`表示执行成功，否则，表示失败。

示例：
```javascirpt
Native.initPython("3.12.2");
Native.runPythonScript(`print('hello Python !')`);
```
执行如上代码后，控制台会输出：`hello Python !`。


----

## runPythonFile

运行指定的`python`文件。

```javascript
runPythonFile(filePath:string):int
```
- **script：** 字符串类型，`python`文件路径。
- **返回：** `int`类型，`0`表示执行成功，否则，表示失败。

示例：
```javascirpt
Native.initPython("3.12.2");
Native.runPythonFile(Native.getWorkspace() + '\\py\\main.py');
```

----

## addPythonMsgListener
在`js`中可以通过`addPythonMsgListener`获取来自`Python`发送的消息.
```javascript
addPythonMsgListener(cb: (data:any)=>void):void
```
- **cb：** 回调函数。当`Python`发送一条数据时，通过回调函数传回到`js`中。
- **返回：** 无。

----

## python调用js: post_msg
`post_msg`函数是`LightCode`提供的`python`库函数，用于向`js`发送数据，使用方式如下：

在`python`代码中：
```python
import lightcode

data = "data from python!"
lightcode.post_msg(data)
```
在`web js`代码中：
```javascript
Native.addPythonMsgListener(function(data){
    console.log(data)
})
```
可以看到，在控制台中会输出：
```
data from python!
```