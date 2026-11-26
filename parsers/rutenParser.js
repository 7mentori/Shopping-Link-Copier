(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.ruten = {
    id: "ruten",
    label: "露天拍賣",
    resolve: function () {
      const title = root.SLC.extractTitle("ruten");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "ruten" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      return { title, url: root.SLC.normalizeUrl(candidate, "ruten"), site: "ruten" };
    }
  };
})(globalThis);
