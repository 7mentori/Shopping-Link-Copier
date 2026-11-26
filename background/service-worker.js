const DEFAULTS = {
  floatingButtonEnabled: true,
  floatingPosition: { right: 24, bottom: 120 },
  showNotification: true,
  notificationDuration: 2000,
  appendBlankLines: true,
  includeStoreSource: true,
  websites: { pchome: true, momo: true, shopee: true, yahoo: true, books: true, eslite: true, etmall: true, coupang: true, trplus: true, ruten: true }
};

chrome.runtime.onInstalled.addListener(async (details) => {
  const saved = await chrome.storage.local.get(null);
  const migrated = { ...saved };
  // Apply the new copy-format defaults only once to existing installations.
  // The migration marker prevents future updates from overwriting user preferences.
  if (!saved.copyFormatDefaultsMigrated) {
    if (details.reason === "update") {
      migrated.appendBlankLines = true;
      migrated.includeStoreSource = true;
    }
    migrated.copyFormatDefaultsMigrated = true;
  }
  await chrome.storage.local.set({
    ...DEFAULTS,
    ...migrated,
    websites: { ...DEFAULTS.websites, ...(saved.websites || {}) }
  });
});

async function copyInTab(tab) {
  if (!tab?.id) return;
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "SLC_COPY_PRODUCT" });
    if (response) return response;
  } catch (_) {}

  // On pages without our content script, provide a non-blocking explanation.
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        const id = "slc-fallback-toast";
        document.getElementById(id)?.remove();
        const node = document.createElement("div");
        node.id = id;
        node.textContent = text;
        node.style.cssText = "position:fixed;right:18px;bottom:20px;z-index:2147483647;background:#20242c;color:#fff;padding:12px 16px;border-radius:10px;font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 5px 20px #0004";
        document.documentElement.appendChild(node);
        setTimeout(() => node.remove(), 2200);
      },
      args: [chrome.i18n.getMessage("unsupportedPage") || "Website not supported"]
    });
  } catch (_) {}
}

chrome.action.onClicked.addListener(copyInTab);
