// 轻量代码高亮器，配色对齐 codemirror 的 vscode-light 主题：
//   keyword #af00db / string #a31515 / comment #008000 斜体 / number #098658
//   function #795e26 / builtin #267f99 / property #001080 / default 继承父级
// 支持 js、bat、json 三类代码块（skills 文档实际出现的语言），其余原样显示。
var Highlight = (function () {

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    var JS_KW = /\b(?:var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|in|of|try|catch|finally|throw|class|extends|super|this|async|await|yield|void|null|undefined|true|false|NaN|Infinity)\b/;
    var JS_BUILTIN = /\b(?:console|window|document|Math|JSON|Object|Array|String|Number|Boolean|Date|RegExp|Error|Promise|Uint8Array|ArrayBuffer|TextEncoder|TextDecoder|Map|Set|parseInt|parseFloat|isNaN|isFinite|encodeURIComponent|decodeURIComponent|btoa|atob|setTimeout|setInterval|fetch|W|weso)\b/;

    // 单一遍扫描：注释 → 字符串 → 数字 → 标识符(关键字/内置/函数/属性) → 其它
    function highlightJs(code) {
        var out = '';
        var i = 0, n = code.length;
        while (i < n) {
            var c = code[i];

            // 行注释
            if (c === '/' && code[i + 1] === '/') {
                var e = code.indexOf('\n', i);
                if (e < 0) e = n;
                out += '<span class="hl-comment">' + esc(code.slice(i, e)) + '</span>';
                i = e;
                continue;
            }
            // 块注释
            if (c === '/' && code[i + 1] === '*') {
                var e = code.indexOf('*/', i + 2);
                e = e < 0 ? n : e + 2;
                out += '<span class="hl-comment">' + esc(code.slice(i, e)) + '</span>';
                i = e;
                continue;
            }
            // 字符串（单/双/反引号，含转义）
            if (c === '"' || c === "'" || c === '`') {
                var e = i + 1;
                while (e < n) {
                    if (code[e] === '\\') { e += 2; continue; }
                    if (code[e] === c) { e++; break; }
                    e++;
                }
                out += '<span class="hl-string">' + esc(code.slice(i, e)) + '</span>';
                i = e;
                continue;
            }
            // 数字
            if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(code[i + 1]))) {
                var m = code.slice(i).match(/^0[xX][0-9a-fA-F]+|^\d+\.?\d*(?:[eE][+-]?\d+)?/);
                if (m) {
                    out += '<span class="hl-number">' + esc(m[0]) + '</span>';
                    i += m[0].length;
                    continue;
                }
            }
            // 标识符
            if (/[A-Za-z_$]/.test(c)) {
                var m = code.slice(i).match(/^[A-Za-z_$][\w$]*/);
                var word = m[0];
                var rest = code.slice(i + word.length);
                if (JS_KW.test(word)) {
                    out += '<span class="hl-keyword">' + esc(word) + '</span>';
                } else if (JS_BUILTIN.test(word)) {
                    out += '<span class="hl-builtin">' + esc(word) + '</span>';
                } else if (/^\s*\(/.test(rest)) {
                    out += '<span class="hl-function">' + esc(word) + '</span>';
                } else {
                    // 对象属性：前面是点号 → property 配色，否则原样
                    var prev = out.lastIndexOf('>');
                    var before = prev >= 0 ? code.slice(0, i).charAt(i - 1) : '';
                    out += (before === '.') ? '<span class="hl-property">' + esc(word) + '</span>' : esc(word);
                }
                i += word.length;
                continue;
            }
            // 其它字符直接转义
            out += esc(c);
            i++;
        }
        return out;
    }

    function highlightBat(code) {
        var lines = code.split('\n');
        var KW = /\b(?:echo|set|if|else|exist|not|defined|for|in|do|call|goto|exit|rem|cd|dir|del|copy|move|md|rd|start|pause|title|color|pushd|popd)\b/i;
        return lines.map(function (line) {
            // 注释 :: 或 REM
            if (/^\s*(::|REM\b)/i.test(line)) {
                return '<span class="hl-comment">' + esc(line) + '</span>';
            }
            var out = '';
            var rest = line;
            // %VAR% 变量
            rest = rest.replace(/%[\w]+%/g, function (m) {
                return '\u0001V' + m + '\u0001';
            });
            // 字符串（双引号）
            rest = rest.replace(/"[^"]*"/g, function (m) {
                return '\u0001S' + m + '\u0001';
            });
            rest.split(/(\u0001[VS][^\u0001]*\u0001)/).forEach(function (seg) {
                if (/^\u0001V/.test(seg)) {
                    out += '<span class="hl-builtin">' + esc(seg.slice(2, -1)) + '</span>';
                } else if (/^\u0001S/.test(seg)) {
                    out += '<span class="hl-string">' + esc(seg.slice(2, -1)) + '</span>';
                } else {
                    out += esc(seg).replace(/\b([A-Za-z]+)\b/g, function (m, w) {
                        return KW.test(w) ? '<span class="hl-keyword">' + esc(w) + '</span>' : esc(w);
                    });
                }
            });
            return out;
        }).join('\n');
    }

    function highlightJson(code) {
        var out = '';
        var i = 0, n = code.length;
        while (i < n) {
            var c = code[i];
            if (c === '"') {
                var e = i + 1;
                while (e < n) {
                    if (code[e] === '\\') { e += 2; continue; }
                    if (code[e] === '"') { e++; break; }
                    e++;
                }
                var seg = code.slice(i, e);
                // 键（后接冒号）用 property 色，值用 string 色
                var after = code.slice(e).replace(/^\s*/, '');
                out += (after.charAt(0) === ':')
                    ? '<span class="hl-property">' + esc(seg) + '</span>'
                    : '<span class="hl-string">' + esc(seg) + '</span>';
                i = e;
                continue;
            }
            if (/[0-9-]/.test(c)) {
                var m = code.slice(i).match(/^-?\d+(\.\d+)?(?:[eE][+-]?\d+)?/);
                if (m) {
                    out += '<span class="hl-number">' + esc(m[0]) + '</span>';
                    i += m[0].length;
                    continue;
                }
            }
            var wm = code.slice(i).match(/^[A-Za-z]+/);
            if (wm && /^(?:true|false|null)$/.test(wm[0])) {
                out += '<span class="hl-keyword">' + esc(wm[0]) + '</span>';
                i += wm[0].length;
                continue;
            }
            out += esc(c);
            i++;
        }
        return out;
    }

    function highlight(code, lang) {
        lang = (lang || '').toLowerCase();
        if (lang === 'js' || lang === 'javascript') return highlightJs(code);
        if (lang === 'bat' || lang === 'cmd' || lang === 'batch') return highlightBat(code);
        if (lang === 'json') return highlightJson(code);
        return esc(code);
    }

    // 处理容器内所有 <pre><code class="lang-xxx">，原地高亮
    function applyTo(container) {
        var blocks = container.querySelectorAll('pre > code');
        Array.prototype.forEach.call(blocks, function (block) {
            var lang = '';
            var cls = block.className || '';
            var m = cls.match(/lang-(\w+)/);
            if (m) lang = m[1];
            var code = block.textContent;
            block.innerHTML = highlight(code, lang);
        });
    }

    return { highlight: highlight, applyTo: applyTo };
})();
