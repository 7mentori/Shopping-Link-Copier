(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.pchome = {
    id: "pchome",
    label: "PChome 24h",
    resolve: function () {
      const title = root.SLC.extractTitle("pchome");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "pchome" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "pchome");
      return { title, url, site: "pchome" };
    }
  };
})(globalThis);
