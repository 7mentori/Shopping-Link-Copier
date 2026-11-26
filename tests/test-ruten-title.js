const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const expected = '現貨免運 洗衣籃 髒衣籃 折疊洗衣籃 折疊髒衣籃 汙衣籃 髒衣收納籃 簡約髒衣籃 髒衣收納籃 洗衣納籃';
const nodes = {
  'meta[property="og:title"]': { content: expected + ' | 露天市集 | 全台最大的網路購物市集' },
  'meta[name="twitter:title"]': null,
  'h1': { textContent: expected }
};
const document = {
  title: expected + ' | 露天市集 | 全台最大的網路購物市集',
  querySelector: (selector) => nodes[selector] || null,
  querySelectorAll: () => []
};
const context = { document, globalThis: null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname + '/../core/titleExtractor.js', 'utf8'), context);
assert.strictEqual(context.SLC.extractTitle('ruten'), expected);
console.log('Ruten title extraction tests passed.');
