# Manual Test Plan — Shopping Link Copier 1.0.0

## Existing verified sites
- [x] PChome 24h — user-confirmed PASS
- [x] momo `/product/{id}` — user-confirmed PASS in 1.0.1
- [x] Books.com.tw — user-confirmed PASS
- [x] Eslite Online — user-confirmed PASS

## Regression tests for 1.0.4
- [ ] momo TP store URL: title, product recognition, path-only clean URL
- [ ] Shopee: title and canonical numeric `/product/{shopId}/{itemId}` URL
- [ ] Yahoo Shopping: product title, preserve only `gdid`
- [ ] ETMall: product title and path-only URL
- [ ] Coupang: product recognition, title and path-only URL
- [ ] TRPLUS: product recognition, title and path-only URL
- [ ] Optional trailing blank lines: default off; when on, clipboard ends with `\n\n`
- [ ] Recheck PChome, momo, Shopee, Yahoo, Books.com.tw, Eslite, ETMall, Coupang, and TRPLUS after update

## Per-site manual checks
1. Open the exact sample product page.
2. Confirm floating button appears.
3. Click floating button and paste into a plain-text editor.
4. Confirm product title is not a seller name, category, or variant label.
5. Confirm URL opens the same product and tracking parameters are removed.
6. Click toolbar extension icon and repeat.
7. Confirm category/search pages do not show the floating button.


## 正式版本功能驗收
- Ruten: `https://www.ruten.com.tw/item/22543230235382/` should resolve to the provided product title and clean `/item/22543230235382/` URL.
- Store source prefix: enabled by default; output starts with `[商店名稱] 商品標題`.
- Append blank lines: enabled by default; output ends with two newline characters after the URL.
- Both settings can be independently disabled in Options.
