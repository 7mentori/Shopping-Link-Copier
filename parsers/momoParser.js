(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.momo = {
    id: "momo",
    label: "momo",
    resolve: function () {
      const title = root.SLC.extractTitle("momo");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "momo" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "momo");
      return { title, url, site: "momo" };
    }
  };
})(globalThis);
