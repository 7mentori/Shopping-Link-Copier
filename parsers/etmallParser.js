(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.etmall = {
    id: "etmall",
    label: "ETMall",
    resolve: function () {
      const title = root.SLC.extractTitle("etmall");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "etmall" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "etmall");
      return { title, url, site: "etmall" };
    }
  };
})(globalThis);
