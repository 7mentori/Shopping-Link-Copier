(function (root) {
  function resolve() {
    const site = root.SLC.getSite(location.href);
    if (!site || !root.SLC.isProductPage(site, location.href)) {
      return { success: false, error: "PRODUCT_PAGE_NOT_DETECTED", site: site?.id || null };
    }
    const parser = root.SLC.parsers?.[site.id];
    if (!parser) return { success: false, error: "PARSER_NOT_FOUND", site: site.id };
    const data = parser.resolve();
    if (!data.title || data.title.length < 2) return { success: false, error: "TITLE_NOT_FOUND", site: site.id };
    if (!data.url) return { success: false, error: "URL_INVALID", site: site.id };
    let parsed;
    try { parsed = new URL(data.url); } catch (_) { return { success: false, error: "URL_INVALID", site: site.id }; }
    if (parsed.hostname !== location.hostname) return { success: false, error: "URL_INVALID", site: site.id };
    return { success: true, title: data.title, url: data.url, site: site.id };
  }
  root.SLC = root.SLC || {};
  root.SLC.resolveProduct = resolve;
})(globalThis);
