// === 开机自启动 ===
// W.setAutoStart(enable)  开启/关闭开机自启 (在启动文件夹创建/删除快捷方式)
// W.isAutoStart()         查询当前是否已开启

console.log("=== 开机自启动 ===\n");

function query() {
    return W.isAutoStart() === true;
}

// ---- 注入简易控制面板到日志区 ----
var box = document.createElement("div");
box.style.cssText = "padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px;"
    + "background:#fafafa;margin:10px 0;font-size:14px;font-family:system-ui,sans-serif;white-space:normal";

var row = document.createElement("div");
row.style.cssText = "margin-bottom:12px";
row.innerHTML = '当前开机自启状态: <b style="font-size:15px">-</b>';
var statusEl = row.querySelector("b");

var toggleBtn = document.createElement("button");
toggleBtn.style.cssText = "margin-right:8px;padding:7px 16px;border:none;border-radius:6px;color:#fff;cursor:pointer";

var refreshBtn = document.createElement("button");
refreshBtn.textContent = "刷新状态";
refreshBtn.style.cssText = "padding:7px 16px;border:1px solid #d1d5db;border-radius:6px;background:#f3f4f6;color:#333;cursor:pointer";

var tip = document.createElement("div");
tip.style.cssText = "margin-top:10px;font-size:12px;color:#9ca3af";
tip.textContent = "提示: Win+R 输入 shell:startup 可打开启动文件夹查看";

box.appendChild(row);
box.appendChild(toggleBtn);
box.appendChild(refreshBtn);
box.appendChild(tip);
document.getElementById('logOutput').appendChild(box);

function render() {
    var on = query();
    statusEl.textContent = on ? "已开启" : "未开启";
    statusEl.style.color = on ? "#16a34a" : "#dc2626";
    toggleBtn.textContent = on ? "关闭自启" : "开启自启";
    toggleBtn.style.background = on ? "#dc2626" : "#2563eb";
    return on;
}

toggleBtn.onclick = function () {
    var target = !query();
    var ok = W.setAutoStart(target) === true;
    console.log("W.setAutoStart(" + target + ") -> " + ok);
    if (!ok) {
        alert("操作失败, 请检查权限或 weso.json 的 appNameCN 配置");
        return;
    }
    render();
};

refreshBtn.onclick = function () {
    render();
};

console.log("W.isAutoStart() -> " + render());
console.log("使用上方按钮切换自启状态");
