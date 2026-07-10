// 使用文档页运行时：读取 skills/ 下的 md 并渲染到 #docView。
//
// 读取策略：
//   1) Weso 运行时 —— 用 W.getWorkspace() 得到工作区根（含 skills/ 与 weso.json），
//      把相对路径 ../skills/<rest> 映射为绝对路径，经 W.readFile(utf8) 读取。
//      这与示例读取 res/ 资源的方式一致，可靠。
//   2) 普通浏览器（无 W，例如本地预览）—— 直接 fetch 相对路径，靠浏览器解析 ../。
var docView = document.getElementById('docView');
var currentDocPath = null;

function setDocLoading() {
    docView.innerHTML = '<div class="doc-loading">正在加载文档…</div>';
}

function setDocError(message, tip) {
    var html = '<div class="doc-error">' + message;
    if (tip) html += '<span class="doc-error-tip">' + tip + '</span>';
    html += '</div>';
    docView.innerHTML = html;
}

// 解析 skills 目录的绝对路径（仅 Weso 运行时可用）
function resolveSkillsBase() {
    if (typeof W === 'undefined') return null;
    try {
        if (typeof W.getWorkspace === 'function') {
            var ws = W.getWorkspace();
            if (ws) return ws + '\\skills';
        }
    } catch (e) { }
    try {
        if (typeof W.getResFolder === 'function') {
            var rf = W.getResFolder();
            if (rf) {
                var idx = rf.lastIndexOf('\\');
                var root = idx >= 0 ? rf.slice(0, idx) : rf;
                return root + '\\skills';
            }
        }
    } catch (e) { }
    return null;
}

async function readDocText(relPath) {
    var base = resolveSkillsBase();
    if (base && typeof W !== 'undefined' && typeof W.readFile === 'function') {
        var rest = relPath.replace(/^\.\.\/skills\//, '').replace(/\//g, '\\');
        var abs = base + '\\' + rest;
        return await W.readFile({ path: abs, encoding: 'utf8' });
    }
    var resp = await fetch(relPath);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
}

function renderDoc(text) {
    docView.innerHTML = Markdown.render(text);
    docView.scrollTop = 0;
}

function loadDoc(docPath, title) {
    currentDocPath = docPath;
    if (title) document.getElementById('currentTitle').textContent = title;
    setDocLoading();
    readDocText(docPath)
        .then(function (text) {
            renderDoc(text);
        })
        .catch(function (err) {
            setDocError(
                '文档加载失败：' + (docPath || ''),
                '提示：使用文档在开发模式下从 skills/ 目录读取；打包后的 exe 不含 skills/ 目录，故仅 -d 调试运行时可用。'
            );
            if (typeof console !== 'undefined' && console.error) console.error(err);
        });
}

// 工具栏「↻ 刷新」：重新读取当前文档
function refreshDoc() {
    if (currentDocPath) loadDoc(currentDocPath, document.getElementById('currentTitle').textContent);
}

initDocMenu();
