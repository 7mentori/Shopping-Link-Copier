(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.eslite = {
    id: "eslite",
    label: "Eslite",
    resolve: function () {
      const title = root.SLC.extractTitle("eslite");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "eslite" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      const url = root.SLC.normalizeUrl(candidate, "eslite");
      return { title, url, site: "eslite" };
    }
  };
})(globalThis);
