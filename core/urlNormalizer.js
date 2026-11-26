(function (root) {
  const trackingKeys = new Set([
    "fbclid", "gclid", "dclid", "gbraid", "wbraid", "msclkid", "yclid",
    "_ga", "_gl", "_gac", "_fplc", "_gcl_aw", "_gcl_au", "ref", "ref_",
    "scm", "spm", "source", "from", "campaignid", "affiliateid", "wpcid", "wref", "wtime", "lptag", "af_c_id", "mcid", "af_sub5", "src", "ctag", "spec", "addtag", "network", "gg", "co_servername", "gclsrc"
  ]);

  function isTrackingKey(key) {
    const k = key.toLowerCase();
    return trackingKeys.has(k) || k.startsWith("utm_") || k.startsWith("ga_");
  }

  function normalize(urlLike, siteId) {
    let url;
    try { url = new URL(urlLike, location.href); } catch (_) { return ""; }
    if (!/^https?:$/.test(url.protocol)) return "";

    // These product identifiers are fully represented in their URL path.
    const pathOnly = {
      pchome: /\/prod\/[A-Za-z0-9-]+/i,
      etmall: /\/(?:i|p|product|goods)\/[A-Za-z0-9_-]+/i,
      coupang: /\/(?:vp\/)?products?\/\d+/i,
      trplus: /\/p\/[A-Za-z0-9_-]+/i,
      ruten: /\/item\/\d+\/?$/i,
      momo: /\/TP\/[^/]+\/goodsDetail\/[^/]+/i
    };
    if (pathOnly[siteId]?.test(url.pathname)) return `${url.origin}${url.pathname}`;

    if (siteId === "shopee") {
      // Shopee's canonical SEO slug ( ...-i.shopId.itemId ) is less stable
      // than its permanent numeric product route.
      const slug = url.pathname.match(/(?:^|\/)[^/]*-i\.(\d+)\.(\d+)\/?$/i);
      const numeric = url.pathname.match(/\/product\/(\d+)\/(\d+)\/?$/i);
      if (slug) return `${url.origin}/product/${slug[1]}/${slug[2]}`;
      if (numeric) return `${url.origin}/product/${numeric[1]}/${numeric[2]}`;
    }

    if (siteId === "yahoo" && /\/gdsale\/gdsale\.asp$/i.test(url.pathname)) {
      const id = url.searchParams.get("gdid");
      return id ? `${url.origin}${url.pathname}?gdid=${encodeURIComponent(id)}` : `${url.origin}${url.pathname}`;
    }
    if (siteId === "momo" && /\/goods\/GoodsDetail\.jsp$/i.test(url.pathname)) {
      const id = url.searchParams.get("i_code") || url.searchParams.get("goodsCode") || url.searchParams.get("goods_no");
      return id ? `${url.origin}${url.pathname}?i_code=${encodeURIComponent(id)}` : `${url.origin}${url.pathname}`;
    }

    const kept = new URLSearchParams();
    for (const [key, value] of url.searchParams.entries()) {
      if (!isTrackingKey(key)) kept.append(key, value);
    }
    url.search = kept.toString();
    url.hash = "";
    return url.toString();
  }

  root.SLC = root.SLC || {};
  root.SLC.normalizeUrl = normalize;
})(globalThis);
