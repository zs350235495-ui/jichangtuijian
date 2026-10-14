# 机场图鉴 (现代化博客与评测平台)

这是一个完全参照 [机场图鉴 (jichangtujian.vip)](https://jichangtujian.vip/rankings/) 原站视觉风格与页面布局搭建的**现代化博客与评测网站框架**。

所有页面均已剔除原站商业推广内容，保留了 100% 相同的设计美学、组件结构与交互逻辑，开箱即用。

---

## 🎨 视觉与设计特色

- **纸实质感温润配色**：
  - 背景色：`#f7f5f1`（Warm Paper，自然护眼的温润纸张感）
  - 卡片与面板：`#fffdf8`（Surface，高雅暖白）
  - 文字主色：`#1c1b19`（Ink，深炭墨黑）
  - 品牌强调色：`#a8532f`（Terracotta，赤陶暖棕）
  - 辅助强调色：`#c7935b`（Warm Gold，赭石金）
- **中文字体排版调优**：专为 Google Fonts `Noto Sans SC`（思源黑体）定制字重（400/500/600/700）与阅读行距
- **全端自适应响应式**：
  - 桌面端：吸顶导航栏、二级资源下拉菜单、文章右侧自适应目录（TOC）
  - 移动端：原生无依赖抽屉菜单、自适应横向滑动表格、单列流畅排版
- **丰富的评测与技术组件**：
  - 优惠码一键复制按钮（带切换“已复制”提示与动效图标）
  - 测速报告看板（深色高对比终端质感）
  - 服务与 AI 解锁矩阵（带状态图标与彩色徽章）
  - 参数对比与价格套餐表（固定左列、横向可滑动）
  - 文章目录（TOC）随滚动自动高亮当前阅读小节（Scrollspy）
  - 折叠手风琴 FAQ 问答模块
  - 页面右下角平滑“返回顶部”浮钮

---

## 📂 项目结构

```text
新建文件夹/
├── assets/
│   ├── favicon.svg          # 网站图标 (矢量 SVG)
│   └── logo-mark.svg        # 网站 Logo 矢量图标
├── css/
│   └── style.css            # 完整样式表 (包含原站所有布局、颜色与排版规则)
├── js/
│   └── main.js              # 核心交互逻辑 (目录高亮、分类筛选、复制代码、回到顶部)
├── index.html               # 博客门户首页 (推荐文章网格 + 精选卡片 + FAQ + CTA)
├── blog.html                # 博客归档页 (分类筛选药丸标签 + 实时关键词检索 + 卡片网格)
├── post.html                # 文章详情页模板 (面包屑 + 标签 + 侧边目录 + 完整排版元素)
├── rankings.html            # 评测排行榜页 (1:1 还原原站排行榜卡片、测速卡与套餐表)
├── about.html               # 关于页面 (理念、测试方法论、隐私协议与免责声明)
├── package.json             # 项目配置文件 (支持 Vite 开发服务器)
└── README.md                # 框架使用与开发说明文档
```

---

## 🚀 启动与使用方式

### 方式 1：使用开发服务器运行（推荐）

项目已配置好 Vite，支持秒级热重载：

```bash
# 启动本地开发服务器
npm run dev
```

启动后在浏览器中打开 `http://localhost:5173/` 即可实时预览。

### 方式 2：直接打开静态网页

本框架为标准、现代的纯静态 HTML5 + CSS + JS 架构，你也可以直接双击 `index.html` 在任何现代浏览器中打开，或者使用任意静态服务器（如 Python `python -m http.server`、VSCode Live Server 等）运行。

### 方式 3：部署到线上

可以无缝零配置一键部署至：
- **Cloudflare Pages**
- **Vercel**
- **GitHub Pages**
- **Netlify**
- **Nginx / Caddy 静态托管**

构建生产包命令：
```bash
npm run build
```

---

## 📝 如何添加与定制内容

### 1. 撰写新文章

直接复制 `post.html`，按需替换以下模块内容：
1. `<title>` 和 `<meta name="description">`
2. 面包屑导航与文章分类标签
3. `<h1>` 文章主标题与日期、预计阅读时间
4. `.article-content` 内的正文内容（支持二级/三级标题、段落、引用、表格、代码块等）
5. 右侧 `nav[aria-label="文章目录"]` 中的锚点链接，与正文中的 `id` 保持一致即可自动实现滚动高亮

### 2. 修改网站品牌与主色调

打开 `css/style.css`，在文件顶部修改 CSS 变量：

```css
:root {
  --color-paper: #f7f5f1;        /* 页面底色 */
  --color-surface: #fffdf8;      /* 卡片背景色 */
  --color-ink: #1c1b19;          /* 文字主色 */
  --color-accent: #a8532f;       /* 品牌主题强调色 */
  --color-accent-light: #c7935b; /* 辅助金色 */
}
```

替换 `assets/logo-mark.svg` 与 `assets/favicon.svg` 即可更换网站 Logo。
