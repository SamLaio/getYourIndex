# getYourIndex

這是一個可在 Chrome / Firefox 使用的擴充套件。

功能：

- 不取代新分頁頁面
- 用選項頁設定新分頁行為
- 可執行原本瀏覽器的新分頁動作
- 可開啟瀏覽器設定的首頁
- 可開啟你自己設定的網址

## 安裝

### Chrome

1. 打開 `chrome://extensions`
2. 先執行 `use-chrome.ps1`
3. 開啟「開發人員模式」
4. 選「載入未封裝項目」
5. 指向這個資料夾

### Firefox

1. 打開 `about:debugging#/runtime/this-firefox`
2. 先執行 `use-firefox.ps1`
3. 選「載入暫時附加元件」
4. 指向這個資料夾裡的 `manifest.json`

## 使用

- 按下 `+` 仍然會先走瀏覽器原本的新分頁流程
- 在外掛選項頁選擇要接手的模式
- 右上角擴充功能圖示會打開設定頁
- 第三個選項可以直接設定自訂網址

## 注意

- 瀏覽器首頁讀取需要 `browserSettings`，目前主要是 Firefox 可完整支援
- 自訂網址目前只接受 `http://`、`https://`，以及 `about:blank`
- Chrome 和 Firefox 需要不同的 manifest；Firefox 用目前預設 `manifest.json`，Chrome 請先切到 Chrome 版

## License

GPL-3.0
