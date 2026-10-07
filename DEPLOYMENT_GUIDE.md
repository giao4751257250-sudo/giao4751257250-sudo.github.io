# GitHub Pages 小白部署教程

这份教程不要求你写代码，也不要求打开终端。照着页面点击即可。

## 发布前准备

先完成三件小事：

1. 把微信头像命名为 `avatar.jpg`，放入 `assets/images/`；
2. 打开 `data/portfolio.json`，确认现有邮箱、GitHub 地址和项目链接；
3. 确认整个 `portfolio-site` 文件夹完整，不要只上传 `index.html`。

如果暂时没有联系方式或项目链接，也可以先发布，网页会显示“待补充”或自动隐藏空链接。

## 第一步：注册或登录 GitHub

1. 打开 [GitHub](https://github.com/)；
2. 已有账号就点击右上角 **Sign in**；
3. 没有账号就点击 **Sign up**，按页面提示完成注册和邮箱验证。

## 第二步：新建仓库

1. 登录后，点击页面右上角的 **+**；
2. 点击 **New repository**；
3. 在 **Repository name** 中填写仓库名，推荐：`portfolio`；
4. 在说明中可填写：`陈强的个人作品集与数字名片`；
5. 选择 **Public**。GitHub Pages 免费版最省事的方式是公开仓库；
6. “Add a README file”等选项都不要勾选，因为源码里已经有 README；
7. 点击绿色按钮 **Create repository**。

## 第三步：上传全部文件

进入刚创建的空仓库后：

1. 点击页面中间的 **uploading an existing file**；
2. 打开电脑里的 `portfolio-site` 文件夹；
3. 选中文件夹内的所有文件和文件夹；
4. 把它们拖到 GitHub 上传区域；
5. 等待所有文件旁边都出现上传完成提示；
6. 页面下方的提交标题填写：

   ```text
   feat: 升级个人作品集并完善文章、搜索与 WorkBuddy 数据互通
   ```

7. 描述可以填写：

   ```text
   完成响应式个人主页、深浅主题、项目与书影音模块，并支持 WorkBuddy JSON 数据导入。
   ```

8. 点击绿色按钮 **Commit changes**。

检查仓库首页：你应该能看到 `index.html`、`assets`、`data`、`README.md` 等内容。若只看到一个 `portfolio-site` 外层文件夹，说明多上传了一层；GitHub Pages 的根目录需要直接看到 `index.html`。

## 第四步：开启 GitHub Pages

1. 在仓库上方点击 **Settings**；
2. 左侧菜单向下找到 **Pages**；
3. 在 **Build and deployment** 下找到 **Source**；
4. 选择 **Deploy from a branch**；
5. 在 **Branch** 一栏选择 `main`；
6. 右侧文件夹选择 `/ (root)`；
7. 点击 **Save**。

页面上方稍后会显示类似地址：

```text
https://你的GitHub用户名.github.io/portfolio/
```

第一次发布通常需要一两分钟。看到 **Your site is live at...** 后，点击地址即可打开。

## 第五步：把网址放到 GitHub 主页

1. 回到仓库首页；
2. 在右侧 **About** 区域点击齿轮图标；
3. 在 **Website** 中粘贴刚才的 Pages 地址；
4. 勾选适合的 Topics，例如 `portfolio`、`personal-website`、`github-pages`；
5. 点击 **Save changes**。

## 以后如何更新内容

以修改一句简介为例：

1. 进入 GitHub 仓库；
2. 点击 `data` 文件夹；
3. 点击 `portfolio.json`；
4. 点击右上角铅笔图标 **Edit this file**；
5. 修改引号里的文字，不要删除英文引号和逗号；
6. 点击右上角或页面底部的 **Commit changes...**；
7. 提交标题可以写：`content: 更新个人简介`；
8. 再点击绿色 **Commit changes** 确认。

GitHub Pages 会自动重新发布。通常等几十秒到两分钟，刷新网站即可看到变化。

## 以后如何替换头像

1. 在仓库中打开 `assets/images`；
2. 如果已有 `avatar.jpg`，点击它，再点击右上角删除图标并确认提交；
3. 返回 `assets/images`，点击 **Add file → Upload files**；
4. 上传新的 `avatar.jpg`；
5. 点击 **Commit changes**。

为了避免缓存导致旧头像暂时不变，刷新时可按：

- Mac：`Command + Shift + R`
- Windows：`Ctrl + F5`

## 如何公开 WorkBuddy 中的精选内容

WorkBuddy 的完整备份可能包含私人日程和待办，不建议直接上传到公开仓库。

安全做法：

1. 在 WorkBuddy 中导出完整 JSON；
2. 在自己的作品集网页中点击“导入 WorkBuddy JSON”，先检查展示效果；
3. 检查所有显示的书籍和笔记，确认它们适合公开；
4. 点击“下载公开数据副本”，浏览器会得到新的 `portfolio.json`；
5. 在 GitHub 中打开 `data` 文件夹，用这个新文件替换原来的 `portfolio.json`；
6. 点击 **Commit changes** 完成公开更新。

这样既能复用 WorkBuddy 数据，又不会把私人内容意外公开。

## 常见问题

### 网站显示 404

先检查：

- Pages 是否选择了 `main` 和 `/ (root)`；
- 仓库根目录是否能直接看到 `index.html`；
- 保存设置后是否等待了至少两分钟；
- 地址末尾是否包含仓库名，例如 `/portfolio/`。

### 页面有框架，但项目和文字不显示

通常是 `data/portfolio.json` 格式错误。最常见的原因是：

- 两项内容之间少了英文逗号 `,`；
- 使用了中文引号 `“”` 代替英文引号 `""`；
- 最后一项后多了逗号；
- 不小心删除了方括号或花括号。

可把 JSON 内容粘贴到 [JSONLint](https://jsonlint.com/) 检查。注意：如果数据含有隐私，不要粘贴到陌生网站。

### 头像没有显示

请确认完整路径与文件名是：

```text
assets/images/avatar.jpg
```

GitHub 区分大小写，`Avatar.jpg`、`avatar.JPG` 都不是同一个文件名。

### 修改后网站还是旧内容

先等一两分钟，再强制刷新浏览器。也可以到仓库的 **Actions** 标签查看 Pages 是否仍在发布。

### 能不能用自己的域名

可以。在仓库 **Settings → Pages → Custom domain** 中填写域名。但域名购买和 DNS 配置涉及额外步骤，建议先用免费的 GitHub Pages 地址稳定运行，再配置自定义域名。

## 发布检查清单

- [ ] 手机和电脑都打开过一次；
- [ ] 浅色与深色主题都正常；
- [ ] 头像清晰且裁切合适；
- [ ] 邮箱可以打开写信窗口；
- [ ] GitHub 和项目链接都能正常访问；
- [ ] 没有上传私人备份、密码或 API Key；
- [ ] 所有准备公开的文字都检查过错别字。
