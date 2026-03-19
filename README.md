# Team AI Sharing Deck

一个面向团队分享的单页 HTML 演示站点，采用全屏 section 吸附滚动，适合代替传统 PPT。

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm test`

## Live Codex Demo
- `npm run dev` 现在会启动本地演示服务器，地址默认是 `http://localhost:5173`。
- 在页面里的 `CLI / Agent` 卡片点击 `Live Codex Demo`，会打开一个真实 shell 的终端弹窗。
- 终端工作目录固定在当前仓库根目录，连上后直接输入 `codex` 就可以现场演示。
- 关闭弹窗会销毁这次 shell 会话；重新打开会创建一个新的会话。
- 依赖本机可用的 `python3` 和 `codex` 命令。

## Presentation Controls
- 鼠标滚轮滚动切换 section
- `ArrowUp` / `ArrowDown`
- `PageUp` / `PageDown`
- `Home` / `End`
