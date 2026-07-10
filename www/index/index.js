// 全局弹窗管理器，自动创建style、遮罩、弹窗DOM，无需手写html/css
const Modal = (function () {
    // 创建内置样式
    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.modal-mask.show {
  display: flex;
  opacity: 1;
}
.modal-box {
  background: #fff;
  width: 340px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  overflow: hidden;
  transform: scale(0.92);
  transition: transform 0.25s ease;
}
.modal-mask.show .modal-box {
  transform: scale(1);
}
.modal-content {
  padding: 24px;
  text-align: center;
}
.modal-text {
  font-size: 15px;
  color: #222;
  line-height: 1.6;
}
.modal-footer {
  border-top: 1px solid #eee;
  display: flex;
  height:50px;
}
/* 单按钮时单独样式 */
.modal-footer.only-ok {
  justify-content: center;
  align-items: center;
}
.modal-footer.only-ok .confirm-btn {
  width: 120px;
  flex: unset;
  border-radius:  8px;
}
.modal-footer button {
  flex: 1;
  border-radius: 0;
  margin-top: 0;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.modal-footer .confirm-btn {
  background: #2563eb;
  color: white;
}
.modal-footer .confirm-btn:hover {
  background: #1d4ed8;
}
.modal-footer .cancel-btn {
  background: #f3f4f6;
  color: #333;
}
.modal-footer .cancel-btn:hover {
  background: #e5e7eb;
}
        `;
        document.head.appendChild(style);
    }

    // 创建弹窗DOM
    function createModalDom() {
        const mask = document.createElement('div');
        mask.className = 'modal-mask';

        const box = document.createElement('div');
        box.className = 'modal-box';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const msgText = document.createElement('p');
        msgText.className = 'modal-text';

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = '取消';

        const okBtn = document.createElement('button');
        okBtn.className = 'confirm-btn';
        okBtn.textContent = '确定';

        // 组装结构
        content.appendChild(msgText);
        footer.appendChild(cancelBtn);
        footer.appendChild(okBtn);
        box.appendChild(content);
        box.appendChild(footer);
        mask.appendChild(box);
        document.body.appendChild(mask);

        // 点击遮罩关闭
        mask.addEventListener('click', function (e) {
            if (e.target === mask) close();
        });
        okBtn.addEventListener('click', () => {
            if (Modal._okCallback) Modal._okCallback();
            close();
        });
        cancelBtn.addEventListener('click', () => {
            if (Modal._cancelCallback) Modal._cancelCallback();
            close();
        });

        // 缓存节点
        Modal._mask = mask;
        Modal._msgText = msgText;
        Modal._footer = footer;
        Modal._cancelBtn = cancelBtn;
    }

    // 关闭弹窗
    function close() {
        Modal._mask.classList.remove('show');
        Modal._okCallback = null;
        Modal._cancelCallback = null;
        // 恢复双按钮默认状态
        Modal._footer.classList.remove('only-ok');
        Modal._cancelBtn.style.display = 'block';
    }

    // 初始化只执行一次
    let initFlag = false;
    function init() {
        if (initFlag) return;
        createStyle();
        createModalDom();
        initFlag = true;
    }

    return {
        _mask: null,
        _msgText: null,
        _footer: null,
        _cancelBtn: null,
        _okCallback: null,
        _cancelCallback: null,

        // 普通提示框（仅确定，隐藏取消按钮）
        showTip: function (msg) {
            init();
            this._msgText.innerText = msg;
            // 隐藏取消，给footer加单按钮类，限制确定宽度
            this._cancelBtn.style.display = 'none';
            this._footer.classList.add('only-ok');
            this._mask.classList.add('show');
        },

        // 确认弹窗（显示取消+确定，支持回调）
        showConfirm: function (msg, okCb, cancelCb) {
            init();
            this._msgText.innerText = msg;
            // 恢复双按钮布局
            this._cancelBtn.style.display = 'block';
            this._footer.classList.remove('only-ok');
            this._okCallback = okCb;
            this._cancelCallback = cancelCb;
            this._mask.classList.add('show');
        },

        close: close
    };
})();

// 对外简化别名，直接调用
function alert(text) {
    Modal.showTip(text);
}
function confirm(text, ok, cancel) {
    Modal.showConfirm(text, ok, cancel);
}

var codeEditor = null;

var originalConsoleLog = console.log;
var originalConsoleError = console.error;
// 把任意值转成可读字符串。Error 对象必须特殊处理 —— JSON.stringify(Error)
// 结果是 "{}"(message/stack 都在原型链上, 不可枚举), 这会让异步错误只见 {}
// 而看不到原因, 排错困难。
function stringifyConsoleArg(arg) {
    if (arg instanceof Error) {
        return (arg.name || "Error") + ": " + (arg.message || "") + (arg.stack ? "\n" + arg.stack : "");
    }
    if (typeof arg === 'object' && arg !== null) {
        try { return JSON.stringify(arg); } catch (e) { return String(arg); }
    }
    return String(arg);
}
// 直接把文本写入日志窗口, 不经过 console.log, 也不自动追加换行。
// 用途: captureConsoleOutput 等 native 回调拿到的文本本身已含 '\n'
// (Python print / C++ std::endl 都会带尾换行), 若再走 console.log
// (= consoleLogToWindow) 会被再追加一个 '\n', 导致每条 native 输出后多一空行。
// 本函数原样写入, 换行完全由调用方控制。isError=true 时按红色错误样式显示。
function appendLog(text, isError) {
    var output = document.getElementById('logOutput');
    if (isError) {
        output.insertAdjacentHTML('beforeend', '<span style="color:red">' + text + '</span>');
    } else {
        output.insertAdjacentHTML('beforeend', text);
    }
    output.scrollTop = output.scrollHeight;
}
function consoleLogToWindow(...args) {
    originalConsoleLog.apply(console, args);
    var message = args.map(stringifyConsoleArg).join(' ');
    appendLog(message + '\n');
}
function consoleErrorToWindow(...args) {
    originalConsoleError.apply(console, args);
    var message = args.map(stringifyConsoleArg).join(' ');
    appendLog(message + '\n', true);
}
console.log = consoleLogToWindow;
console.error = consoleErrorToWindow;
// 兜底: 任何未被 .catch 的 rejected Promise 在这里统一打到红色日志,
// 这样示例脚本里即使只写 main() 不接 .catch 也不会静默吞错。
window.addEventListener('unhandledrejection', function (e) {
    consoleErrorToWindow('Unhandled rejection:', e.reason);
});

function clearLog() {
    document.getElementById('logOutput').textContent = '';
}

// === Script side-effect cleanup ===
// Track child nodes synchronously added to body/head during script execution,
// and remove them before switching menus or re-running, so floating layers
// created by examples like drag.js don't linger after switching features.
// Note: MutationObserver can't be used here -- its callback is an async
// microtask that fires only after eval() returns; by then disconnect() has
// already dropped the records. Use a synchronous snapshot+diff instead.
var _scriptArtifacts = [];
var _childArray = function (root) { return Array.prototype.slice.call(root.children); };

// Snapshot body/head children before eval; diff against live children after
// eval to collect nodes added by the script.
function snapshotDom() {
    return { body: _childArray(document.body), head: _childArray(document.head) };
}
function recordNewNodes(before, after) {
    // after.body / after.head are the live element collections right after eval
    _childArray(after.body).forEach(function (node) {
        if (before.body.indexOf(node) === -1) _scriptArtifacts.push(node);
    });
    _childArray(after.head).forEach(function (node) {
        if (before.head.indexOf(node) === -1) _scriptArtifacts.push(node);
    });
}

function clearScriptArtifacts() {
    _scriptArtifacts.forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    _scriptArtifacts = [];
}

function runScript() {
    clearLog();
    clearScriptArtifacts();
    var before = snapshotDom();
    var code = codeEditor.getValue();
    try {
        eval(code);
    } catch (e) {
        var stack = e.stack || '';
        var lines = stack.split('\n');
        var evalIndex = lines.findIndex(function(line) { return line.includes('eval') || line.includes('Script:') || line.includes('eval code'); });
        if (evalIndex > 0) {
            lines = lines.slice(0, evalIndex);
        } else if (evalIndex === 0) {
            lines = lines.slice(1);
        }
        console.error(lines.join('\n'));
    }
    // eval() is synchronous and done; diff the snapshot to collect the DOM
    // nodes this script added.
    recordNewNodes(before, { body: document.body, head: document.head });
}

function loadScript(scriptPath, title) {
    // When switching menus/scripts, clean up UI left over from the previous
    // script run (e.g. the top drag bar from drag.js).
    clearScriptArtifacts();
    fetch(scriptPath)
        .then(function(response) { return response.text(); })
        .then(function(code) {
            codeEditor.setValue(code);
            document.getElementById('currentTitle').textContent = title;
        })
        .catch(function() {
            codeEditor.setValue('// 加载脚本失败: ' + scriptPath);
            document.getElementById('currentTitle').textContent = title;
        });
}

codeEditor = new CodeEditor({
    container: document.getElementById('editorContainer'),
    language: 'javascript',
    code: ''
});

var resizer = document.getElementById('resizer');
var container = document.querySelector('.container');
var leftPanel = document.querySelector('.split-left');
var rightPanel = document.querySelector('.split-right');

resizer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    resizer.classList.add('resizing');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

function handleMouseMove(e) {
    var containerRect = container.getBoundingClientRect();
    var offset = e.clientX - containerRect.left - 5;
    var totalWidth = containerRect.width - 20;
    var leftPercent = (offset / totalWidth) * 100;
    leftPercent = Math.max(20, Math.min(80, leftPercent));
    leftPanel.style.flex = '0 0 ' + leftPercent + '%';
    rightPanel.style.flex = '0 0 ' + (100 - leftPercent) + '%';
}

function handleMouseUp() {
    resizer.classList.remove('resizing');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

initMenu();