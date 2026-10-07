/* =========================================================
   陈强个人作品集：数据读取、渲染与轻量交互
   不依赖任何框架。修改内容时，优先编辑 data/portfolio.json。
   ========================================================= */

document.documentElement.classList.add("js");

const DATA_PATH = "data/portfolio.json";
const IMPORT_KEY = "cq-portfolio-workbuddy-import-v1";

const state = {
  baseData: null,
  data: null,
  importedBackup: null,
  noteFilter: "all",
};

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initAvatarFallback();
  initWorkBuddyImport();
  initSearch();
  setCurrentYear();

  try {
    state.baseData = await loadPortfolioData();
    state.importedBackup = readSavedBackup();
    state.data = state.importedBackup
      ? mergeWorkBuddyBackup(state.baseData, state.importedBackup)
      : structuredClone(state.baseData);

    renderAll();
    updateSyncStatus();
  } catch (error) {
    console.error("作品集数据读取失败：", error);
    renderDataError();
  }

  initRevealEffects();
});

/** 读取唯一公开内容源。GitHub Pages 会像普通文件一样提供这个 JSON。 */
async function loadPortfolioData() {
  const response = await fetch(DATA_PATH, { cache: "no-store" });
  if (!response.ok) throw new Error(`无法读取 ${DATA_PATH}`);

  const data = await response.json();
  if (!data || typeof data !== "object" || !data.profile) {
    throw new Error("portfolio.json 缺少 profile 字段");
  }
  return data;
}

/** 深浅主题：优先使用访客主动选择，否则跟随系统。 */
function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  toggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  const label = document.querySelector(".theme-label");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  if (label) label.textContent = isDark ? "浅色" : "深色";
  if (metaTheme) metaTheme.content = isDark ? "#171916" : "#f3f0e8";
}

/** 移动端菜单、锚点跳转与当前章节提示。 */
function initNavigation() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const links = document.querySelectorAll('.desktop-nav a, .mobile-menu a');

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    mobileMenu?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".desktop-nav a").forEach((link) => {
          link.classList.toggle("is-active", link.hash === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -58%", threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/** 阅读进度、吸顶导航状态和返回顶部按钮共用一次滚动监听。 */
function initScrollEffects() {
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".reading-progress span");
  const backToTop = document.querySelector("[data-back-to-top]");
  let ticking = false;

  const update = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

    header?.classList.toggle("is-scrolled", scrollTop > 18);
    backToTop?.classList.toggle("is-visible", scrollTop > window.innerHeight * 0.75);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  update();
}

/** 头像文件不存在时隐藏坏图标，显示设计好的 CQ 占位图。 */
function initAvatarFallback() {
  const avatar = document.querySelector("[data-avatar]");
  if (!avatar) return;
  avatar.addEventListener("error", () => avatar.classList.add("is-missing"));
  avatar.addEventListener("load", () => avatar.classList.remove("is-missing"));
  if (avatar.complete && avatar.naturalWidth === 0) avatar.classList.add("is-missing");
}

/** 只在元素进入视口时执行一次非常克制的淡入。 */
function initRevealEffects() {
  const items = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  items.forEach((item) => observer.observe(item));
}

function setCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(year);
  });
}

function renderAll() {
  renderProfile();
  renderRecentNotes();
  renderProjects();
  renderBooks();
  renderMedia();
  renderHobbyShelf();
  renderNotes();
  renderJourney();
  renderContacts();
}

function renderProfile() {
  const { profile } = state.data;
  setText("[data-profile-name]", profile.name);
  setText("[data-profile-english-name]", profile.englishName || "Qiang Chen");
  setText("[data-profile-role]", profile.role);
  setText("[data-profile-intro]", profile.intro);
  setText("[data-profile-slogan]", `“${profile.slogan}”`);
  setText("[data-profile-goal]", profile.goal);
  setText("[data-about-lead]", profile.aboutLead);
  setText("[data-about-body]", profile.aboutBody);
  setText("[data-education-school]", profile.education?.school);
  setText("[data-education-detail]", profile.education?.detail);

  const values = document.querySelector("[data-values-list]");
  if (values) {
    values.innerHTML = (profile.values || [])
      .map(
        (item, index) => `
          <li>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${escapeHTML(item.title)}</strong>
              <p>${escapeHTML(item.description)}</p>
            </div>
          </li>`,
      )
      .join("");
  }

  const interests = document.querySelector("[data-interests-list]");
  if (interests) {
    interests.innerHTML = (profile.interests || [])
      .map((interest) => `<span>${escapeHTML(interest)}</span>`)
      .join("");
  }

  document.title = `${profile.name}｜个人作品集`;
}

/** 首屏之后只展示最近三则，形成类似个人杂志的阅读入口。 */
function renderRecentNotes() {
  const list = document.querySelector("[data-recent-notes]");
  if (!list) return;

  const notes = [...(state.data.workbenchNotes || [])]
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .slice(0, 3);

  list.innerHTML = notes.length
    ? notes
        .map(
          (note) => `
            <a class="journal-row" href="#workbench">
              <time datetime="${escapeAttribute(note.date || "")}">${escapeHTML(formatNumericDate(note.date))}</time>
              <span class="journal-category">${escapeHTML(note.category || "思考")}</span>
              <div>
                <h3>${escapeHTML(note.title)}</h3>
                <p>${escapeHTML(note.summary || "")}</p>
              </div>
              <i aria-hidden="true">↗</i>
            </a>`,
        )
        .join("")
    : emptyState("新的学习与思考会从 WorkBuddy 同步到这里。");
}

function renderProjects() {
  const list = document.querySelector("[data-projects-list]");
  const projects = state.data.projects || [];
  if (!list) return;

  setText("[data-project-count]", `${String(projects.length).padStart(2, "0")} 个项目`);

  if (!projects.length) {
    list.innerHTML = emptyState("项目正在整理中，新的实践很快会出现在这里。");
    return;
  }

  list.innerHTML = projects
    .map((project, index) => {
      const links = (project.links || [])
        .filter((link) => safeURL(link.url))
        .map(
          (link) =>
            `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} ↗</a>`,
        )
        .join("");
      const visual = project.image && safeAssetURL(project.image)
        ? `<div class="project-visual has-image">
             <img src="${escapeAttribute(project.image)}" alt="${escapeAttribute(project.title)} 项目预览" loading="lazy" />
             <span>${escapeHTML(project.visualCaption || project.status || "PROJECT")}</span>
           </div>`
        : `<div class="project-visual visual-${index % 3}" aria-hidden="true">
             <b>${escapeHTML(project.visualLabel || String(index + 1).padStart(2, "0"))}</b>
             <span>${escapeHTML(project.visualCaption || "IDEA INTO PRACTICE")}</span>
             <i></i><i></i><i></i>
           </div>`;

      return `
        <article class="project-card">
          <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
          ${visual}
          <div class="project-title">
            <p>${escapeHTML(project.year || "进行中")} · ${escapeHTML(project.status || "PROJECT")}</p>
            <h3>${escapeHTML(project.title)}</h3>
          </div>
          <div class="project-copy">
            <p>${escapeHTML(project.description)}</p>
            <div class="project-tags">
              ${(project.technologies || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}
            </div>
            ${links ? `<div class="project-links">${links}</div>` : ""}
          </div>
          <span class="project-arrow" aria-hidden="true">↗</span>
        </article>`;
    })
    .join("");
}

function renderBooks() {
  const list = document.querySelector("[data-books-list]");
  const books = state.data.books || [];
  if (!list) return;

  setText("[data-books-count]", String(books.length).padStart(2, "0"));
  list.innerHTML = books.length
    ? books.map((book, index) => collectionItem(book, index, "作者")).join("")
    : emptyState("书单尚未公开。可在 JSON 中新增，或导入 WorkBuddy 读书笔记。");
}

function renderMedia() {
  const list = document.querySelector("[data-media-list]");
  const media = state.data.media || [];
  if (!list) return;

  setText("[data-media-count]", String(media.length).padStart(2, "0"));
  list.innerHTML = media.length
    ? media.map((item, index) => collectionItem(item, index, "创作者")).join("")
    : emptyState("影音清单正在生长。下一次心动，会被认真记录在这里。");
}

function renderHobbyShelf() {
  const shelf = document.querySelector("[data-hobby-shelf]");
  if (!shelf) return;

  const captions = {
    羽毛球: "速度、落点与专注",
    跑步: "用稳定节奏丈量时间",
    健身: "让身体成为长期伙伴",
    听音乐: "把情绪交给旋律",
    下棋: "在有限棋盘上理解选择",
    "探索 AI 工具": "把新技术变成真实能力",
  };
  const interests = state.data.profile?.interests || [];

  shelf.innerHTML = interests
    .map(
      (interest, index) => `
        <article class="hobby-card hobby-card-${index % 3}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <b aria-hidden="true">${escapeHTML(interest.slice(0, 1))}</b>
          <div><h4>${escapeHTML(interest)}</h4><p>${escapeHTML(captions[interest] || "保持好奇，持续探索")}</p></div>
        </article>`,
    )
    .join("");
}

function collectionItem(item, index, creatorLabel) {
  const creator = item.creator || item.author || "未填写";
  const note = item.note || `${creatorLabel}：${creator}`;
  return `
    <article class="collection-item">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHTML(item.title || item.name)}</strong>
        <p>${escapeHTML(note)}</p>
      </div>
      <small>${escapeHTML(item.type || item.status || creator)}</small>
    </article>`;
}

function renderNotes() {
  const list = document.querySelector("[data-notes-list]");
  if (!list) return;

  const allNotes = state.data.workbenchNotes || [];
  const notes = state.noteFilter === "all"
    ? allNotes
    : allNotes.filter((note) => note.category === state.noteFilter);

  setText("[data-note-count]", `${notes.length} 则记录`);
  list.innerHTML = notes.length
    ? notes
        .map(
          (note) => `
            <article class="note-card">
              <header>
                <span class="note-tag">${escapeHTML(note.category || "思考")}</span>
                <time datetime="${escapeAttribute(note.date || "")}">${escapeHTML(formatDate(note.date))}</time>
              </header>
              <h3>${escapeHTML(note.title)}</h3>
              <p>${escapeHTML(note.summary || "")}</p>
            </article>`,
        )
        .join("")
    : emptyState(state.noteFilter === "all" ? "暂无公开笔记。导入 WorkBuddy 备份后会在本机自动显示。" : `暂无“${state.noteFilter}”分类记录。`);
}

function renderJourney() {
  const list = document.querySelector("[data-journey-list]");
  if (!list) return;

  const journey = state.data.journey || [];
  list.innerHTML = journey.length
    ? journey
        .map(
          (item, index) => `
            <article class="timeline-item">
              <span class="timeline-dot" aria-hidden="true"></span>
              <div class="timeline-period">${escapeHTML(item.period || "")}</div>
              <div>
                <div class="timeline-status">${escapeHTML(item.status || String(index + 1).padStart(2, "0"))}</div>
                <h3>${escapeHTML(item.title || "")}</h3>
                <strong>${escapeHTML(item.subtitle || "")}</strong>
                <p>${escapeHTML(item.description || "")}</p>
              </div>
            </article>`,
        )
        .join("")
    : emptyState("履历正在整理中。");
}

function renderContacts() {
  const list = document.querySelector("[data-contacts-list]");
  if (!list) return;

  const contacts = state.data.contacts || [];
  list.innerHTML = contacts
    .map((contact) => {
      const url = safeURL(contact.url);
      const content = `
        <span>${escapeHTML(contact.label)}</span>
        <strong>${escapeHTML(contact.value || "待补充")}</strong>
        <i aria-hidden="true">${url ? "↗" : "—"}</i>`;

      return url
        ? `<a class="contact-item" href="${escapeAttribute(contact.url)}" ${contact.url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${content}</a>`
        : `<div class="contact-item is-placeholder">${content}</div>`;
    })
    .join("");
}

/**
 * WorkBuddy 互通层：
 * 1. 当前 V2.1 备份会读取 profile、data.entries.book 和成长记录；
 * 2. 未来若备份带 portfolio 字段，会优先合并完整书影音、项目和联系信息；
 * 3. 导入只保存在当前浏览器，不会上传到任何服务器。
 */
function initWorkBuddyImport() {
  const input = document.querySelector("[data-workbuddy-file]");
  const importButton = document.querySelector("[data-import-button]");
  const exportButton = document.querySelector("[data-export-public]");
  const clearButton = document.querySelector("[data-clear-import]");
  const filterButtons = document.querySelectorAll("[data-note-filter]");

  importButton?.addEventListener("click", () => input?.click());
  exportButton?.addEventListener("click", downloadPublicData);

  input?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const backup = JSON.parse(await file.text());
      validateWorkBuddyBackup(backup);
      localStorage.setItem(IMPORT_KEY, JSON.stringify(backup));
      state.importedBackup = backup;
      state.data = mergeWorkBuddyBackup(state.baseData, backup);
      renderAll();
      updateSyncStatus(file.name);
    } catch (error) {
      console.error(error);
      setText("[data-sync-status]", "导入失败：请选择 WorkBuddy 导出的完整 JSON 备份。数据未被修改。");
    }
  });

  clearButton?.addEventListener("click", () => {
    localStorage.removeItem(IMPORT_KEY);
    state.importedBackup = null;
    state.data = structuredClone(state.baseData);
    renderAll();
    updateSyncStatus();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.noteFilter = button.dataset.noteFilter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderNotes();
    });
  });
}

/**
 * 轻量全站搜索：全部索引在浏览器内生成，不上传关键词，也不依赖搜索服务。
 * 支持点击导航、ESC 关闭，以及常用的 Command/Ctrl + K 快捷键。
 */
function initSearch() {
  const overlay = document.querySelector("[data-search-overlay]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  const openButtons = document.querySelectorAll("[data-search-open]");
  const closeButton = document.querySelector("[data-search-close]");
  let lastFocused = null;

  if (!overlay || !input || !results) return;

  const open = () => {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("search-open");
    document.body.classList.remove("menu-open");
    document.querySelector("[data-mobile-menu]")?.classList.remove("is-open");
    document.querySelector("[data-menu-toggle]")?.setAttribute("aria-expanded", "false");
    renderSearchResults(input.value);
    window.requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    overlay.hidden = true;
    document.body.classList.remove("search-open");
    input.value = "";
    lastFocused?.focus?.();
  };

  openButtons.forEach((button) => button.addEventListener("click", open));
  closeButton?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  input.addEventListener("input", () => renderSearchResults(input.value));
  results.addEventListener("click", (event) => {
    const item = event.target.closest("[data-search-target]");
    if (!item) return;
    const target = document.querySelector(item.dataset.searchTarget);
    close();
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      overlay.hidden ? open() : close();
    } else if (event.key === "Escape" && !overlay.hidden) {
      close();
    }
  });
}

function renderSearchResults(query = "") {
  const container = document.querySelector("[data-search-results]");
  if (!container) return;

  const normalized = query.trim().toLowerCase();
  if (!state.data) {
    container.innerHTML = '<p class="search-empty">内容索引正在准备中…</p>';
    return;
  }

  if (!normalized) {
    container.innerHTML = `
      <div class="search-shortcuts">
        <button type="button" data-search-target="#journal"><span>最近文章</span><i>01</i></button>
        <button type="button" data-search-target="#projects"><span>核心项目</span><i>02</i></button>
        <button type="button" data-search-target="#reading"><span>书影音</span><i>03</i></button>
        <button type="button" data-search-target="#journey"><span>个人履历</span><i>04</i></button>
      </div>`;
    return;
  }

  const matches = buildSearchIndex()
    .filter((item) => `${item.title} ${item.summary} ${item.type}`.toLowerCase().includes(normalized))
    .slice(0, 12);

  container.innerHTML = matches.length
    ? matches
        .map(
          (item) => `
            <button class="search-result" type="button" data-search-target="${escapeAttribute(item.target)}">
              <span>${escapeHTML(item.type)}</span>
              <div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.summary)}</p></div>
              <i aria-hidden="true">↗</i>
            </button>`,
        )
        .join("")
    : `<p class="search-empty">没有找到“${escapeHTML(query.trim())}”。换一个更短的关键词试试。</p>`;
}

function buildSearchIndex() {
  const data = state.data;
  const items = [];

  (data.projects || []).forEach((project) => items.push({ type: "项目", title: project.title, summary: project.description, target: "#projects" }));
  (data.workbenchNotes || []).forEach((note) => items.push({ type: note.category || "笔记", title: note.title, summary: note.summary, target: "#workbench" }));
  (data.books || []).forEach((book) => items.push({ type: "书籍", title: book.title || book.name, summary: book.note || book.author || "", target: "#reading" }));
  (data.media || []).forEach((item) => items.push({ type: item.type || "影音", title: item.title || item.name, summary: item.note || item.creator || "", target: "#reading" }));
  (data.journey || []).forEach((item) => items.push({ type: "履历", title: item.title, summary: `${item.subtitle || ""} ${item.description || ""}`, target: "#journey" }));
  (data.profile?.interests || []).forEach((interest) => items.push({ type: "兴趣", title: interest, summary: "生活的侧页", target: "#about" }));
  return items;
}

function validateWorkBuddyBackup(backup) {
  const isCurrentBackup = backup && typeof backup === "object" && (backup.data?.entries || backup.profile);
  const isPortfolioBridge = backup && typeof backup.portfolio === "object";
  if (!isCurrentBackup && !isPortfolioBridge) {
    throw new Error("不是可识别的 WorkBuddy 备份");
  }
}

function readSavedBackup() {
  try {
    const saved = localStorage.getItem(IMPORT_KEY);
    if (!saved) return null;
    const backup = JSON.parse(saved);
    validateWorkBuddyBackup(backup);
    return backup;
  } catch {
    localStorage.removeItem(IMPORT_KEY);
    return null;
  }
}

function mergeWorkBuddyBackup(baseData, backup) {
  const merged = structuredClone(baseData);

  if (backup.portfolio && typeof backup.portfolio === "object") {
    Object.assign(merged, backup.portfolio);
    merged.profile = { ...baseData.profile, ...(backup.portfolio.profile || {}) };
  }

  if (backup.profile) {
    merged.profile = {
      ...merged.profile,
      name: backup.profile.name || merged.profile.name,
      role: backup.profile.identity || merged.profile.role,
      goal: backup.profile.goal || merged.profile.goal,
    };
  }

  const entries = backup.data?.entries || {};
  const importedBooks = extractBooks(entries.book || []);
  const importedNotes = extractNotes(entries);

  if (importedBooks.length) merged.books = dedupeBy([...(merged.books || []), ...importedBooks], "title");
  if (importedNotes.length) merged.workbenchNotes = dedupeBy([...(merged.workbenchNotes || []), ...importedNotes], "id");

  return merged;
}

function extractBooks(records) {
  return records
    .filter((record) => record?.name)
    .map((record) => ({
      title: String(record.name),
      author: "",
      status: record.chap || "阅读记录",
      note: record.note || (record.chap ? `阅读进度：${record.chap}` : "来自 WorkBuddy"),
    }));
}

function extractNotes(entries) {
  const categoryMap = {
    math: "学习",
    gpa: "学习",
    book: "思考",
    dailyrev: "思考",
    node: "思考",
    econ: "研究",
    fin: "研究",
    paper: "研究",
    research: "研究",
    devlog: "学习",
    practice: "思考",
  };

  const notes = [];
  Object.entries(entries).forEach(([section, records]) => {
    if (!categoryMap[section] || !Array.isArray(records)) return;

    records.forEach((record, index) => {
      const summary = firstText(record, ["note", "content", "ref", "reflection", "result", "chap"]);
      const title = firstText(record, ["title", "name", "task", "topic", "chap", "type"]);
      if (!title && !summary) return;

      notes.push({
        id: `workbuddy-${section}-${record._id || record._ts || index}`,
        category: categoryMap[section],
        date: record.date || "",
        title: title || `${categoryMap[section]}记录`,
        summary: summary || "来自 WorkBuddy 的成长记录。",
      });
    });
  });

  return notes
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 24);
}

function updateSyncStatus(fileName = "") {
  const clearButton = document.querySelector("[data-clear-import]");
  const exportButton = document.querySelector("[data-export-public]");
  if (clearButton) clearButton.hidden = !state.importedBackup;
  if (exportButton) exportButton.hidden = !state.importedBackup;

  if (!state.importedBackup) {
    setText("[data-sync-status]", "当前展示：仓库公开数据 · 修改 data/portfolio.json 后重新提交即可公开更新");
    return;
  }

  const exportedAt = state.importedBackup.exportedAt
    ? new Date(state.importedBackup.exportedAt).toLocaleString("zh-CN", { hour12: false })
    : "时间未知";
  const source = fileName ? `“${fileName}”` : "本机已保存的 WorkBuddy 备份";
  setText("[data-sync-status]", `当前展示：${source} · 导出时间 ${exportedAt} · 数据仅保存在本机`);
}

/** 把当前已预览的公开层数据下载下来，便于在 GitHub 网页中直接替换。 */
function downloadPublicData() {
  const confirmed = window.confirm(
    "将下载当前页面正在展示的资料，其中可能包含从 WorkBuddy 提取的笔记摘要。请先确认这些内容适合公开，再上传到 GitHub。",
  );
  if (!confirmed) return;

  const publicData = {
    ...state.data,
    lastUpdated: new Date().toISOString().slice(0, 10),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(publicData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio.json";
  link.click();
  URL.revokeObjectURL(url);
  setText("[data-sync-status]", "已下载 portfolio.json。确认内容适合公开后，在 GitHub 中替换 data/portfolio.json 即可。 ");
}

function renderDataError() {
  const message = "数据暂时无法读取。请通过本地服务器或 GitHub Pages 打开网站，不要直接双击 index.html。";
  ["[data-recent-notes]", "[data-projects-list]", "[data-books-list]", "[data-media-list]", "[data-notes-list]", "[data-journey-list]", "[data-contacts-list]"].forEach(
    (selector) => {
      const target = document.querySelector(selector);
      if (target) target.innerHTML = emptyState(message);
    },
  );
  setText("[data-sync-status]", message);
}

function emptyState(message) {
  return `<div class="empty-card"><span>·</span><p>${escapeHTML(message)}</p></div>`;
}

function setText(selector, value) {
  if (value === undefined || value === null) return;
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = String(value);
  });
}

function firstText(object, keys) {
  for (const key of keys) {
    const value = object?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function dedupeBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = String(item?.[key] || "").trim().toLowerCase();
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function formatDate(date) {
  if (!date) return "近期";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(parsed);
}

function formatNumericDate(date) {
  if (!date) return "近期";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return [parsed.getFullYear(), String(parsed.getMonth() + 1).padStart(2, "0"), String(parsed.getDate()).padStart(2, "0")].join(".");
}

function safeURL(url) {
  if (!url || typeof url !== "string") return false;
  return /^(https?:\/\/|mailto:)/i.test(url.trim());
}

function safeAssetURL(url) {
  if (!url || typeof url !== "string") return false;
  return /^(assets\/|https?:\/\/)/i.test(url.trim());
}

function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );
}

function escapeAttribute(value = "") {
  return escapeHTML(value).replace(/`/g, "&#96;");
}
