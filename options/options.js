const DEFAULTS = {
  floatingButtonEnabled: true,
  floatingPosition: { right: 24, bottom: 120 },
  showNotification: true,
  notificationDuration: 2000,
  appendBlankLines: true,
  includeStoreSource: true,
  websites: { pchome: true, momo: true, shopee: true, yahoo: true, books: true, eslite: true, etmall: true, coupang: true, trplus: true, ruten: true }
};
const WEBSITE_KEYS = ["pchome", "momo", "shopee", "yahoo", "books", "eslite", "etmall", "coupang", "trplus", "ruten"];
const WEBSITE_NAMES = { pchome: "websitePchome", momo: "websiteMomo", shopee: "websiteShopee", yahoo: "websiteYahoo", books: "websiteBooks", eslite: "websiteEslite", etmall: "websiteEtmall", coupang: "websiteCoupang", trplus: "websiteTrplus", ruten: "websiteRuten" };
const $ = (id) => document.getElementById(id);
let current = structuredClone(DEFAULTS);
let saveTimer;

function t(key, fallback = key) { return chrome.i18n.getMessage(key) || fallback; }
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    const value = t(key, node.textContent);
    if (value) node.textContent = value;
  });
  document.documentElement.lang = chrome.i18n.getUILanguage() || "en";
}
function showSaved() {
  const node = $("savedMessage");
  node.textContent = t("settingsSaved", "Settings saved");
  node.classList.add("show");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => node.classList.remove("show"), 1300);
}
async function save(patch) {
  current = { ...current, ...patch };
  await chrome.storage.local.set(patch);
  showSaved();
}
function renderWebsites() {
  const container = $("websiteList");
  container.replaceChildren();
  for (const id of WEBSITE_KEYS) {
    const row = document.createElement("div");
    row.className = "website-item";
    const name = document.createElement("span");
    name.className = "website-name";
    name.textContent = t(WEBSITE_NAMES[id], id);
    const label = document.createElement("label");
    label.className = "switch";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = current.websites[id] !== false;
    input.setAttribute("aria-label", `${t(WEBSITE_NAMES[id], id)} enabled`);
    const slider = document.createElement("span");
    input.addEventListener("change", async () => {
      current.websites[id] = input.checked;
      await save({ websites: { ...current.websites } });
    });
    label.append(input, slider);
    row.append(name, label);
    container.append(row);
  }
}

async function init() {
  applyI18n();
  const saved = await chrome.storage.local.get(null);
  current = { ...DEFAULTS, ...saved, websites: { ...DEFAULTS.websites, ...(saved.websites || {}) } };
  $("floatingEnabled").checked = current.floatingButtonEnabled;
  $("showNotification").checked = current.showNotification;
  $("notificationDuration").value = String(current.notificationDuration);
  $("appendBlankLines").checked = current.appendBlankLines !== false;
  $("includeStoreSource").checked = current.includeStoreSource !== false;
  $("version").textContent = chrome.runtime.getManifest().version;
  $("footerVersion").textContent = chrome.runtime.getManifest().version;
  renderWebsites();

  $("floatingEnabled").addEventListener("change", e => save({ floatingButtonEnabled: e.target.checked }));
  $("showNotification").addEventListener("change", e => save({ showNotification: e.target.checked }));
  $("notificationDuration").addEventListener("change", e => save({ notificationDuration: Number(e.target.value) }));
  $("appendBlankLines").addEventListener("change", e => save({ appendBlankLines: e.target.checked }));
  $("includeStoreSource").addEventListener("change", e => save({ includeStoreSource: e.target.checked }));
  $("resetPosition").addEventListener("click", async () => {
    current.floatingPosition = { ...DEFAULTS.floatingPosition };
    await save({ floatingPosition: { ...DEFAULTS.floatingPosition } });
  });
}
init();
