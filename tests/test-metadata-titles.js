const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

function extract(siteId, documentTitle) {
  const document = {
    title: documentTitle,
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
  const context = { document, globalThis: null };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(__dirname + '/../core/titleExtractor.js', 'utf8'), context);
  return context.SLC.extractTitle(siteId);
}

assert.strictEqual(
  extract('yahoo', '〖SHUTER〗FB-5336 樹德 巧麗耐重摺疊籃〖黑〗摺疊藍/水果籃/菜籃/野餐籃/折疊籃/衣物籃 | 折疊式 | Yahoo購物中心'),
  '〖SHUTER〗FB-5336 樹德 巧麗耐重摺疊籃〖黑〗摺疊藍/水果籃/菜籃/野餐籃/折疊籃/衣物籃'
);
assert.strictEqual(
  extract('etmall', 'E-life-陽離子大容量雙開整理箱100L-2入組|折疊收納箱|ETMall東森購物網'),
  'E-life-陽離子大容量雙開整理箱100L-2入組'
);
assert.strictEqual(
  extract('trplus', '泰國DKW 提把收納籃 沉穩灰 L｜層架收納｜特力屋．特力屋線上購物'),
  '泰國DKW 提把收納籃 沉穩灰 L'
);
console.log('metadata title tests passed.');
