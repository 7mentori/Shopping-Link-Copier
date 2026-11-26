(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.yahoo = {
    id: "yahoo",
    label: "Yahoo Shopping",
    resolve: function () {
      const title = root.SLC.extractTitle("yahoo");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "yahoo" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "yahoo");
      return { title, url, site: "yahoo" };
    }
  };
})(globalThis);
