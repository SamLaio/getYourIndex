# getYourIndex

這是一個可在 Chrome / Firefox 使用的擴充套件。

功能：

- 不取代新分頁頁面
- 用選項頁設定新分頁行為
- 可執行原本瀏覽器的新分頁動作
- Firefox 可開啟瀏覽器設定的首頁
- 可開啟你自己設定的網址

## 安裝

### Chrome

1. 打開 `chrome://extensions`
2. 執行 `pack-chrome.ps1`
3. 開啟「開發人員模式」
4. 將 `release/getYourIndex-chrome.zip` 解壓縮到測試資料夾
5. 選「載入未封裝項目」並指向解壓縮後的資料夾

### Firefox

1. 打開 `about:debugging#/runtime/this-firefox`
2. 執行 `pack-firefox.ps1`
3. 選「載入暫時附加元件」
4. 指向 `release/getYourIndex-firefox.xpi`

## 使用

- 按下 `+` 仍然會先走瀏覽器原本的新分頁流程
- 在外掛選項頁選擇要接手的模式
- 右上角擴充功能圖示會打開設定頁
- 第三個選項可以直接設定自訂網址

## 注意

- 瀏覽器首頁讀取需要 `browserSettings`，目前主要是 Firefox 可完整支援
- 自訂網址目前只接受 `http://`、`https://`，以及 `about:blank`
- Chrome 和 Firefox 需要不同的 manifest；打包腳本會各自使用正確版本

## License

GPL-3.0
