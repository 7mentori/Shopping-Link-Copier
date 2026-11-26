# 建置報告 — Shopping Link Copier 1.0.0

## 正式版本內容

- 收錄 10 個購物網站的商品頁辨識、標題擷取及網址清理功能。
- 提供工具列圖示與網頁浮動按鈕兩種複製方式，不提供快捷鍵。
- 商店來源標示及複製後空白行預設開啟，且可分別設定。
- 支援繁體中文及英文介面，依 Chrome 語言自動切換。

## 實際驗收結果

以下網站均由使用者使用 Chrome 實際測試通過：

- PChome 24h
- momo 購物網
- 蝦皮購物
- Yahoo 購物中心
- 博客來
- 誠品線上
- 東森購物
- Coupang 酷澎
- 特力屋
- 露天拍賣

## 自動測試

- `node tests/test-url-normalizer.js`
- `node tests/test-momo-title.js`
- `node tests/test-momo-site-detection.js`
- `node tests/test-metadata-titles.js`
- `node tests/test-ruten-site-detection.js`
- `node tests/test-ruten-title.js`
- JavaScript 語法檢查
- Manifest 與語系 JSON 格式檢查

自動測試與實際網站驗收是不同層次的檢查；購物網站未來若調整頁面結構，仍可能需要更新對應 Parser。
