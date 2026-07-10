// 使用文档的菜单配置与切换逻辑。
// 结构对齐 index/menu.js：modules 为顶部模块，每个模块下是 {doc,title} 列表。
// doc 字段是相对 www/ 的路径（../skills/...），由 docs.js 负责解析为可读内容。
var docsMenu = {
    modules: [
        { id: 'overview', icon: '📋', name: '总览' },
        { id: 'cli', icon: '⚡', name: 'CLI 命令' },
        { id: 'js', icon: '🧩', name: '页面 JS' }
    ],
    overview: [
        { doc: '../skills/SKILL.md', title: 'Weso 开发总览' }
    ],
    cli: [
        { doc: '../skills/reference/cli/create-project.md', title: '新建项目' },
        { doc: '../skills/reference/cli/package.md', title: '打包与调试' },
        { doc: '../skills/reference/cli/python-runtime.md', title: 'Python 运行时' },
        { doc: '../skills/reference/cli/python-libs.md', title: 'Python 第三方库' }
    ],
    js: [
        { doc: '../skills/reference/file-io.md', title: '文件 I/O' },
        { doc: '../skills/reference/paths-assets.md', title: '路径与资源' },
        { doc: '../skills/reference/system.md', title: '系统 / OS' },
        { doc: '../skills/reference/dll-interop.md', title: 'DLL 互操作' },
        { doc: '../skills/reference/window.md', title: '窗口管理' },
        { doc: '../skills/reference/hooks.md', title: '输入 Hook' },
        { doc: '../skills/reference/python.md', title: 'Python 集成' },
        { doc: '../skills/reference/messaging.md', title: '消息与 IPC' }
    ]
};

// 默认选择：第一个模块的第一篇文档
function getDefaultDocSelection() {
    var firstModule = docsMenu.modules[0];
    if (!firstModule) return null;
    var moduleId = firstModule.id;
    var list = docsMenu[moduleId];
    if (!list || !list.length) return { module: moduleId, doc: null, title: null };
    return { module: moduleId, doc: list[0].doc, title: list[0].title };
}

// 选中状态持久化
var currentDocModuleName = '';
var lastDoc = { module: null, doc: null, title: null };

function saveDocSelection() {
    try {
        localStorage.setItem('weso_last_doc', JSON.stringify(lastDoc));
    } catch (e) { }
}

function loadDocSelection() {
    try {
        var saved = localStorage.getItem('weso_last_doc');
        if (saved) return JSON.parse(saved);
    } catch (e) { }
    return null;
}

function renderDocModuleList() {
    var moduleList = document.getElementById('moduleList');
    moduleList.innerHTML = '';
    docsMenu.modules.forEach(function (mod, index) {
        var item = document.createElement('div');
        item.className = 'module-item' + (index === 0 ? ' active' : '');
        item.dataset.module = mod.id;
        item.innerHTML = '<span class="module-icon">' + mod.icon + '</span><span class="module-name">' + mod.name + '</span>';
        moduleList.appendChild(item);
    });
}

function selectDocModule(moduleName, restoreState) {
    var moduleItems = document.querySelectorAll('.module-item');
    moduleItems.forEach(function (m) { m.classList.remove('active'); });
    var activeModuleItem = document.querySelector('.module-item[data-module="' + moduleName + '"]');
    if (activeModuleItem) {
        activeModuleItem.classList.add('active');
        currentDocModuleName = activeModuleItem.querySelector('.module-name').textContent;
        document.getElementById('currentModule').textContent = currentDocModuleName;
    }

    var subList = document.getElementById('subList');
    subList.innerHTML = '';

    var list = docsMenu[moduleName] || [];

    var autoSelectDoc = null;
    var autoSelectTitle = null;
    var defaultIndex = 0;

    if (restoreState && restoreState.module === moduleName && restoreState.doc) {
        autoSelectDoc = restoreState.doc;
        autoSelectTitle = restoreState.title;
        defaultIndex = list.findIndex(function (item) { return item.doc === autoSelectDoc; });
        if (defaultIndex < 0) defaultIndex = 0;
    }

    list.forEach(function (item, index) {
        var subItem = document.createElement('div');
        subItem.className = 'sub-item' + (index === defaultIndex ? ' active' : '');
        subItem.dataset.doc = item.doc;
        subItem.innerHTML = '<span class="sub-name">' + item.title + '</span>';
        subList.appendChild(subItem);
    });

    if (list.length) {
        var selected = list[defaultIndex];
        autoSelectDoc = selected.doc;
        autoSelectTitle = selected.title;
        loadDoc(selected.doc, selected.title);
    }

    lastDoc.module = moduleName;
    lastDoc.doc = autoSelectDoc;
    lastDoc.title = autoSelectTitle;
    saveDocSelection();
}

function selectDocItem(item, docPath, title) {
    var subItems = document.querySelectorAll('.sub-item');
    subItems.forEach(function (s) { s.classList.remove('active'); });
    item.classList.add('active');
    loadDoc(docPath, title);
}

function initDocMenu() {
    var defaultSelection = getDefaultDocSelection();
    if (defaultSelection) {
        lastDoc.module = defaultSelection.module;
        lastDoc.doc = defaultSelection.doc;
        lastDoc.title = defaultSelection.title;
    }

    renderDocModuleList();

    document.querySelectorAll('.module-item').forEach(function (item) {
        item.addEventListener('click', function () {
            selectDocModule(this.dataset.module);
        });
    });

    document.getElementById('subList').addEventListener('click', function (e) {
        var subItem = e.target.closest('.sub-item');
        if (subItem) {
            var docPath = subItem.dataset.doc;
            var title = subItem.querySelector('.sub-name').textContent;

            lastDoc.doc = docPath;
            lastDoc.title = title;
            saveDocSelection();

            selectDocItem(subItem, docPath, title);
        }
    });

    var savedState = loadDocSelection() || defaultSelection;
    selectDocModule(savedState.module, savedState);
}
