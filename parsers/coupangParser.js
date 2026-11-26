(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.coupang = {
    id: "coupang",
    label: "Coupang",
    resolve: function () {
      const title = root.SLC.extractTitle("coupang");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "coupang" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "coupang");
      return { title, url, site: "coupang" };
    }
  };
})(globalThis);
