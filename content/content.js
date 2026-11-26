(function () {
  if (window.__SLC_CONTENT_LOADED__) return;
  window.__SLC_CONTENT_LOADED__ = true;

  const defaults = {
    floatingButtonEnabled: true,
    floatingPosition: { right: 24, bottom: 120 },
    showNotification: true,
    notificationDuration: 2000,
    appendBlankLines: true,
  includeStoreSource: true,
    websites: { pchome: true, momo: true, shopee: true, yahoo: true, books: true, eslite: true, etmall: true, coupang: true, trplus: true, ruten: true }
  };
  let settings = structuredClone(defaults);
  let buttonHost = null;
  let button = null;
  let lastUrl = location.href;
  let dragging = false;
  let moved = false;
  let pointerStart = null;
  let position = { ...defaults.floatingPosition };
  let toastTimer = null;

  const messages = {
    PRODUCT_PAGE_NOT_DETECTED: ["無法辨識商品頁面", "Product page not detected"],
    TITLE_NOT_FOUND: ["無法取得商品標題", "Unable to retrieve product title"],
    URL_INVALID: ["無法取得有效的商品網址", "Unable to obtain a valid product URL"],
    PARSER_NOT_FOUND: ["目前網站的解析模組尚未就緒", "The website parser is unavailable"],
    WEBSITE_DISABLED: ["此網站已停用複製功能", "Copying is disabled for this website"],
    UNSUPPORTED: ["目前網站尚未支援", "Website not supported"],
    COPY_FAILED: ["複製失敗，請稍後再試", "Copy failed. Please try again"],
    SUCCESS: ["已複製商品標題與網址！", "Product title and URL copied!"]
  };

  function langIndex() {
    return (chrome.i18n.getUILanguage() || "en").toLowerCase().startsWith("zh-tw") ? 0 : 1;
  }
  function msg(code) { return messages[code]?.[langIndex()] || code; }

  async function loadSettings() {
    try {
      const saved = await chrome.storage.local.get(defaults);
      settings = { ...defaults, ...saved, websites: { ...defaults.websites, ...(saved.websites || {}) } };
      position = { ...(settings.floatingPosition || defaults.floatingPosition) };
    } catch (_) {}
  }

  function showToast(text, success) {
    if (success && !settings.showNotification) return;
    let host = document.getElementById("slc-toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "slc-toast-host";
      host.style.cssText = "all:initial;position:fixed;inset:auto 18px 22px auto;z-index:2147483647;pointer-events:none;";
      const shadow = host.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>
        .toast{font:600 13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff;background:#20242c;border:1px solid rgba(255,255,255,.13);border-radius:12px;padding:12px 16px;box-shadow:0 8px 28px rgba(0,0,0,.24);display:flex;align-items:center;gap:9px;max-width:min(360px,calc(100vw - 40px));opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease;}
        .toast.show{opacity:1;transform:translateY(0)}.dot{width:9px;height:9px;border-radius:50%;background:#22c55e;flex:none}.toast.error .dot{background:#f59e0b}
      </style><div class="toast"><span class="dot"></span><span class="text"></span></div>`;
      document.documentElement.appendChild(host);
    }
    const toast = host.shadowRoot.querySelector(".toast");
    toast.classList.toggle("error", !success);
    host.shadowRoot.querySelector(".text").textContent = text;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => host.remove(), 250);
    }, settings.notificationDuration || 2000);
  }

  async function writeClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch (_) { return false; }
  }

  async function performCopy() {
    const site = SLC.getSite(location.href);
    if (!site) {
      showToast(msg("UNSUPPORTED"), false);
      return { success: false, error: "UNSUPPORTED" };
    }
    if (!settings.websites?.[site.id]) {
      showToast(msg("WEBSITE_DISABLED"), false);
      return { success: false, error: "WEBSITE_DISABLED" };
    }
    const result = SLC.resolveProduct();
    if (!result.success) {
      showToast(msg(result.error), false);
      return result;
    }
    const sourceNames = {
      pchome: "PChome 24h購物", momo: "momo 購物網", shopee: "蝦皮購物",
      yahoo: "Yahoo 購物中心", books: "博客來", eslite: "誠品線上",
      etmall: "東森購物", coupang: "Coupang 酷澎", trplus: "特力屋", ruten: "露天拍賣"
    };
    const titleLine = settings.includeStoreSource !== false ? `[${sourceNames[result.site] || result.site}] ${result.title}` : result.title;
    const text = `${titleLine}\n${result.url}${settings.appendBlankLines !== false ? "\n\n" : ""}`;
    const copied = await writeClipboard(text);
    if (!copied) {
      showToast(msg("COPY_FAILED"), false);
      return { success: false, error: "COPY_FAILED" };
    }
    showToast(msg("SUCCESS"), true);
    return { success: true, title: result.title, url: result.url, site: result.site };
  }

  function createButton() {
    if (buttonHost || !document.documentElement) return;
    buttonHost = document.createElement("div");
    buttonHost.id = "slc-floating-host";
    buttonHost.style.cssText = "all:initial;position:fixed;z-index:2147483646;right:24px;bottom:120px;";
    const shadow = buttonHost.attachShadow({ mode: "open" });
    shadow.innerHTML = `<style>
      .slc-btn{all:initial;box-sizing:border-box;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#242a35;color:#fff;opacity:.88;box-shadow:0 4px 16px rgba(0,0,0,.24);cursor:pointer;user-select:none;touch-action:none;border:1px solid rgba(255,255,255,.22);transition:transform .15s,opacity .15s;}
      .slc-btn:hover{opacity:1;transform:scale(1.06)}.slc-btn:active{transform:scale(.96)}.slc-btn svg{width:21px;height:21px;pointer-events:none}
      .slc-btn:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}
    </style><button class="slc-btn" type="button" aria-label="Copy product title and URL" title="Copy product title and URL"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2"/></svg></button>`;
    button = shadow.querySelector("button");
    button.title = chrome.i18n.getMessage("floatingButtonTitle") || "Copy product title and URL";
    button.addEventListener("pointerdown", onPointerDown);
    button.addEventListener("pointermove", onPointerMove);
    button.addEventListener("pointerup", onPointerUp);
    button.addEventListener("pointercancel", onPointerUp);
    button.addEventListener("click", () => { if (!moved) performCopy(); });
    document.documentElement.appendChild(buttonHost);
    applyPosition();
  }

  function applyPosition() {
    if (!buttonHost) return;
    const maxRight = Math.max(0, window.innerWidth - 46 - 8);
    const maxBottom = Math.max(0, window.innerHeight - 46 - 8);
    position.right = Math.min(maxRight, Math.max(8, Number(position.right ?? 24)));
    position.bottom = Math.min(maxBottom, Math.max(8, Number(position.bottom ?? 120)));
    buttonHost.style.right = `${position.right}px`;
    buttonHost.style.bottom = `${position.bottom}px`;
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    dragging = true;
    moved = false;
    pointerStart = { x: event.clientX, y: event.clientY, right: position.right, bottom: position.bottom };
    button.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event) {
    if (!dragging || !pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (!moved) return;
    position.right = pointerStart.right - dx;
    position.bottom = pointerStart.bottom - dy;
    applyPosition();
  }
  async function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      await chrome.storage.local.set({ floatingPosition: position });
      setTimeout(() => { moved = false; }, 80);
    }
    pointerStart = null;
  }

  function updatePageState() {
    const site = SLC.getSite(location.href);
    const isProduct = site && SLC.isProductPage(site, location.href);
    const enabled = Boolean(site && settings.websites?.[site.id]);
    if (settings.floatingButtonEnabled && isProduct && enabled) {
      createButton();
      if (buttonHost) buttonHost.style.display = "block";
    } else if (buttonHost) {
      buttonHost.style.display = "none";
    }
    lastUrl = location.href;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "SLC_COPY_PRODUCT") {
      performCopy().then(sendResponse).catch(() => sendResponse({ success: false, error: "COPY_FAILED" }));
      return true;
    }
    return false;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    loadSettings().then(() => { applyPosition(); updatePageState(); });
  });

  window.addEventListener("resize", applyPosition);
  window.addEventListener("popstate", updatePageState);
  window.addEventListener("hashchange", updatePageState);

  loadSettings().then(updatePageState);
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) updatePageState();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(() => { if (location.href !== lastUrl) updatePageState(); }, 1200);
})();
