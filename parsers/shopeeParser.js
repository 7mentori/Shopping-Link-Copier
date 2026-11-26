(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.shopee = {
    id: "shopee",
    label: "Shopee",
    resolve: function () {
      const title = root.SLC.extractTitle("shopee");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "shopee" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "shopee");
      return { title, url, site: "shopee" };
    }
  };
})(globalThis);
