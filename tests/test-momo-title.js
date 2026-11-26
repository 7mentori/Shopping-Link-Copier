const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

function runMomoTitleTest({ ogTitle, documentTitle, h1Text }) {
  const elements = {
    'meta[property="og:title"]': ogTitle ? { content: ogTitle } : null,
    'meta[name="twitter:title"]': null,
    'h1': h1Text ? { textContent: h1Text } : null
  };
  const document = {
    title: documentTitle || '',
    querySelector(selector) { return elements[selector] || null; },
    querySelectorAll() { return []; }
  };
  const context = { document, globalThis: null };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(__dirname + '/../core/titleExtractor.js', 'utf8'), context);
  return context.SLC.extractTitle('momo');
}

assert.strictEqual(
  runMomoTitleTest({
    ogTitle: 'YouPin 冷凍櫃 冰櫃 家用160L冷凍櫃 保鮮櫃 110v（冷藏櫃 冷凍櫃 保鮮櫃） - momo購物網 - 好評推薦 -2026年11月',
    documentTitle: 'BC-160L',
    h1Text: 'BC-160L'
  }),
  'YouPin 冷凍櫃 冰櫃 家用160L冷凍櫃 保鮮櫃 110v（冷藏櫃 冷凍櫃 保鮮櫃）'
);

assert.strictEqual(
  runMomoTitleTest({
    ogTitle: null,
    documentTitle: '〖Logitech 羅技〗MX Master 4 無線滑鼠(創作大師限量版) - momo購物網 - 好評推薦 -2026年11月',
    h1Text: '單一規格'
  }),
  '〖Logitech 羅技〗MX Master 4 無線滑鼠(創作大師限量版)'
);

console.log('momo title regression tests passed.');
