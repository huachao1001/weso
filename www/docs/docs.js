// 使用文档页运行时：读取 www/skills/ 下的 md 并渲染到 #docView。
//
// 读取策略：
//   1) Weso 运行时 —— 用 W.getAssets({path, encoding}) 读取。path 相对 www/ 资产根，
//      skills 现位于 www/skills/，故 "skills/<rest>" 直接可用。开发模式(-d)从磁盘读，
//      打包后从加密资产读，两种模式一致可用。
//   2) 普通浏览器（无 W，例如本地预览）—— 直接 fetch 相对路径，靠浏览器解析。
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

async function readDocText(relPath) {
    if (typeof W !== 'undefined' && typeof W.getAssets === 'function') {
        return await W.getAssets({ path: relPath, encoding: 'utf8' });
    }
    var resp = await fetch(relPath);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
}

function renderDoc(text) {
    docView.innerHTML = Markdown.render(text);
    // 标记每个 API 标题（### `W.xxx` → <h3><code>），再把它连同后续内容
    // （参数/示例/说明）包裹进一张 .api-card 卡片，直到下一个标题或分隔线，
    // 让每个函数以独立卡片形式呈现。
    var apiHeadings = docView.querySelectorAll('h3');
    Array.prototype.forEach.call(apiHeadings, function (h3) {
        if (h3.querySelector('code')) h3.classList.add('api-heading');
    });
    wrapApiCards(docView);
    // 代码块语法高亮（配色对齐 codemirror vscode-light）
    if (typeof Highlight !== 'undefined') Highlight.applyTo(docView);
    docView.scrollTop = 0;
}

// 将每个 h3.api-heading 及其后续兄弟节点（直到下一个 h1/h2/h3/hr）包进 .api-card；
// 卡片之间的 <hr> 已无分隔意义，隐藏掉以免与卡片边框叠加。
function wrapApiCards(root) {
    var snapshot = Array.prototype.slice.call(root.childNodes);
    var i = 0;
    while (i < snapshot.length) {
        var node = snapshot[i];
        if (node.nodeType === 1 && node.tagName === 'H3' && node.classList.contains('api-heading')) {
            var card = document.createElement('div');
            card.className = 'api-card';
            root.insertBefore(card, node);
            card.appendChild(node);
            i++;
            while (i < snapshot.length) {
                var cur = snapshot[i];
                if (cur.nodeType === 1) {
                    var tag = cur.tagName;
                    if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'HR') break;
                }
                card.appendChild(cur);
                i++;
            }
        } else {
            i++;
        }
    }
    // 隐藏夹在卡片之间 / 紧邻卡片的冗余 <hr>（直接遍历子节点，避免依赖 :scope）
    var direct = Array.prototype.slice.call(root.childNodes);
    direct.forEach(function (hr) {
        if (hr.nodeType !== 1 || hr.tagName !== 'HR') return;
        var prev = hr.previousElementSibling;
        var next = hr.nextElementSibling;
        if ((prev && prev.classList.contains('api-card')) ||
            (next && next.classList.contains('api-card'))) {
            hr.style.display = 'none';
        }
    });
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
                '提示：文档经 W.getAssets 读取 www/skills/ 资产，开发模式与打包 exe 均可用；当前可能不在 Weso 运行环境中。'
            );
            if (typeof console !== 'undefined' && console.error) console.error(err);
        });
}

// 工具栏「↻ 刷新」：重新读取当前文档
function refreshDoc() {
    if (currentDocPath) loadDoc(currentDocPath, document.getElementById('currentTitle').textContent);
}

initDocMenu();
