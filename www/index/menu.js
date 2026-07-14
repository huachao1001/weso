var menuConfig = {
    modules: [
        { id: 'system', icon: '⚙️', name: '系统' },
        { id: 'file', icon: '📁', name: '文件' },
        { id: 'window', icon: '🪟', name: '窗口' },
        { id: 'cpp', icon: '➕', name: 'C++' },
        { id: 'python', icon: '🐍', name: 'Python' }
    ],
    system: [
        { script: 'code/system/alert.js', title: '系统弹窗' },
        { script: 'code/system/system.js', title: '执行系统命令' },
        { script: 'code/system/env.js', title: '环境变量' },
        { script: 'code/system/console_output.js', title: '捕获控制台输出' },
        { script: 'code/system/openDevTools.js', title: '开发者工具' },
        { script: 'code/system/exitApp.js', title: '退出应用' }
    ],
    file: {
        readwrite: {
            name: '读写文件',
            items: [
                { script: 'code/file/read_write/create.js', title: '创建空文件' },
                { script: 'code/file/read_write/utf8.js', title: '文本文件' },
                { script: 'code/file/read_write/readLines.js', title: '多行读取' },
                { script: 'code/file/read_write/binary.js', title: '二进制' },
                { script: 'code/file/read_write/base64.js', title: 'base64' },
            ]
        },
        dir: {
            name: '目录相关',
            items: [
                { script: 'code/file/dir/mkdir.js', title: '创建目录' },
                { script: 'code/file/dir/listdir.js', title: '列出目录' },
                { script: 'code/file/dir/openInExplorer.js', title: '文件管理器显示' },
                { script: 'code/file/dir/openFileSelector.js', title: '选取文件窗口' }
            ]
        },
        drag: {
            name: '文件拖拽',
            items: [
                { script: 'code/file/drag/file_drag.js', title: '文件拖拽监听' }
            ]
        },
        path: {
            name: '路径相关',
            items: [
                { script: 'code/file/path/common.js', title: '常用路径' },
                { script: 'code/file/path/exists.js', title: '文件是否存在' },
                { script: 'code/file/path/delete.js', title: '删除文件' },
                { script: 'code/file/path/rename.js', title: '重命名' },
            ]
        },
        assets: {
            name: '资源访问',
            items: [
                { script: 'code/file/assets/getAssets_utf8.js', title: 'getAssets 读资产(utf8)' },
                { script: 'code/file/assets/getAssets_base64.js', title: 'getAssets 读资产(base64)' },
                { script: 'code/file/assets/getRes.js', title: 'getRes 读资源' },
            ]
        },
    },
    window: {
        basic: {
            name: '基础控制',
            items: [
                { script: 'code/window/basic/show_hide.js', title: '显示/隐藏' },
                { script: 'code/window/basic/min_max_norm.js', title: '最小化/最大化/还原' },
                { script: 'code/window/basic/state.js', title: '查询窗口状态' }
            ]
        },
        create: {
            name: '创建与销毁',
            items: [
                { script: 'code/window/create/create.js', title: '创建新窗口' },
                { script: 'code/window/create/destroy.js', title: '销毁窗口' }
            ]
        },
        inject: {
            name: '页面注入',
            items: [
                { script: 'code/window/inject/inject_js.js', title: 'injectJS 注入在线网站' }
            ]
        },
        info: {
            name: '句柄与屏幕',
            items: [
                { script: 'code/window/info/hwnd.js', title: '窗口句柄' },
                { script: 'code/window/info/win_mode.js', title: '窗口模式查询' },
                { script: 'code/window/info/screen_taskbar.js', title: '屏幕与任务栏尺寸' }
            ]
        },
        interaction: {
            name: '交互功能',
            items: [
                { script: 'code/window/interaction/drag.js', title: '绑定窗口拖拽' },
                { script: 'code/window/interaction/close_listener.js', title: '拦截关闭按钮' },
                { script: 'code/window/interaction/tray.js', title: '系统托盘' },
                { script: 'code/window/interaction/win_msg.js', title: '窗口间通信' }
            ]
        },
        hook: {
            name: 'Hook',
            items: [
                { script: 'code/window/hook/keyboard.js', title: '键盘 Hook' },
                { script: 'code/window/hook/mouse.js', title: '鼠标 Hook' }
            ]
        }
    },
    cpp: {
        quick: {
            name: '快速调用',
            items: [
                { script: 'code/cpp/quick/invokeDll.js', title: '调用DLL' }
            ]
        },
        types: {
            name: '类型示例',
            items: [
                { script: 'code/cpp/types/int.js', title: '整数' },
                { script: 'code/cpp/types/float.js', title: '浮点' },
                { script: 'code/cpp/types/mixed.js', title: '混型参数' },
                { script: 'code/cpp/types/string.js', title: '字符串' }
            ]
        },
        handle: {
            name: '句柄与地址',
            items: [
                { script: 'code/cpp/handle/load.js', title: 'load/free/getProcAddr' },
                { script: 'code/cpp/handle/callByHandle.js', title: 'invokeByHandle' },
                { script: 'code/cpp/handle/callByAddr.js', title: 'invokeByAddr' }
            ]
        },
        dllclass: {
            name: 'Dll 类',
            items: [
                { script: 'code/cpp/dllclass/basic.js', title: '基础用法(invoke/free)' },
                { script: 'code/cpp/dllclass/call.js', title: 'call/callAddr' },
                { script: 'code/cpp/dllclass/string.js', title: '字符串链式' },
                { script: 'code/cpp/dllclass/stateful.js', title: '有状态验证' }
            ]
        }
    },
    python: {
        basic: {
            name: '基础示例',
            items: [
                { script: 'code/python/basic/install.js', title: '安装Python' },
                { script: 'code/python/basic/run_script.js', title: '运行脚本' },
                { script: 'code/python/basic/run_file.js', title: '运行py文件' }
            ]
        },
        advanced: {
            name: '进阶用法',
            items: [
                { script: 'code/python/advanced/sys_path.js', title: '添加模块搜索路径' },
                { script: 'code/python/advanced/comm.js', title: 'JS与Python通信' }
            ]
        }
    }
};

// 默认选择逻辑：第一个菜单的第一个子菜单
function getDefaultSelection() {
    var firstModule = menuConfig.modules[0];
    if (!firstModule) return null;
    var moduleId = firstModule.id;
    var moduleData = menuConfig[moduleId];
    if (!moduleData) return { module: moduleId, group: null, script: null, title: null };

    if (Array.isArray(moduleData)) {
        var firstItem = moduleData[0];
        return {
            module: moduleId,
            group: null,
            script: firstItem ? firstItem.script : null,
            title: firstItem ? firstItem.title : null
        };
    }

    if (typeof moduleData === 'object') {
        var keys = Object.keys(moduleData);
        if (keys.length === 0) return { module: moduleId, group: null, script: null, title: null };
        var firstKey = keys[0];
        var firstItem = moduleData[firstKey].items[0];
        return {
            module: moduleId,
            group: firstKey,
            script: firstItem ? firstItem.script : null,
            title: firstItem ? firstItem.title : null
        };
    }

    return { module: moduleId, group: null, script: null, title: null };
}

// 菜单状态
var currentModuleName = '';
var lastSelected = {
    module: null,
    group: null,
    script: null,
    title: null
};

function saveSelection() {
    try {
        localStorage.setItem('weso_last_selected', JSON.stringify(lastSelected));
    } catch (e) { }
}

function loadSelection() {
    try {
        var saved = localStorage.getItem('weso_last_selected');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) { }
    return null;
}

function renderModuleList() {
    var moduleList = document.getElementById('moduleList');
    moduleList.innerHTML = '';
    menuConfig.modules.forEach(function (mod, index) {
        var item = document.createElement('div');
        item.className = 'module-item' + (index === 0 ? ' active' : '');
        item.dataset.module = mod.id;
        item.innerHTML = '<span class="module-icon">' + mod.icon + '</span><span class="module-name">' + mod.name + '</span>';
        moduleList.appendChild(item);
    });
}

function selectModule(moduleName, restoreState) {
    var moduleItems = document.querySelectorAll('.module-item');
    moduleItems.forEach(function (m) { m.classList.remove('active'); });
    var activeModuleItem = document.querySelector('.module-item[data-module="' + moduleName + '"]');
    if (activeModuleItem) {
        activeModuleItem.classList.add('active');
        currentModuleName = activeModuleItem.querySelector('.module-name').textContent;
        document.getElementById('currentModule').textContent = currentModuleName;
    }

    var subList = document.getElementById('subList');
    subList.innerHTML = '';

    var moduleData = menuConfig[moduleName];
    if (!moduleData) return;

    var autoSelectScript = null;
    var autoSelectTitle = null;
    var autoExpandGroup = null;

    if (restoreState && restoreState.module === moduleName) {
        autoSelectScript = restoreState.script;
        autoSelectTitle = restoreState.title;
        autoExpandGroup = restoreState.group;
    }

    if (typeof moduleData === 'object' && !Array.isArray(moduleData)) {
        var keys = Object.keys(moduleData);
        keys.forEach(function (key, groupIndex) {
            var group = moduleData[key];
            var groupDiv = document.createElement('div');
            groupDiv.className = 'sub-group';

            var isExpanded = true;
            var headerDiv = document.createElement('div');
            headerDiv.className = 'sub-group-header' + (isExpanded ? ' expanded' : '');
            headerDiv.dataset.group = key;
            headerDiv.innerHTML = '<span class="arrow">▶</span><span class="sub-name">' + group.name + '</span>';

            var subSubList = document.createElement('div');
            subSubList.className = 'sub-sub-list' + (isExpanded ? ' expanded' : '');

            group.items.forEach(function (item, itemIndex) {
                var isActive = autoSelectScript ? (item.script === autoSelectScript) : (groupIndex === 0 && itemIndex === 0);
                var subSubItem = document.createElement('div');
                subSubItem.className = 'sub-sub-item' + (isActive ? ' active' : '');
                subSubItem.dataset.script = item.script;
                subSubItem.innerHTML = '<span class="sub-name">' + item.title + '</span>';
                if (isActive) {
                    autoSelectScript = item.script;
                    autoSelectTitle = item.title;
                }
                subSubList.appendChild(subSubItem);
            });

            groupDiv.appendChild(headerDiv);
            groupDiv.appendChild(subSubList);
            subList.appendChild(groupDiv);
        });

        if (autoSelectScript && autoSelectTitle) {
            clearLog();
            loadScript(autoSelectScript, autoSelectTitle);
        } else if (keys.length > 0 && moduleData[keys[0]].items.length > 0) {
            var firstItem = moduleData[keys[0]].items[0];
            autoSelectScript = firstItem.script;
            autoSelectTitle = firstItem.title;
            autoExpandGroup = keys[0];
            clearLog();
            loadScript(firstItem.script, firstItem.title);
        }
    } else {
        var items = moduleData || [];
        var defaultIndex = 0;
        if (autoSelectScript) {
            defaultIndex = items.findIndex(function (item) { return item.script === autoSelectScript; });
            if (defaultIndex < 0) defaultIndex = 0;
        }
        items.forEach(function (item, index) {
            var subItem = document.createElement('div');
            subItem.className = 'sub-item' + (index === defaultIndex ? ' active' : '');
            subItem.dataset.script = item.script;
            subItem.innerHTML = '<span class="sub-name">' + item.title + '</span>';
            subList.appendChild(subItem);
        });

        if (items.length > 0) {
            var selectedItem = items[defaultIndex];
            autoSelectScript = selectedItem.script;
            autoSelectTitle = selectedItem.title;
            clearLog();
            loadScript(selectedItem.script, selectedItem.title);
        }
    }

    // 统一缓存:任何切换路径(模块切换/首项自动选中/恢复)最终加载的内容都持久化
    lastSelected.module = moduleName;
    lastSelected.group = autoExpandGroup;
    lastSelected.script = autoSelectScript;
    lastSelected.title = autoSelectTitle;
    saveSelection();
}

function selectSubItem(item, scriptPath, title) {
    var subItems = document.querySelectorAll('.sub-item');
    subItems.forEach(function (s) { s.classList.remove('active'); });
    item.classList.add('active');
    clearLog();
    loadScript(scriptPath, title);
}

function initMenu() {
    var defaultSelection = getDefaultSelection();
    if (defaultSelection) {
        lastSelected.module = defaultSelection.module;
        lastSelected.group = defaultSelection.group;
        lastSelected.script = defaultSelection.script;
        lastSelected.title = defaultSelection.title;
    }

    renderModuleList();

    document.querySelectorAll('.module-item').forEach(function (item) {
        item.addEventListener('click', function () {
            selectModule(this.dataset.module);
        });
    });

    document.getElementById('subList').addEventListener('click', function (e) {
        var subGroupHeader = e.target.closest('.sub-group-header');
        if (subGroupHeader) {
            var group = subGroupHeader.dataset.group;
            var subSubList = subGroupHeader.nextElementSibling;
            var isExpanded = subGroupHeader.classList.contains('expanded');

            // 允许多个二级菜单同时展开:只切换当前组,不影响其他
            subGroupHeader.classList.toggle('expanded', !isExpanded);
            subSubList.classList.toggle('expanded', !isExpanded);

            if (!isExpanded) {
                lastSelected.group = group;
                saveSelection();
            }
            return;
        }

        var subSubItem = e.target.closest('.sub-sub-item');
        if (subSubItem) {
            var scriptPath = subSubItem.dataset.script;
            var title = subSubItem.querySelector('.sub-name').textContent;
            var groupHeader = subSubItem.closest('.sub-group').querySelector('.sub-group-header');
            var group = groupHeader ? groupHeader.dataset.group : null;

            document.querySelectorAll('.sub-sub-item').forEach(function (s) {
                s.classList.remove('active');
            });
            subSubItem.classList.add('active');

            lastSelected.group = group;
            lastSelected.script = scriptPath;
            lastSelected.title = title;
            saveSelection();

            clearLog();
            loadScript(scriptPath, title);
            return;
        }

        var subItem = e.target.closest('.sub-item');
        if (subItem) {
            var scriptPath = subItem.dataset.script;
            var title = subItem.querySelector('.sub-name').textContent;

            lastSelected.script = scriptPath;
            lastSelected.title = title;
            saveSelection();

            selectSubItem(subItem, scriptPath, title);
        }
    });

    var savedState = loadSelection() || defaultSelection;
    selectModule(savedState.module, savedState);
}
