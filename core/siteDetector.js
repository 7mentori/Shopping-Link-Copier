(function (root) {
  const sites = {
    pchome: { hosts: ["24h.pchome.com.tw"], label: "PChome 24h", route: /\/prod\/[A-Za-z0-9-]+/i },
    momo: { hosts: ["momoshop.com.tw"], label: "momo", route: /\/(?:product\/\d+|goods\/GoodsDetail\.jsp|TP\/[^/]+\/goodsDetail\/[^/]+)/i },
    shopee: { hosts: ["shopee.tw"], label: "Shopee", route: /\/(?:[^/]+\/)?\d+\/\d+\/?$|\/i\.\d+\.\d+|(?:^|\/)[A-Za-z0-9_-]+\.\d+\.\d+\/?$/i },
    yahoo: { hosts: ["tw.buy.yahoo.com"], label: "Yahoo Shopping", route: /\/(?:gdsale|item)\//i },
    books: { hosts: ["books.com.tw"], label: "Books.com.tw", route: /\/products\/[A-Za-z0-9]+/i },
    eslite: { hosts: ["eslite.com"], label: "Eslite", route: /\/product\//i },
    etmall: { hosts: ["etmall.com.tw"], label: "ETMall", route: /\/(?:i|p|product|goods)\//i },
    coupang: { hosts: ["coupang.com.tw", "tw.coupang.com"], label: "Coupang", route: /\/(?:vp\/)?products?\/\d+/i },
    trplus: { hosts: ["trplus.com.tw"], label: "特力屋", route: /\/p\/[A-Za-z0-9]+/i },
    ruten: { hosts: ["ruten.com.tw"], label: "露天拍賣", route: /\/item\/\d+\/?$/i }
  };

  function getSite(urlLike) {
    let url;
    try { url = new URL(urlLike || location.href); } catch (_) { return null; }
    const host = url.hostname.toLowerCase();
    for (const [id, site] of Object.entries(sites)) {
      if (site.hosts.some(domain => host === domain || host.endsWith("." + domain))) {
        return { id, ...site };
      }
    }
    return null;
  }

  function isProductPage(site, urlLike) {
    if (!site) return false;
    let url;
    try { url = new URL(urlLike || location.href); } catch (_) { return false; }
    if (site.route.test(url.pathname)) {
      if (site.id !== "momo") return true;
      // Current momo product URLs carry the product ID in the path.
      if (/\/product\/\d+\/?$/i.test(url.pathname) || /\/TP\/[^/]+\/goodsDetail\/[^/]+\/?$/i.test(url.pathname)) return true;
      // Legacy GoodsDetail URLs carry the product ID in a query parameter.
      return Boolean(url.searchParams.get("i_code") || url.searchParams.get("goodsCode") || url.searchParams.get("goods_no"));
    }
    const ogType = document.querySelector('meta[property="og:type"]')?.content?.toLowerCase() || "";
    const hasProductJson = Boolean(root.SLC?.findProductJsonLd?.());
    return ogType.includes("product") || hasProductJson;
  }

  root.SLC = root.SLC || {};
  root.SLC.sites = sites;
  root.SLC.getSite = getSite;
  root.SLC.isProductPage = isProductPage;
})(globalThis);
