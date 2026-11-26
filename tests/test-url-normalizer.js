const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const context = { URL, URLSearchParams, location: { href: 'https://example.com/' }, globalThis: null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname + '/../core/urlNormalizer.js', 'utf8'), context);
const normalize = context.SLC.normalizeUrl;
assert.strictEqual(
  normalize('https://24h.pchome.com.tw/prod/DEAO6A-A9009VV9C?fq=/S/DEAO6A&_gl=abc&utm_source=test', 'pchome'),
  'https://24h.pchome.com.tw/prod/DEAO6A-A9009VV9C'
);
assert.strictEqual(
  normalize('https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=123456&Area=SEARCH&mdiv=100&gclid=abc', 'momo'),
  'https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=123456'
);
assert.strictEqual(
  normalize('https://www.tw.coupang.com/products/159823811264514?itemId=456&vendorItemId=789&utm_source=abc', 'coupang'),
  'https://www.tw.coupang.com/products/159823811264514'
);
assert.strictEqual(
  normalize('https://shopee.tw/product/4169123/251077951?gclid=abc&gad_source=1', 'shopee'),
  'https://shopee.tw/product/4169123/251077951'
);
assert.strictEqual(
  normalize('https://shopee.tw/item-name-i.4169123.251077951?gads_t_sig=abc', 'shopee'),
  'https://shopee.tw/product/4169123/251077951'
);
assert.strictEqual(
  normalize('https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=p0031265275098&gg=0&gclid=abc', 'yahoo'),
  'https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=p0031265275098'
);
assert.strictEqual(
  normalize('https://www.etmall.com.tw/i/7378298?utm_source=abc', 'etmall'),
  'https://www.etmall.com.tw/i/7378298'
);
assert.strictEqual(
  normalize('https://www.trplus.com.tw/p/014384440?cateCode=EC_20121222', 'trplus'),
  'https://www.trplus.com.tw/p/014384440'
);
assert.strictEqual(
  normalize('https://www.momoshop.com.tw/TP/TP0009545/goodsDetail/TP00095450000036?entpCode=TP0009545&i_code=TP00095450000036&utm_source=abc', 'momo'),
  'https://www.momoshop.com.tw/TP/TP0009545/goodsDetail/TP00095450000036'
);
assert.strictEqual(
  normalize('https://www.ruten.com.tw/item/22543230235382/?utm_source=google&gclid=abc', 'ruten'),
  'https://www.ruten.com.tw/item/22543230235382/'
);
console.log('URL normalizer tests passed.');
