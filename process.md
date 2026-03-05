# Process log — 代码改动记录

格式：**where**（文件/位置） · **what**（做了什么） · **why**（原因）

---

## 2025-03-04：Deep Dive 第一个条目 — MIT 6.031

- **where**: `deepdive/mit-6031.html`（新建）、`index.html`（Deepdive 区块）、`deepdive/css/style.css`
- **what**:
  - 新建 Deep Dive 页面 `deepdive/mit-6031.html`，内容为学习 MIT 6.031（SP21 & SP22）的笔记：Reading 1 静态检查（类型、三种检查、好软件的三个目标）、Reading 2 Basic TypeScript（变量声明、快照图、可变 vs 重赋值、Array/Map/Set），并附 SP21/SP22 课程链接。
  - 在首页 `index.html` 的 Deepdive 区块中，将「MIT 6.031 — Software Construction」设为第一个条目，原有「Cybernetics」改为第二个。
  - 在 `deepdive/css/style.css` 中增加 `.sub-text`、`table`（含 `th`/`td`/`tr`）、`code` 的样式，供 Deep Dive 文章页使用。
- **why**: 按你的要求把「学习 MIT 6.031 2022 和 2021」作为第一个 Deep Dive 项目写进去，并保证与现有 Deep Dive 风格一致、可读性好。

---

## 2025-03-04：Deep Dive 页面风格与主页统一（简约、去 AI 味）

- **where**: `deepdive/css/style.css`、`deepdive/mit-6031.html`、`deepdive/cybernetics.html`
- **what**:
  - 重写 `deepdive/css/style.css`：与主页一致深色背景（`#0a0a0a`）、Syne + IBM Plex Sans 字体、相同语义色（`--text-muted`、`--card-border` 等）；去掉渐变 header、圆角、阴影、hover 上浮；区块改为仅用 `border-bottom` 分隔，表格与 code 改为深色系。
  - 两个 Deep Dive 页面的「头部」改为简约 `.dd-header`：标题 + 一行副标题（muted）+「← Back」链接，不再使用全屏渐变 header。
  - Cybernetics 页的 Braitenberg 模拟区按钮改为透明底+描边风格，与整体简约一致。
- **why**: 让 Deep Dive 界面更符合主页的简约、深色、无模板感，减少「AI 味」。
