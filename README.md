# 陈强的个人作品集

一个可以长期维护的个人数字名片，用于求职、创业、学术交流和日常自我表达。

网站使用纯 HTML + CSS + 原生 JavaScript 编写，没有框架、没有安装依赖、没有构建步骤。内容集中存放在一个 JSON 文件中，适合直接托管到 GitHub Pages。

在线访问：[https://giao4751257250-sudo.github.io/](https://giao4751257250-sudo.github.io/)

GitHub 仓库：[giao4751257250-sudo/giao4751257250-sudo.github.io](https://github.com/giao4751257250-sudo/giao4751257250-sudo.github.io)

## 现在已经具备

- 简约、克制的学术刊物式视觉，黑白为主，使用低饱和砖红与鼠尾草绿作点缀；
- 首页 Hero、关于我、项目、阅读、影音、WorkBuddy 笔记、联系方式等完整模块；
- 首屏后的“最近写下”、个人履历时间线与全站即时搜索；
- 项目视觉预览与六项兴趣收藏架，让内容更接近完整个人杂志；
- 手机、平板与电脑响应式布局；
- 浅色 / 深色主题切换，并记住访客选择；
- 平滑滚动、阅读进度、当前章节提示与少量克制的淡入反馈；
- 所有公开内容由 [`data/portfolio.json`](data/portfolio.json) 驱动；
- 可直接导入 WorkBuddy V2.1 导出的完整 JSON 备份；
- 无第三方运行依赖，GitHub Pages 可以直接发布；
- 基础 SEO、无障碍键盘操作、减少动画偏好与打印样式。

## 文件结构

```text
portfolio-site/
├── index.html                  # 页面结构，一般不需要修改
├── .nojekyll                   # 告诉 GitHub Pages 原样发布静态文件
├── assets/
│   ├── css/style.css           # 排版、颜色、响应式布局
│   ├── js/app.js               # JSON 渲染、主题、菜单、数据导入
│   └── images/
│       ├── avatar.jpg           # 当前微信头像
│       └── AVATAR_README.txt    # 头像替换说明
├── data/
│   └── portfolio.json          # 你最常修改的唯一内容文件
├── tests/
│   └── verify.mjs              # 自动检查 JSON、路径和页面结构
├── DEPLOYMENT_GUIDE.md         # 全程点击操作的 GitHub Pages 教程
├── LEARNING_NOTES.md           # 面向非技术读者的项目学习启示
└── INITIAL_COMMIT.txt           # 推荐的第一次提交说明
```

## 三分钟完成个性化

### 1. 换头像

当前版本已经放入微信头像，并同时用于首页照片和浏览器标签图标。以后想更换时，把新头像保存为 `avatar.jpg`，放进 `assets/images/` 文件夹并覆盖原文件。

最终路径必须是：

```text
assets/images/avatar.jpg
```

文件名必须完全一致，包括小写字母和 `.jpg`。替换头像不需要改 HTML、CSS 或 JavaScript。

### 2. 修改邮箱和 GitHub

当前版本已经写入邮箱 `giao4751257250@163.com` 和 GitHub `giao4751257250-sudo`。以后需要更换时，打开 `data/portfolio.json`，找到 `contacts`：

```json
"contacts": [
  {
    "label": "Email",
      "value": "giao4751257250@163.com",
      "url": "mailto:giao4751257250@163.com"
  },
  {
    "label": "GitHub",
      "value": "github.com/giao4751257250-sudo",
      "url": "https://github.com/giao4751257250-sudo"
  }
]
```

现在的占位文字不会被错误链接打开；填写 `url` 后，网页会自动变成可点击链接。

### 3. 填项目链接

仍在 `data/portfolio.json` 中找到 `projects`。每个项目都可以设置多个链接：

```json
"links": [
  {
    "label": "项目主页",
    "url": "https://你的项目网址"
  },
  {
    "label": "源代码",
    "url": "https://github.com/你的用户名/仓库名"
  }
]
```

链接暂时没有准备好时，让 `url` 保持空字符串即可，页面会自动隐藏它。

## 只改 JSON，新增内容

### 新增一个项目

在 `projects` 数组最后一个项目的 `}` 后面加英文逗号，再粘贴：

```json
{
  "id": "项目英文短名",
  "title": "项目名称",
  "year": "2026",
  "status": "进行中",
  "description": "一句话讲清问题、做法和价值。",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "links": [
    { "label": "项目主页", "url": "" },
    { "label": "源代码", "url": "" }
  ]
}
```

### 新增一本书

把下面内容放进 `books` 的方括号中：

```json
{
  "title": "书名",
  "author": "作者",
  "status": "已读",
  "note": "为什么喜欢它，或最重要的一点收获。"
}
```

### 新增电影、专辑或音乐

把下面内容放进 `media` 的方括号中：

```json
{
  "title": "作品名",
  "creator": "导演 / 音乐人",
  "type": "电影 / 专辑 / 单曲",
  "note": "一句简短推荐语。"
}
```

### 新增一则工作台笔记

把下面内容放进 `workbenchNotes` 的方括号中：

```json
{
  "id": "note-不能重复的英文短名",
  "category": "学习",
  "date": "2026-10-07",
  "title": "笔记标题",
  "summary": "对外展示的简短摘要。"
}
```

`category` 建议只使用“学习”“思考”“研究”三种，这样网页上的筛选按钮可以正确工作。

> JSON 最常见的错误是漏掉英文逗号、使用中文引号，或在最后一项后多加逗号。上传前可用仓库内的检查脚本验证。

## WorkBuddy 数据互通

这个网站提供两种互通方式。

### 方式 A：在自己设备上立即查看

1. 打开 WorkBuddy → 设置 → 备份与恢复；
2. 点击“导出完整备份”；
3. 打开作品集网站，滚动到“工作台”板块；
4. 点击“导入 WorkBuddy JSON”，选择刚下载的文件；
5. 网站会读取称呼、身份、目标、读书笔记和学习 / 思考 / 研究记录；
6. 导入结果只保存在当前浏览器，不会上传到服务器；
7. 确认页面上的内容都适合公开后，可点击“下载公开数据副本”；
8. 用下载得到的 `portfolio.json` 替换 GitHub 仓库中的 `data/portfolio.json`，即可让访客看到；
9. 点击“恢复公开数据”可撤销本机导入。

### 方式 B：让所有访客看到公开内容

编辑并提交 `data/portfolio.json`。它是作品集的公开内容源；WorkBuddy 导出的备份则通过网页上的导入按钮被作品集识别。为了避免覆盖工作台中的私人数据，请不要把 `portfolio.json` 反向导入 WorkBuddy。

必须理解一个静态网站的边界：GitHub Pages 没有数据库，也不能越过浏览器安全限制，自动读取另一个网址或另一台设备的本地数据。因此，本项目没有伪装成“实时云同步”。它采用的是安全、透明的 JSON 桥接：

- 私人预览：在网页里导入 WorkBuddy 备份；
- 对外发布：更新 `data/portfolio.json` 并在 GitHub 点击提交；
- 头像：替换 `assets/images/avatar.jpg`；
- 邮箱、GitHub、项目链接只需在 JSON 中补一次。

这样不需要服务器账号、数据库费用或 API 密钥，也不会意外公开你的私人待办和日程。

## 本地预览

不建议直接双击 `index.html`，因为浏览器通常会禁止网页读取本地 JSON。

最适合小白的方法：

1. 用 VS Code 打开整个文件夹；
2. 在扩展商店安装 **Live Server**；
3. 右键 `index.html`；
4. 点击 **Open with Live Server**。

如果电脑已经有 Python，也可以在这个文件夹中运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 发布到 GitHub Pages

当前版本已经部署到 GitHub Pages，公开网址为：

```text
https://giao4751257250-sudo.github.io/
```

完全不写命令、只需点击的图文式步骤见 [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)。

简要流程是：新建公开仓库 → 上传本文件夹里的所有内容 → Settings → Pages → 选择 `main` 和 `/ (root)` → Save。

## 自动检查

如果电脑安装了 Node.js，在项目文件夹运行：

```bash
node tests/verify.mjs
```

它会检查：

- JSON 是否能正确解析；
- 必需数据字段是否存在；
- 页面内导航是否都能找到目标章节；
- CSS、JavaScript 和 JSON 文件路径是否正确；
- 项目和笔记 ID 是否重复；
- 外部链接是否使用安全协议。

## 设计调研与取舍

本项目在设计前参考了以下开源作品集的公开思路，但页面与代码均为本项目重新设计、独立实现：

- [al-folio](https://github.com/alshedivat/al-folio)：借鉴学术主页清晰的信息层级、研究内容优先和克制留白；
- [academicpages](https://github.com/academicpages/academicpages.github.io)：借鉴“资料与页面分离”的长期维护思想；
- [Personal Website Template](https://github.com/korbinianmoller/personal_website_template)：借鉴单页结构、吸顶导航、零构建部署和响应式组织；
- [Portfolio Template](https://github.com/diyoriko/portfolio-template)：借鉴深浅主题、细微滚动反馈和无障碍偏好；
- [Easy Portfolio Website Template](https://github.com/badhon495/easy-portfolio-website-template)：借鉴语义化 HTML、键盘可用性与 SEO 基础配置。
- [Kaifeng Li 的个人主页](https://kklullaby.github.io/)：借鉴“最近文章 → 项目 → 兴趣收藏 → 履历”的内容节奏、项目视觉预览和全站搜索入口；未复制其角色形象、手绘插图或代码。

没有复制上述模板的页面代码或视觉成品，只提取了高价值原则，再结合本项目的“经济学刊物 + 人文笔记”定位重新组合。

## 技术说明

- HTML5：语义结构与无障碍标签；
- CSS3：变量、Grid、Flexbox、响应式断点与主题；
- 原生 JavaScript：读取 JSON、动态渲染、主题记忆、移动菜单、筛选和 WorkBuddy 导入；
- localStorage：只保存主题选择和本机导入的 WorkBuddy 备份；
- GitHub Pages：免费静态托管；
- 无 Cookie、无追踪脚本、无第三方运行依赖。

## 初次提交建议

提交标题已经单独保存在 [`INITIAL_COMMIT.txt`](INITIAL_COMMIT.txt)：

```text
feat: 升级个人作品集并完善文章、搜索与 WorkBuddy 数据互通
```

## 隐私提醒

上传 GitHub 的公开仓库内容会被任何人看到。不要把私人待办、日程、电话号码、家庭地址、证件信息、API Key 或完整 WorkBuddy 私人备份直接提交到仓库。

建议只把适合公开展示的摘要写入 `data/portfolio.json`。
