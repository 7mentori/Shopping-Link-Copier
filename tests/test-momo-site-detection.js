const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const document = { querySelector() { return null; } };
const context = { URL, document, location: { href: 'https://www.momoshop.com.tw/' }, globalThis: null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname + '/../core/siteDetector.js', 'utf8'), context);

const { getSite, isProductPage } = context.SLC;
const current = 'https://www.momoshop.com.tw/product/14901406';
const currentSite = getSite(current);
assert.strictEqual(currentSite.id, 'momo');
assert.strictEqual(isProductPage(currentSite, current), true);

const current2 = 'https://www.momoshop.com.tw/product/15770189';
assert.strictEqual(isProductPage(getSite(current2), current2), true);

const legacy = 'https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=123456';
assert.strictEqual(isProductPage(getSite(legacy), legacy), true);

const category = 'https://www.momoshop.com.tw/category/LgrpCategory.jsp?l_code=2120800000';
assert.strictEqual(isProductPage(getSite(category), category), false);

const momoTp = 'https://www.momoshop.com.tw/TP/TP0009545/goodsDetail/TP00095450000036?i_code=TP00095450000036';
assert.strictEqual(isProductPage(getSite(momoTp), momoTp), true);
const trplus = 'https://www.trplus.com.tw/p/014384440';
assert.strictEqual(getSite(trplus).id, 'trplus');
assert.strictEqual(isProductPage(getSite(trplus), trplus), true);
const coupang = 'https://www.tw.coupang.com/products/159823811264514';
assert.strictEqual(getSite(coupang).id, 'coupang');
assert.strictEqual(isProductPage(getSite(coupang), coupang), true);
console.log('site detection tests passed.');
