(function (root) {
  function walkJson(value, found) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach(v => walkJson(v, found)); return; }
    const type = value["@type"];
    const types = Array.isArray(type) ? type : [type];
    if (types.some(t => String(t || "").toLowerCase() === "product") && typeof value.name === "string") {
      found.push(value.name);
    }
    if (value["@graph"]) walkJson(value["@graph"], found);
    for (const [key, child] of Object.entries(value)) {
      if (key !== "@graph" && child && typeof child === "object") walkJson(child, found);
    }
  }

  function findProductJsonLd() {
    const found = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try { walkJson(JSON.parse(script.textContent), found); } catch (_) {}
    });
    return found.find(Boolean) || "";
  }

  function clean(value) {
    let title = String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    // Remove full category + store suffixes before generic suffix cleanup.
    title = title.replace(/\s*[|｜]\s*[^|｜]+\s*[|｜]\s*Yahoo購物中心$/i, "").trim();
    title = title.replace(/\s*[|｜]\s*[^|｜]+\s*[|｜]\s*ETMall東森購物網$/i, "").trim();
    title = title.replace(/\s*[|｜]\s*[^|｜]+\s*[|｜]\s*特力屋[．.]特力屋線上購物$/i, "").trim();
    const suffixes = [" - PChome 24h購物", " | momo購物網", "- momo購物網", " | 蝦皮購物", "- 蝦皮購物", " | Yahoo購物中心", " - 博客來", " | 誠品線上", " | 東森購物", " | 酷澎", " | 東森購物網", " - momo Shopping", " | Shopee"];
    for (const suffix of suffixes) if (title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
    // momo appends changing SEO text after the product name, for example:
    // " - momo購物網 - 好評推薦 -2026年11月".
    if (/momo購物網|momo shopping/i.test(title)) {
      title = title.replace(/\s*[-|｜]\s*momo購物網.*$/i, "").replace(/\s*[-|｜]\s*momo shopping.*$/i, "").trim();
    }
    return title;
  }

  function isMomoVariant(value) {
    const title = clean(value);
    if (!title) return true;
    // These are option labels / model codes, not a product's display name.
    if (/^(單一規格|規格選項|請選擇規格|請選擇商品規格)$/i.test(title)) return true;
    if (/^[A-Z]{1,8}[-_ ]?\d{1,5}[A-Z0-9-]*$/i.test(title) && title.length <= 24) return true;
    return false;
  }

  function extractMomoTitle() {
    // momo's generic H1 can point to the selected variant (e.g. "BC-160L")
    // or option label (e.g. "單一規格"). Prefer page-level product metadata.
    const metadataCandidates = [
      document.querySelector('meta[property="og:title"]')?.content,
      document.querySelector('meta[name="twitter:title"]')?.content,
      findProductJsonLd(),
      document.title
    ];
    for (const candidate of metadataCandidates) {
      const title = clean(candidate);
      if (title.length >= 3 && !isMomoVariant(title)) return title;
    }

    // Only use semantic product-name elements as a fallback. Do not use a
    // generic H1 on momo because it may contain the selected specification.
    const selectors = [
      '[itemprop="name"]',
      '.prdName',
      '.productName',
      '.product-name',
      '[class*="productTitle"]'
    ];
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      const value = clean(node?.textContent || node?.content);
      if (value.length >= 3 && !isMomoVariant(value)) return value;
    }
    return "";
  }

  function extract(siteId) {
    if (siteId === "momo") return extractMomoTitle();
    if (siteId === "ruten") {
      const candidates = [
        document.querySelector('meta[property="og:title"]')?.content,
        findProductJsonLd(),
        document.querySelector('h1')?.textContent,
        document.title
      ];
      for (const candidate of candidates) {
        const value = clean(candidate).replace(/\s*[|｜]\s*露天市集.*$/i, "").replace(/\s*[|｜]\s*露天拍賣.*$/i, "").trim();
        if (value.length >= 3) return value;
      }
      return "";
    }

    // These storefronts sometimes put the seller/category in the first H1.
    // Prefer product-level metadata before generic heading selectors.
    if (["yahoo", "etmall", "coupang", "trplus"].includes(siteId)) {
      const metadata = [
        findProductJsonLd(),
        document.querySelector('meta[property="og:title"]')?.content,
        document.querySelector('meta[name="twitter:title"]')?.content,
        document.title
      ];
      for (const candidate of metadata) {
        const value = clean(candidate);
        if (value.length >= 3 && !/^(西瓜籽辦公用品|折疊收納箱)$/i.test(value)) return value;
      }
    }
    const selectors = {
      pchome: ["h1", ".prod_name", ".prodTitle", "[data-testid='product-title']"],
      momo: ["h1.goodsTitle", "h1", ".prdName", ".goodsTitle"],
      shopee: ["h1", ".product-briefing h1", "[data-testid='pdp-product-title']"],
      yahoo: ["h1", ".ProductTitle", ".product-title"],
      books: ["h1", ".prodtitle", ".item-title"],
      eslite: ["h1", ".product-name", ".productName"],
      etmall: ["h1", ".product-name", ".goods-name"],
      coupang: ["h1", ".prod-buy-header__title", ".prod-title"],
      trplus: ["h1", "h2", "h3", "h4", "[itemprop='name']", ".product-name", ".productName"],
      ruten: ["h1", "[itemprop='name']"]
    };

    for (const selector of (selectors[siteId] || ["h1"])) {
      const node = document.querySelector(selector);
      const value = clean(node?.textContent);
      if (value && value.length >= 2) return value;
    }

    const jsonName = clean(findProductJsonLd());
    if (jsonName) return jsonName;

    const og = clean(document.querySelector('meta[property="og:title"]')?.content);
    if (og) return og;
    const twitter = clean(document.querySelector('meta[name="twitter:title"]')?.content);
    if (twitter) return twitter;

    return clean(document.title);
  }

  root.SLC = root.SLC || {};
  root.SLC.findProductJsonLd = findProductJsonLd;
  root.SLC.extractTitle = extract;
})(globalThis);
