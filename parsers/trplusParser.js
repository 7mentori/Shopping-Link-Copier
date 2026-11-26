(function (root) {
  root.SLC = root.SLC || {};
  root.SLC.parsers = root.SLC.parsers || {};
  root.SLC.parsers.trplus = {
    id: "trplus",
    label: "特力屋",
    resolve: function () {
      const title = root.SLC.extractTitle("trplus");
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const canonicalSite = canonical ? root.SLC.getSite(canonical) : null;
      const candidate = canonicalSite?.id === "trplus" && root.SLC.isProductPage(canonicalSite, canonical) ? canonical : location.href;
      return { title, url: root.SLC.normalizeUrl(candidate, "trplus"), site: "trplus" };
    }
  };
})(globalThis);
