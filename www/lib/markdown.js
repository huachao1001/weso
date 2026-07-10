// 轻量 Markdown → HTML 渲染器，覆盖 skills/ 文档用到的语法：
//   YAML front matter、ATX 标题、围栏代码块、表格、引用、有序/无序列表（含嵌套与软换行）、
//   水平分割线、行内代码、加粗、链接。
// 不依赖任何外部库，输入为 markdown 文本，输出为 HTML 字符串。
var Markdown = (function () {

    function escapeHtml(s) {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function slug(text) {
        return text
            .replace(/<[^>]+>/g, '')
            .replace(/&#39;|&quot;|&amp;|&lt;|&gt;/g, '')
            .trim()
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function leadingSpaces(line) {
        var m = line.match(/^(\s*)/);
        return m ? m[1].length : 0;
    }

    // 去掉开头的 YAML front matter（--- ... ---）
    function stripFrontMatter(text) {
        if (/^\uFEFF?---\s*\n/.test(text)) {
            var lines = text.split('\n');
            for (var i = 1; i < lines.length; i++) {
                if (/^---\s*$/.test(lines[i]) || /^\.\.\.\s*$/.test(lines[i])) {
                    return lines.slice(i + 1).join('\n').replace(/^\n+/, '');
                }
            }
        }
        return text;
    }

    // 行内格式化（输入须已做 HTML 转义）。仅处理：行内代码、加粗、链接。
    // 故意不做 *斜体* —— skills 文档里单星号是「必填参数」标记，转义后会原样显示，
    // 若做斜体反而会吞掉标记或在两个单星号间误高亮。
    function inline(text) {
        var codes = [];
        text = text.replace(/`([^`]+)`/g, function (m, c) {
            codes.push(c);
            return '\u0000C' + (codes.length - 1) + '\u0000';
        });
        text = text.replace(/\*\*([^\*]+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
        text = text.replace(/\u0000C(\d+)\u0000/g, function (m, i) {
            return '<code>' + codes[+i] + '</code>';
        });
        return text;
    }

    function isTableSep(line) {
        return /^\s*\|?[\s:|\-]+\|?\s*$/.test(line) && line.indexOf('-') >= 0;
    }

    function splitRow(line) {
        line = line.trim();
        if (line.charAt(0) === '|') line = line.slice(1);
        if (line.charAt(line.length - 1) === '|') line = line.slice(0, -1);
        return line.split('|');
    }

    function parseTable(lines, i) {
        var header = splitRow(lines[i]);
        var sep = splitRow(lines[i + 1]);
        var aligns = sep.map(function (c) {
            c = c.trim();
            var left = c.charAt(0) === ':';
            var right = c.charAt(c.length - 1) === ':';
            if (left && right) return 'center';
            if (right) return 'right';
            if (left) return 'left';
            return null;
        });
        var html = '<table><thead><tr>';
        header.forEach(function (c, idx) {
            var a = aligns[idx] ? ' style="text-align:' + aligns[idx] + '"' : '';
            html += '<th' + a + '>' + inline(escapeHtml(c.trim())) + '</th>';
        });
        html += '</tr></thead><tbody>';
        var j = i + 2;
        while (j < lines.length && /^\s*\|/.test(lines[j])) {
            var row = splitRow(lines[j]);
            html += '<tr>';
            row.forEach(function (c, idx) {
                var a = aligns[idx] ? ' style="text-align:' + aligns[idx] + '"' : '';
                html += '<td' + a + '>' + inline(escapeHtml(c.trim())) + '</td>';
            });
            html += '</tr>';
            j++;
        }
        html += '</tbody></table>';
        return { html: html, next: j };
    }

    // 解析一个列表块（支持嵌套与软换行续行）。返回 {html, next}
    function parseList(lines, i) {
        var base = leadingSpaces(lines[i]);
        var ordered = /^\s*\d+\.\s+/.test(lines[i]);
        var items = [];

        while (i < lines.length) {
            if (/^\s*$/.test(lines[i])) {
                // 空行：向后看一个非空行，若是同级或更深列表项则继续，否则结束
                var j = i;
                while (j < lines.length && /^\s*$/.test(lines[j])) j++;
                if (j < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[j]) && leadingSpaces(lines[j]) >= base) {
                    i = j;
                    continue;
                }
                break;
            }

            var lead = leadingSpaces(lines[i]);
            var m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);

            if (!m) {
                // 非标记行：若比基准缩进深，当作上一项的软换行续行
                if (lead > base && items.length) {
                    items[items.length - 1].content += ' ' + lines[i].trim();
                    i++;
                    continue;
                }
                break;
            }

            if (lead < base) break;

            if (lead === base) {
                items.push({ content: m[3], sub: [] });
                i++;
                continue;
            }

            // lead > base：嵌套内容，原样压入上一项 sub，交 renderBlocks 递归
            if (items.length) items[items.length - 1].sub.push(lines[i]);
            i++;
        }

        var tag = ordered ? 'ol' : 'ul';
        var html = '<' + tag + '>';
        items.forEach(function (it) {
            html += '<li>' + inline(escapeHtml(it.content));
            if (it.sub.length) html += renderBlocks(it.sub.join('\n'));
            html += '</li>';
        });
        html += '</' + tag + '>';
        return { html: html, next: i };
    }

    // 块级解析主循环
    function renderBlocks(text) {
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        var lines = text.split('\n');
        var html = '';
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            // 围栏代码块
            var fence = line.match(/^```\s*([\w-]*)\s*$/);
            if (fence) {
                var lang = fence[1];
                var buf = [];
                i++;
                while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                    buf.push(lines[i]);
                    i++;
                }
                i++; // 跳过结束 ```
                var cls = lang ? ' class="lang-' + lang + '"' : '';
                html += '<pre><code' + cls + '>' + escapeHtml(buf.join('\n')) + '</code></pre>\n';
                continue;
            }

            // ATX 标题
            var h = line.match(/^(#{1,6})\s+(.*)$/);
            if (h) {
                var level = h[1].length;
                var hid = slug(h[2]);
                html += '<h' + level + (hid ? ' id="' + hid + '"' : '') + '>' + inline(escapeHtml(h[2].trim())) + '</h' + level + '>\n';
                i++;
                continue;
            }

            // 水平分割线
            if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
                html += '<hr>\n';
                i++;
                continue;
            }

            // 表格
            if (/^\s*\|/.test(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
                var t = parseTable(lines, i);
                html += t.html + '\n';
                i = t.next;
                continue;
            }

            // 引用
            if (/^\s*>/.test(line)) {
                var qbuf = [];
                while (i < lines.length && /^\s*>/.test(lines[i])) {
                    qbuf.push(lines[i].replace(/^\s*>?\s?/, ''));
                    i++;
                }
                var qhtml = inline(escapeHtml(qbuf.join('\n').trim())).replace(/\n/g, '<br>');
                html += '<blockquote>' + qhtml + '</blockquote>\n';
                continue;
            }

            // 列表
            if (/^(\s*)([-*]|\d+\.)\s+/.test(line)) {
                var l = parseList(lines, i);
                html += l.html + '\n';
                i = l.next;
                continue;
            }

            // 空行
            if (/^\s*$/.test(line)) {
                i++;
                continue;
            }

            // 段落：聚合连续非特殊行
            var para = [];
            while (i < lines.length) {
                var cur = lines[i];
                if (/^\s*$/.test(cur)) break;
                if (/^```/.test(cur)) break;
                if (/^(#{1,6})\s/.test(cur)) break;
                if (/^\s*>/.test(cur)) break;
                if (/^(\s*)([-*]|\d+\.)\s+/.test(cur)) break;
                if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(cur)) break;
                if (/^\s*\|/.test(cur) && i + 1 < lines.length && isTableSep(lines[i + 1])) break;
                para.push(cur);
                i++;
            }
            html += '<p>' + inline(escapeHtml(para.join('\n').trim())).replace(/\n/g, '<br>') + '</p>\n';
        }
        return html;
    }

    function render(text) {
        return renderBlocks(stripFrontMatter(text || ''));
    }

    return { render: render, escapeHtml: escapeHtml, inline: inline };
})();
