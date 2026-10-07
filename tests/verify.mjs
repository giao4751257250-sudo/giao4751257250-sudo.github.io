/**
 * 零依赖静态检查：运行 `node tests/verify.mjs`。
 * 这里只读文件，不会修改任何内容。
 */

import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
const css = await readFile(resolve(projectRoot, "assets/css/style.css"), "utf8");
const javascript = await readFile(resolve(projectRoot, "assets/js/app.js"), "utf8");
const dataText = await readFile(resolve(projectRoot, "data/portfolio.json"), "utf8");

let data;
try {
  data = JSON.parse(dataText);
} catch (error) {
  errors.push(`portfolio.json 不是有效 JSON：${error.message}`);
}

const requiredFiles = [
  "index.html",
  "assets/css/style.css",
  "assets/js/app.js",
  "assets/images/avatar.jpg",
  "data/portfolio.json",
  "README.md",
  "DEPLOYMENT_GUIDE.md",
  "LEARNING_NOTES.md",
  "INITIAL_COMMIT.txt",
];

for (const file of requiredFiles) {
  try {
    await access(resolve(projectRoot, file), constants.R_OK);
  } catch {
    errors.push(`缺少必需文件：${file}`);
  }
}

// 检查页面锚点是否都有真实目标。
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const anchor of anchors) {
  if (!ids.has(anchor)) errors.push(`页面链接 #${anchor} 找不到对应 id`);
}

// GitHub 项目页需要相对路径，避免误跳到域名根目录。
for (const match of html.matchAll(/(?:src|href)="(\/[^/"][^"]*)"/g)) {
  errors.push(`请把根路径改成相对路径：${match[1]}`);
}

if (data) {
  const requiredTopLevel = ["profile", "projects", "books", "media", "workbenchNotes", "journey", "contacts"];
  for (const key of requiredTopLevel) {
    if (!(key in data)) errors.push(`portfolio.json 缺少顶层字段：${key}`);
  }

  if (!data.profile?.name) errors.push("profile.name 不能为空");
  if (!Array.isArray(data.profile?.interests)) errors.push("profile.interests 必须是数组");

  checkUnique(data.projects || [], "id", "项目");
  checkUnique(data.workbenchNotes || [], "id", "笔记");

  for (const project of data.projects || []) {
    for (const link of project.links || []) checkPublicURL(link.url, `项目“${project.title}”`);
    if (project.image) {
      try {
        await access(resolve(projectRoot, project.image), constants.R_OK);
      } catch {
        errors.push(`项目“${project.title}”的预览图不存在：${project.image}`);
      }
    }
  }
  for (const contact of data.contacts || []) checkPublicURL(contact.url, `联系方式“${contact.label}”`);
}

if (!css.includes("@media (max-width: 720px)")) errors.push("CSS 缺少手机端断点");
if (!css.includes("[data-theme=\"dark\"]")) errors.push("CSS 缺少深色主题变量");
if (!javascript.includes("fetch(DATA_PATH")) errors.push("JavaScript 未读取 JSON 数据源");
if (!javascript.includes("mergeWorkBuddyBackup")) errors.push("JavaScript 缺少 WorkBuddy 互通层");
if (!javascript.includes("buildSearchIndex")) errors.push("JavaScript 缺少全站搜索索引");

function checkUnique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item?.[key];
    if (!value) {
      errors.push(`${label}缺少 ${key}`);
    } else if (seen.has(value)) {
      errors.push(`${label} ${key} 重复：${value}`);
    }
    seen.add(value);
  }
}

function checkPublicURL(url, context) {
  if (!url) return;
  if (!/^(https?:\/\/|mailto:)/i.test(url)) errors.push(`${context}使用了不安全或无效链接：${url}`);
}

if (errors.length) {
  console.error("\n检查未通过：\n");
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exitCode = 1;
} else {
  console.log("✓ 检查通过：JSON、页面结构、资源路径和互通逻辑均正常。\n");
  console.log(`  项目：${data.projects.length} 个`);
  console.log(`  书籍：${data.books.length} 本`);
  console.log(`  影音：${data.media.length} 项`);
  console.log(`  公开笔记：${data.workbenchNotes.length} 则`);
}
