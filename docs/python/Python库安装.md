# Python库安装

## Python Runtime安装
首先需要确保完成`Python`运行时安装。在项目的的`project.json`中指定`python`版本。细节可以参考[Python快速开始](python/Python快速开始?id=python环境准备)来安装好`Python`版本。

如果是第一次开发LightCode项目，可以直接利用`debug`模式自动创建`project.json`，即通过`-d`参数。
```bash
LightCode.exe -d
```
执行上面命令，默认在当前路径下创建`LightCode`项目，并且会回自动创建`project.json`.

如果希望在指定路径创建项目，则通过`-w`参数指定：
```bash
LightCode.exe -d -w C:\path\to\your\project
```

## 安装Python库
安装Python库非常简单，就像使用`pip`一样，只需通过`-i`参数来控制。其实，确实是对`pip`的封装，因此需要先安装`pip`。
```bash
LightCode.exe -i pip
```
完成`pip`安装后，接下来可以安装任意库了，以`numpy`为例：
```
LightCode.exe -i numpy
```
也可以通过`requirements.txt`文件来列出所有的库，并通过`-r`来安装：
```
LightCode.exe -r requrements.txt
```

> 注意，如果不指定`-w`, 以上命令都是默认以当前所在的目录作为`project`跟路径，即会从当前目录寻找`project.json`，如果找不到会抛出异常。

安装完成后，可以从`.res/py3/<py_version>/Lib`下看到刚安装的库。